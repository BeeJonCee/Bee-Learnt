"use client";

import type { ReactNode } from "react";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/neon-auth/client";

export function NeonAuthProvider({ children }: { children: ReactNode }) {
  return (
    // @ts-ignore - Type mismatch due to better-auth version conflict
    <NeonAuthUIProvider authClient={authClient} redirectTo="/account/settings" emailOTP>
      {children}
    </NeonAuthUIProvider>
  );
}
