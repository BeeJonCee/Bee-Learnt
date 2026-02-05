import { authClient } from "@/lib/neon-auth/client";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

const tokenCache = {
  value: null as string | null,
  expiresAt: 0,
  pending: null as Promise<string | null> | null,
};

const tokenTtlMs = 60_000;

async function getAuthToken() {
  // This helper is only used from client components/hooks.
  if (typeof window === "undefined") return null;

  const now = Date.now();
  if (tokenCache.value && tokenCache.expiresAt > now) {
    return tokenCache.value;
  }
  if (tokenCache.pending) {
    return tokenCache.pending;
  }

  tokenCache.pending = (async () => {
    try {
      // Prefer the session token (set-auth-jwt injected into session.token).
      if (typeof authClient.getSession === "function") {
        try {
          const sessionResponse = await authClient.getSession();
          const sessionToken = sessionResponse?.data?.session?.token ?? null;
          if (sessionToken) {
            tokenCache.value = sessionToken;
            tokenCache.expiresAt = Date.now() + tokenTtlMs;
            return sessionToken;
          }
        } catch {
          // Ignore and fall back.
        }
      }

      // Fallback to token() if available.
      const tokenFetcher = authClient as typeof authClient & {
        token?: () => Promise<{ data?: { token?: string | null } | null }>;
      };

      if (typeof tokenFetcher.token === "function") {
        try {
          const response = await tokenFetcher.token();
          const token = response?.data?.token ?? null;
          if (token) {
            tokenCache.value = token;
            tokenCache.expiresAt = Date.now() + tokenTtlMs;
            return token;
          }
        } catch {
          // Ignore.
        }
      }

      return null;
    } finally {
      tokenCache.pending = null;
    }
  })();

  return tokenCache.pending;
}

export async function apiFetch<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Authorization")) {
    const token = await getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url =
    typeof input === "string" && input.startsWith("/") ? `${backendUrl}${input}` : input;

  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json();
}
