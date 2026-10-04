export function apiUrl(path: string) {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const base = (configured || "http://localhost:4000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), { ...init, credentials: "include" });
}
