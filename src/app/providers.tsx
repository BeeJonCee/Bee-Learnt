"use client";

import { type ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { SessionProvider } from "next-auth/react";
import { ThemeModeProvider } from "@/providers/ThemeModeProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <SessionProvider>
        <ThemeModeProvider>{children}</ThemeModeProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  );
}
