const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

import { getToken } from "../auth/tokenStorage";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  // Добавляем Bearer токен на все запросы, кроме login/confirm
  const isPublic =
    path.startsWith("/api/v1/auth/login/") ||
    path.startsWith("/api/v1/auth/confirm/") ||
    path.startsWith("/api/v1/auth/refresh/");

  if (!isPublic && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // refresh_token cookie
    headers,
    ...options,
  });

  return res;
}
