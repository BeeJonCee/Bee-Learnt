import { authClient } from "@/lib/neon-auth/client";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export async function apiFetch<T>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Authorization") && typeof window !== "undefined") {
    const token = await authClient.getJWTToken?.();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url =
    typeof input === "string" && input.startsWith("/")
      ? `${backendUrl}${input}`
      : input;

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
