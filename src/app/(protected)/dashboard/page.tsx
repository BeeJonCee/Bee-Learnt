"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import { getDashboardPath } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardHubPage() {
  const { user } = useAuth();
  const router = useRouter();

  const isStudent = user?.role === "STUDENT";
  const isParent = user?.role === "PARENT";

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  if (!user || user.role === "ADMIN") {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3">Dashboard hub</Typography>
        <Typography color="text.secondary">
          Choose the view that matches your role to track progress and performance.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderColor: isStudent ? "primary.main" : "divider",
              boxShadow: isStudent ? "0 24px 60px rgba(246, 201, 69, 0.22)" : undefined,
            }}
          >
            <CardContent>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      bgcolor: "rgba(255, 214, 0, 0.18)",
                      color: "primary.main",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <SchoolIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6">Student dashboard</Typography>
                  {isStudent && <Chip label="Recommended" color="primary" size="small" />}
                </Stack>
                <Typography color="text.secondary">
                  Track module completion, progress by topic, and recent quizzes with guided next
                  steps.
                </Typography>
                <Button variant="contained" component={Link} href="/dashboard/student">
                  Open student view
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderColor: isParent ? "primary.main" : "divider",
              boxShadow: isParent ? "0 24px 60px rgba(91, 192, 235, 0.22)" : undefined,
            }}
          >
            <CardContent>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      bgcolor: "rgba(91, 192, 235, 0.18)",
                      color: "secondary.main",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <GroupIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6">Parent dashboard</Typography>
                  {isParent && <Chip label="Recommended" color="primary" size="small" />}
                </Stack>
                <Typography color="text.secondary">
                  Review linked learners, attendance, and recent performance snapshots in one
                  overview.
                </Typography>
                <Button variant="outlined" component={Link} href="/dashboard/parent">
                  Open parent view
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <Stack spacing={0.5} flex={1}>
              <Typography variant="h6">Need admin analytics?</Typography>
              <Typography color="text.secondary">
                Admin tools are available for curriculum owners and staff managers.
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              component={Link}
              href="/admin"
              startIcon={<AdminPanelSettingsIcon />}
            >
              Go to admin panel
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
