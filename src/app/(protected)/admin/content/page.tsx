"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { getDashboardPath } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminContentPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role !== "ADMIN") {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3">Content editor</Typography>
        <Typography color="text.secondary">
          Organize modules, lessons, and quizzes aligned with the CAPS curriculum.
        </Typography>
      </Stack>
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Content workflows are being finalized. Soon you'll be able to draft, review,
            and publish lessons from this workspace.
          </Typography>
        </CardContent>
      </Card>
      <Button component={Link} href="/admin" variant="outlined" sx={{ width: "fit-content" }}>
        Back to admin panel
      </Button>
    </Stack>
  );
}
