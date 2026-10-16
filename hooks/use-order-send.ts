"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch, readJson } from "@/lib/api";
import { MAX_FILE_BYTES } from "@/lib/limits";
import { forgetUpload, matchUploadFiles, readUpload, rememberUpload, uploadFile } from "@/lib/upload-client";
import type { OpenUpload, UploadTarget } from "@/types/upload";

export type ChosenFile = {
  key: string;
  file: File;
  kind: string;
  status: "waiting" | "sending" | "sent";
  ratio: number;
};

type Pair = { key: string; target: UploadTarget; file: File };

type Options = {
  serviceHref: string | null;
  getNote: () => string;
  blocked?: boolean;
  resumeAfterRemove?: boolean;
  keepProgressOnError?: boolean;
  onSent?: () => void;
};

function savedUpload(serviceHref: string | null) {
  if (typeof window === "undefined" || !serviceHref) return null;
  return readUpload(serviceHref);
}

export function useOrderSend({
  serviceHref,
  getNote,
  blocked = false,
  resumeAfterRemove = false,
  keepProgressOnError = false,
  onSent,
}: Options) {
  const [files, setFiles] = useState<ChosenFile[]>([]);
  const [pending, setPending] = useState<OpenUpload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const filesRef = useRef<ChosenFile[]>([]);
  const pendingRef = useRef<OpenUpload | null>(null);
  const sendController = useRef<AbortController | null>(null);
  const activeOrderId = useRef<string | null>(null);
  const batchKeys = useRef<Set<string>>(new Set());
  const stopReason = useRef<"remove" | null>(null);
  const getNoteRef = useRef(getNote);
  const onSentRef = useRef(onSent);
  const serviceHrefRef = useRef(serviceHref);
  const blockedRef = useRef(blocked);

  useEffect(() => {
    getNoteRef.current = getNote;
    onSentRef.current = onSent;
    serviceHrefRef.current = serviceHref;
    blockedRef.current = blocked;
  }, [blocked, getNote, onSent, serviceHref]);

  const updateFiles = useCallback((recipe: (current: ChosenFile[]) => ChosenFile[]) => {
    const next = recipe(filesRef.current);
    filesRef.current = next;
    setFiles(next);
  }, []);

  const rememberPending = useCallback((next: OpenUpload | null) => {
    pendingRef.current = next;
    setPending(next);
  }, []);

  useEffect(() => {
    filesRef.current = [];
    const saved = savedUpload(serviceHref);
    activeOrderId.current = saved?.orderId ?? null;
    /* eslint-disable react-hooks/set-state-in-effect -- an open upload is stored in localStorage */
    setFiles([]);
    setSent(false);
    setError(null);
    setUnauthorized(false);
    setActiveKeys([]);
    setBusy(false);
    rememberPending(saved);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [rememberPending, serviceHref]);

  const addFiles = useCallback(
    (kind: string, list: FileList | null) => {
      const picked = Array.from(list ?? []).map((file) => ({
        key: `${kind}-${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        kind,
        status: "waiting" as const,
        ratio: 0,
      }));
      if (picked.length === 0) return;
      updateFiles((current) => [...current, ...picked]);
    },
    [updateFiles],
  );

  const replaceFiles = useCallback(
    (list: File[]) => {
      updateFiles(() =>
        list.map((file, index) => ({
          key: `${file.name}-${file.size}-${index}`,
          file,
          kind: "files",
          status: "waiting" as const,
          ratio: 0,
        })),
      );
    },
    [updateFiles],
  );

  const removeKey = useCallback(
    (key: string, sentLocked: boolean) => {
      const target = filesRef.current.find((item) => item.key === key);
      if (!target || (sentLocked && target.status === "sent")) return;
      updateFiles((current) => current.filter((item) => item.key !== key));
      if (!sendController.current) return;
      stopReason.current = resumeAfterRemove ? "remove" : null;
      sendController.current.abort();
    },
    [resumeAfterRemove, updateFiles],
  );

  const markFile = useCallback(
    (key: string, status: ChosenFile["status"], ratio: number) => {
      updateFiles((current) => current.map((item) => (item.key === key ? { ...item, status, ratio } : item)));
    },
    [updateFiles],
  );

  const sendPairs = useCallback(
    async (pairs: Pair[], signal: AbortSignal) => {
      for (let index = 0; index < pairs.length; index += 1) {
        if (signal.aborted) throw new DOMException("Send stopped.", "AbortError");
        const pair = pairs[index];
        if (!pair) continue;
        markFile(pair.key, "sending", 0);
        await uploadFile(pair.file, pair.target, (ratio) => markFile(pair.key, "sending", ratio), signal);
        markFile(pair.key, "sent", 1);
      }
    },
    [markFile],
  );

  const send = useCallback(async () => {
    let again = true;
    while (again) {
      again = false;
      const href = serviceHrefRef.current;
      const chosen = filesRef.current.filter((item) => item.status !== "sent");
      if (!href || chosen.length === 0 || sendController.current || blockedRef.current) return;
      const tooLarge = chosen.find((item) => item.file.size > MAX_FILE_BYTES);
      if (tooLarge) {
        setError(`${tooLarge.file.name} is over 100 GB.`);
        return;
      }

      const controller = new AbortController();
      sendController.current = controller;
      const keys = chosen.map((item) => item.key);
      batchKeys.current = new Set(keys);
      setActiveKeys(keys);
      setBusy(true);
      setError(null);
      setSent(false);

      try {
        const currentPending = pendingRef.current;
        const matched = currentPending ? matchUploadFiles(currentPending.files, chosen.map((item) => item.file)) : null;
        if (matched && currentPending) {
          const pairs = matched
            .map((pair) => {
              const source = chosen.find((item) => item.file === pair.file);
              return source ? { key: source.key, target: pair.target, file: pair.file } : null;
            })
            .filter((pair): pair is Pair => Boolean(pair));
          await sendPairs(pairs, controller.signal);
          forgetUpload(href);
          rememberPending(null);
        } else {
          const response = await apiFetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serviceHref: href,
              note: getNoteRef.current(),
              files: chosen.map((item) => ({ name: item.file.name, size: item.file.size, type: item.file.type })),
            }),
            signal: controller.signal,
          });
          const data = await readJson<{ error?: string; orderId?: string; files?: UploadTarget[] }>(response);
          if (response.status === 401) {
            setUnauthorized(true);
            setActiveKeys([]);
            setError("Verify your identity before you place an order.");
            return;
          }
          if (!response.ok || !data?.orderId || !data.files) {
            throw new Error(data?.error || "The order could not be opened.");
          }
          activeOrderId.current = data.orderId;
          const openUpload: OpenUpload = { serviceHref: href, orderId: data.orderId, files: data.files };
          rememberUpload(openUpload);
          rememberPending(openUpload);
          const pairs = data.files
            .map((target, index) => {
              const source = chosen[index];
              return source ? { key: source.key, target, file: source.file } : null;
            })
            .filter((pair): pair is Pair => Boolean(pair));
          await sendPairs(pairs, controller.signal);
          forgetUpload(href);
          rememberPending(null);
        }
        setSent(true);
        onSentRef.current?.();
      } catch (caught) {
        if (controller.signal.aborted || (caught instanceof DOMException && caught.name === "AbortError")) {
          const orderId = activeOrderId.current;
          if (orderId) void apiFetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
          activeOrderId.current = null;
          forgetUpload(href);
          rememberPending(null);
          const removed = stopReason.current === "remove";
          stopReason.current = null;
          updateFiles((current) =>
            current.map((item) => (batchKeys.current.has(item.key) ? { ...item, status: "waiting", ratio: 0 } : item)),
          );
          setActiveKeys([]);
          if (removed) {
            setError(null);
            again = filesRef.current.some((item) => item.status !== "sent");
          } else {
            setError("Send stopped. This order is cancelled.");
          }
        } else {
          if (!keepProgressOnError) {
            updateFiles((current) =>
              current.map((item) => (item.status === "sending" ? { ...item, status: "waiting", ratio: 0 } : item)),
            );
          }
          setError(caught instanceof Error ? caught.message : "The send stopped. Choose the same files again to continue.");
          rememberPending(readUpload(href));
        }
      } finally {
        if (sendController.current === controller) sendController.current = null;
        setBusy(false);
      }
    }
  }, [keepProgressOnError, rememberPending, sendPairs, updateFiles]);

  const resume = pending ? matchUploadFiles(pending.files, files.map((item) => item.file)) : null;

  return {
    files,
    pending,
    error,
    sent,
    busy,
    unauthorized,
    activeKeys,
    resume: Boolean(resume),
    addFiles,
    replaceFiles,
    removeKey,
    send,
  };
}
