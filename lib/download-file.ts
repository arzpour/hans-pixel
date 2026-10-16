import { apiFetch, apiUrl, readError } from "@/lib/api";

export function uploadDownloadPath(fileId: string) {
  return `/api/uploads/${fileId}/download`;
}

export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function openDownload(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function downloadUpload(fileId: string, name: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const path = uploadDownloadPath(fileId);
  const href = apiUrl(path);
  try {
    const response = await apiFetch(path, { redirect: "manual" });
    if (response.type === "opaqueredirect" || response.status === 0) {
      openDownload(href);
      return { ok: true };
    }
    if (!response.ok) return { ok: false, error: await readError(response, "Download failed.") };
    saveBlob(await response.blob(), name);
    return { ok: true };
  } catch {
    openDownload(href);
    return { ok: true };
  }
}
