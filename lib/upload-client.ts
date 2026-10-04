import { apiFetch } from "@/lib/api";

export type UploadTarget = {
  id: string;
  name: string;
  size: number;
  partSize: number;
  partCount: number;
  mode: "presigned" | "direct";
};

type SignedPart = { partNumber: number; url: string };

const STORAGE_PREFIX = "hans-pixel-upload:";

export type OpenUpload = {
  serviceHref: string;
  orderId: string;
  files: UploadTarget[];
};

async function readError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  if (data && typeof data.error === "string") return data.error;
  return "The request failed.";
}

async function postJson<T>(url: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await apiFetch(url, {
    method: "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as T;
}

function partByteLength(partNumber: number, size: number, partSize: number) {
  const start = (partNumber - 1) * partSize;
  return Math.min(partSize, size - start);
}

function stopped() {
  return new DOMException("Send stopped.", "AbortError");
}

async function putChunk(url: string, chunk: Blob, credentials: RequestCredentials, signal?: AbortSignal) {
  let last = "A piece of the file failed to send.";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (signal?.aborted) throw stopped();
    try {
      const response = await fetch(url, { method: "PUT", body: chunk, credentials, signal });
      if (response.ok) return response;
      last = await readError(response);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      last = "The connection dropped while a piece was sending.";
    }
  }
  throw new Error(last);
}

async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item === undefined) return;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

export async function uploadFile(
  file: File,
  target: UploadTarget,
  onProgress: (ratio: number) => void,
  signal?: AbortSignal,
) {
  if (signal?.aborted) throw stopped();
  const status = await apiFetch(`/api/uploads/${target.id}`, { signal });
  if (!status.ok) throw new Error(await readError(status));
  const current = (await status.json()) as { status?: string; completedParts?: number[] };
  if (current.status === "complete") {
    onProgress(1);
    return;
  }

  const done = new Set(current.completedParts ?? []);
  let sent = 0;
  for (const partNumber of done) sent += partByteLength(partNumber, target.size, target.partSize);
  onProgress(target.size === 0 ? 1 : sent / target.size);

  const pending: number[] = [];
  for (let partNumber = 1; partNumber <= target.partCount; partNumber += 1) {
    if (!done.has(partNumber)) pending.push(partNumber);
  }

  while (pending.length > 0) {
    if (signal?.aborted) throw stopped();
    const batch = pending.splice(0, 8);
    const signed = await postJson<{ mode: "presigned" | "direct"; parts: SignedPart[] }>(
      `/api/uploads/${target.id}/sign`,
      { partNumbers: batch },
      signal,
    );
    await runPool(signed.parts, 3, async (part) => {
      if (signal?.aborted) throw stopped();
      const start = (part.partNumber - 1) * target.partSize;
      const length = partByteLength(part.partNumber, target.size, target.partSize);
      const response = await putChunk(
        part.url,
        file.slice(start, start + length),
        signed.mode === "direct" ? "include" : "omit",
        signal,
      );
      if (signed.mode === "presigned") {
        const etag = response.headers.get("etag");
        if (!etag) {
          throw new Error("Storage did not return an ETag. Expose the ETag header on the bucket CORS policy.");
        }
        await postJson(`/api/uploads/${target.id}/parts`, { partNumber: part.partNumber, etag }, signal);
      }
      sent += length;
      onProgress(target.size === 0 ? 1 : sent / target.size);
    });
  }

  if (signal?.aborted) throw stopped();
  await postJson(`/api/uploads/${target.id}/complete`, undefined, signal);
  onProgress(1);
}

export function rememberUpload(upload: OpenUpload) {
  localStorage.setItem(`${STORAGE_PREFIX}${upload.serviceHref}`, JSON.stringify(upload));
}

export function readUpload(serviceHref: string): OpenUpload | null {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${serviceHref}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as OpenUpload;
    if (!parsed || parsed.serviceHref !== serviceHref || !Array.isArray(parsed.files)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function forgetUpload(serviceHref: string) {
  localStorage.removeItem(`${STORAGE_PREFIX}${serviceHref}`);
}

export function matchUploadFiles(saved: UploadTarget[], selected: File[]) {
  if (saved.length !== selected.length) return null;
  const pool = [...selected];
  const pairs: { target: UploadTarget; file: File }[] = [];
  for (const target of saved) {
    const index = pool.findIndex((file) => file.name === target.name && file.size === target.size);
    if (index < 0) return null;
    const [file] = pool.splice(index, 1);
    if (!file) return null;
    pairs.push({ target, file });
  }
  return pairs;
}
