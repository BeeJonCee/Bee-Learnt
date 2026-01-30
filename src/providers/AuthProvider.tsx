"use client";

import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/lib/auth/storage";
import { authClient } from "@/lib/neon-auth/client";
import { apiFetch } from "@/lib/utils/api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: "STUDENT" | "PARENT" }) => Promise<void>;
  magicLinkLogin: (email: string, callbackURL?: string) => Promise<void>;
  socialLogin: (provider: "google" | "facebook" | "apple", callbackURL?: string) => Promise<void>;
  sendEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  const neonAuthClient = authClient as typeof authClient & {
    signIn: typeof authClient.signIn & {
      magicLink: (payload: { email: string; callbackURL?: string }) => Promise<unknown>;
      emailOtp: (payload: { email: string; otp: string }) => Promise<unknown>;
    };
    emailOtp: {
      sendVerificationOtp: (payload: {
        email: string;
        type: "sign-in" | "email-verification";
      }) => Promise<unknown>;
      verifyEmail?: (payload: { email: string; otp: string }) => Promise<unknown>;
    };
  };

  const normalizeRole = (role?: string | string[] | null): AuthUser["role"] | null => {
    if (!role) return null;
    const candidates = Array.isArray(role) ? role : [role];
    for (const candidate of candidates) {
      const upper = candidate?.toUpperCase?.() ?? "";
      if (upper === "ADMIN" || upper === "PARENT" || upper === "STUDENT") {
        return upper as AuthUser["role"];
      }
    }
    return null;
  };

  const [roleFromToken, setRoleFromToken] = useState<AuthUser["role"] | null>(null);
  const [roleFromApi, setRoleFromApi] = useState<AuthUser["role"] | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);

  const parseJwt = (token: string): Record<string, unknown> | null => {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    try {
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(
        normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, "=")
      );
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      return null;
    }
  };

  const extractRoleFromClaims = (claims: Record<string, unknown>): AuthUser["role"] | null => {
    const candidates = [
      claims.role,
      claims.roles,
      (claims.user_metadata as Record<string, unknown> | undefined)?.role,
      (claims.user_metadata as Record<string, unknown> | undefined)?.roles,
      (claims.app_metadata as Record<string, unknown> | undefined)?.role,
      (claims.app_metadata as Record<string, unknown> | undefined)?.roles,
    ];
    for (const candidate of candidates) {
      const parsed = normalizeRole(candidate as string | string[] | null);
      if (parsed) return parsed;
    }
    return null;
  };

  useEffect(() => {
    const sessionUser = session.data?.user as
      | { id?: string; role?: string | null; roles?: string[] | null }
      | undefined;
    const sessionRole =
      normalizeRole(sessionUser?.role ?? null) ?? normalizeRole(sessionUser?.roles ?? null);
    const sessionToken = session.data?.session?.token ?? null;

    if (!sessionUser) {
      setRoleFromToken(null);
      setRoleFromApi(null);
      setRoleLoading(false);
      return;
    }

    let active = true;
    setRoleLoading(true);

    const resolveRoles = async () => {
      let resolvedRole = sessionRole ?? null;
      let token = sessionToken;

      if (!resolvedRole && token) {
        const claims = parseJwt(token);
        resolvedRole = claims ? extractRoleFromClaims(claims) : null;
      }

      if (!resolvedRole && !token && typeof authClient.getSession === "function") {
        const sessionResponse = await authClient.getSession();
        token = sessionResponse?.data?.session?.token ?? null;
        if (token) {
          const claims = parseJwt(token);
          resolvedRole = claims ? extractRoleFromClaims(claims) : null;
        }
      }

      if (active) {
        setRoleFromToken(resolvedRole);
      }

      try {
        const me = await apiFetch<{ user?: { role?: string | null } }>("/api/auth/me");
        const apiRole = normalizeRole(me?.user?.role ?? null);
        if (active) {
          setRoleFromApi(apiRole);
        }
      } catch {
        if (active) {
          setRoleFromApi(null);
        }
      } finally {
        if (active) {
          setRoleLoading(false);
        }
      }
    };

    resolveRoles();

    return () => {
      active = false;
    };
  }, [session.data?.user?.id, session.data?.session?.token]);

  const user: AuthUser | null = session.data?.user
    ? {
        id: session.data.user.id,
        name: session.data.user.name ?? null,
        email: session.data.user.email ?? null,
        role:
          roleFromApi ??
          normalizeRole(
            (session.data.user as { role?: string | null; roles?: string[] | null })
              .role ??
              (session.data.user as { roles?: string[] | null }).roles ??
              null
          ) ??
          roleFromToken ??
          "STUDENT",
      }
    : null;

  const loading = session.isPending || roleLoading;

  const login = useCallback(async (email: string, password: string) => {
    await authClient.signIn.email({ email, password });
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; role: "STUDENT" | "PARENT" }) => {
      await authClient.signUp.email({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        // Pass role in callbackURL or additional data
        callbackURL: `${window.location.origin}/auth/callback?role=${payload.role}`,
      });
      
      // Alternatively, we could call the backend to sync the role immediately after signup
      // But Neon Auth will handle the user creation and our middleware will sync on first login
    },
    []
  );

  const magicLinkLogin = useCallback(async (email: string, callbackURL?: string) => {
    await neonAuthClient.signIn.magicLink({ email, callbackURL });
  }, [neonAuthClient]);

  const socialLogin = useCallback(
    async (provider: "google" | "facebook" | "apple", callbackURL?: string) => {
      await authClient.signIn.social({ provider, callbackURL });
    },
    []
  );

  const sendEmailOtp = useCallback(async (email: string) => {
    await neonAuthClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
  }, [neonAuthClient]);

  const verifyEmailOtp = useCallback(async (email: string, code: string) => {
    if (typeof neonAuthClient.emailOtp.verifyEmail === "function") {
      await neonAuthClient.emailOtp.verifyEmail({ email, otp: code });
      return;
    }
    await neonAuthClient.signIn.emailOtp({ email, otp: code });
  }, [neonAuthClient]);

  const logout = useCallback(() => {
    authClient.signOut();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      magicLinkLogin,
      socialLogin,
      sendEmailOtp,
      verifyEmailOtp,
      logout,
    }),
    [user, loading, login, register, magicLinkLogin, socialLogin, sendEmailOtp, verifyEmailOtp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
