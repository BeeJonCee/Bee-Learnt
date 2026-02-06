"use client";

import { type ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeModeProvider } from "@/providers/ThemeModeProvider";
import AccessibilityProvider from "@/providers/AccessibilityProvider";
import OfflineSyncProvider from "@/providers/OfflineSyncProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <AuthProvider>
        <SocketProvider>
          <ThemeModeProvider>
            <AccessibilityProvider>
              <OfflineSyncProvider>{children}</OfflineSyncProvider>
            </AccessibilityProvider>
          </ThemeModeProvider>
        </SocketProvider>
      </AuthProvider>
    </AppRouterCacheProvider>
  );
}
