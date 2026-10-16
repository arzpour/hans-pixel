export function apiUrl(path: string) {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const base = (configured || "http://localhost:4000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), { ...init, credentials: "include" });
}

export async function readError(response: Response, fallback = "The request failed.") {
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  if (data && typeof data.error === "string" && data.error) return data.error;
  return fallback;
}

export async function readJson<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

type SubmitResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string };

export async function submitJson<T>(url: string, body?: unknown, signal?: AbortSignal): Promise<SubmitResult<T>> {
  const response = await apiFetch(url, {
    method: "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  const data = (await response.json().catch(() => null)) as ({ error?: string } & T) | null;
  if (!response.ok) {
    return { ok: false, status: response.status, error: data?.error || "The request failed." };
  }
  return { ok: true, status: response.status, data: (data ?? {}) as T };
}

export async function postJson<T>(url: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await apiFetch(url, {
    method: "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as T;
}
