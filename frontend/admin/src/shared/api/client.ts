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

  // Проверка base API URL для auth и catalog
  const isPublic =
    path.startsWith("/api/v1/auth/login/") ||
    path.startsWith("/api/v1/auth/confirm/") ||
    path.startsWith("/api/v1/auth/refresh/");

  if (!isPublic && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Пример для auth и catalog
  const baseUrl = path.startsWith("/api/v1/auth/") 
                  ? import.meta.env.VITE_AUTH_API_URL 
                  : import.meta.env.VITE_CATALOG_API_URL;

  const res = await fetch(`${baseUrl}${path}`, {
    credentials: "include", // for refresh_token cookie
    headers,
    ...options,
  });

  return res;
}
