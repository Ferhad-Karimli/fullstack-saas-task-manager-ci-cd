const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API}${path}`, { ...options, headers });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || text || `HTTP ${res.status}`);
  }

  return data;
}
