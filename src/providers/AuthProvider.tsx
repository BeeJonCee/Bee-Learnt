"use client";

import { type ReactNode, createContext, useCallback, useContext, useMemo } from "react";
import type { AuthUser } from "@/lib/auth/storage";
import { authClient } from "@/lib/neon-auth/client";

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
      sendVerificationOtp: (payload: { email: string; type: "sign-in" }) => Promise<unknown>;
    };
  };

  const user: AuthUser | null = session.data?.user
    ? {
        id: session.data.user.id,
        name: session.data.user.name ?? null,
        email: session.data.user.email ?? null,
        role: (session.data.user as { role?: AuthUser["role"] }).role ?? "STUDENT",
      }
    : null;

  const loading = session.isPending;

  const login = useCallback(async (email: string, password: string) => {
    await authClient.signIn.email({ email, password });
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; role: "STUDENT" | "PARENT" }) => {
      await authClient.signUp.email({
        email: payload.email,
        password: payload.password,
        name: payload.name,
      });
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
    await neonAuthClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
  }, [neonAuthClient]);

  const verifyEmailOtp = useCallback(async (email: string, code: string) => {
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
