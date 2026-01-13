const TOKEN_KEY = "access_token";
const EXPIRES_KEY = "access_token_expires_at";
const TTL_MINUTES = 30;

export function saveToken(token: string) {
  const expiresAt = Date.now() + TTL_MINUTES * 60 * 1000;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
}

export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(EXPIRES_KEY);

  if (!token || !expiresAtStr) return null;

  const expiresAt = Number(expiresAtStr);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    clearToken();
    return null;
  }

  return token;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}
