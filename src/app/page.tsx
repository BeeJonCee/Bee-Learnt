"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import InsightsIcon from "@mui/icons-material/Insights";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import { apiFetch } from "@/lib/utils/api";
import { getDashboardPath } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useColorMode } from "@/providers/ThemeModeProvider";

type Highlight = {
  title: string;
  description: string;
  icon: typeof AutoAwesomeIcon;
};

const highlights: Highlight[] = [
  {
    title: "CAPS-aligned modules",
    description: "Grade-specific IT lessons, quizzes, and resources in one path.",
    icon: MenuBookIcon,
  },
  {
    title: "Progress intelligence",
    description: "Track learner momentum, quiz mastery, and focus areas.",
    icon: InsightsIcon,
  },
  {
    title: "Mentored learning flow",
    description: "Guided practice with AI hints and parent-ready snapshots.",
    icon: SchoolIcon,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const lastUserId = useRef<string | number | null>(null);

  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    if (loading || !user) return;
    if (lastUserId.current === user.id) return;
    lastUserId.current = user.id;
    if (!isStudent) {
      router.replace(getDashboardPath(user.role));
      return;
    }

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
      });
  }, [loading, user, isStudent, router]);

  const highlightsWithIcons = useMemo(
    () =>
      highlights.map((item) => ({
        ...item,
        Icon: item.icon,
      })),
    []
  );

  if (loading || user) {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 6, md: 10 },
        background:
          "radial-gradient(800px circle at 15% 20%, rgba(255, 214, 0, 0.18), transparent 55%), radial-gradient(700px circle at 80% 10%, rgba(91, 192, 235, 0.18), transparent 60%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={8}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "primary.main",
                  color: "#121212",
                  fontWeight: 700,
                }}
              >
                B
              </Box>
              <Box>
                <Typography variant="h6">BeeLearnt</Typography>
                <Typography variant="caption" color="text.secondary">
                  Information Technology track
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button component={Link} href="/login" variant="text" color="inherit">
                Sign in
              </Button>
              <Button component={Link} href="/register" variant="outlined">
                Create account
              </Button>
              <IconButton onClick={toggleMode} aria-label="Toggle theme" color="inherit">
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Stack>
          </Stack>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip label="Information Technology" color="primary" sx={{ width: "fit-content" }} />
                <Typography variant="h2">Information Technology</Typography>
                <Typography color="text.secondary" variant="h6">
                  Grade-specific modules and lessons for IT. Track progress, unlock modules,
                  and review analytics with a learner-first flow.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button component={Link} href="/dashboard" variant="contained" size="large">
                    Learner Dashboard
                  </Button>
                  <Button component={Link} href="/admin" variant="outlined" size="large">
                    Admin Analytics
                  </Button>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="overline" color="text.secondary">
                          Live momentum
                        </Typography>
                        <Typography variant="h4">72%</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Learners meeting weekly study goals.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="overline" color="text.secondary">
                          Active modules
                        </Typography>
                        <Typography variant="h4">18</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Curated IT modules ready for rollout.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Typography variant="h5">This week's focus</Typography>
                      <Typography color="text.secondary">
                        Prioritize networking fundamentals and security basics across Grade 10-12.
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {highlightsWithIcons.map(({ title, description, Icon }) => (
                        <Stack key={title} direction="row" spacing={2}>
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 3,
                              bgcolor: "rgba(255, 214, 0, 0.18)",
                              display: "grid",
                              placeItems: "center",
                              color: "primary.main",
                              flexShrink: 0,
                            }}
                          >
                            <Icon fontSize="small" />
                          </Box>
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle1">{title}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              {description}
                            </Typography>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Stack spacing={2} alignItems="center" textAlign="center">
            <AutoAwesomeIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography variant="h4">Keep every learner on pace</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              BeeLearnt blends IT curriculum structure with adaptive support, so educators and
              families can see what matters most each week.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
