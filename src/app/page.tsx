"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/providers/AuthProvider";
import { getDashboardPath } from "@/lib/navigation";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(getDashboardPath(user.role));
    } else {
      router.replace("/auth");
    }
  }, [loading, user, router]);

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
