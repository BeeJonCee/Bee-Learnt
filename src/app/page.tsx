"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { apiFetch } from "@/lib/utils/api";
import { getDashboardPath } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "STUDENT") {
      router.replace(getDashboardPath(user.role));
      return;
    }

    setChecking(true);
    apiFetch<{ moduleId: number }[]>("/api/user-modules")
      .then((modules) => {
        if (!modules || modules.length === 0) {
          router.replace("/onboarding");
        } else {
          router.replace(getDashboardPath(user.role));
        }
      })
      .catch(() => {
        router.replace(getDashboardPath(user.role));
      })
      .finally(() => setChecking(false));
  }, [loading, user, router]);

  if (loading || checking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return null;
}
