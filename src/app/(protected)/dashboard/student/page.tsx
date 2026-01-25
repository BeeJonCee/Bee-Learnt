"use client";

import Link from "next/link";
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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventIcon from "@mui/icons-material/Event";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SchoolIcon from "@mui/icons-material/School";
import TimerIcon from "@mui/icons-material/Timer";
import StatCard from "@/components/StatCard";
import AiTutorWidget from "@/components/AiTutorWidget";
import { useAuth } from "@/providers/AuthProvider";
import { useDemoProgress } from "@/hooks/useDemoProgress";
import { useDemoQuizResults } from "@/hooks/useDemoQuizResults";
import { useDemoAssignments } from "@/hooks/useDemoAssignments";

const chartData = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 78 },
  { day: "Thu", score: 84 },
  { day: "Fri", score: 92 },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { completedCount, recentProgress } = useDemoProgress(user?.id);
  const { stats } = useDemoQuizResults(user?.id);
  const { summary } = useDemoAssignments(user?.id);

  return (
    <Stack spacing={4}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h3">
            Hello, <Box component="span" sx={{ color: "primary.main" }}>
              {user?.name}
            </Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Ready to continue learning?
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            component={Link}
            href="/subjects"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
          >
            Explore subjects
          </Button>
          <Button component={Link} href="/assignments" variant="outlined" size="large">
            View assignments
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Lessons completed"
            value={`${completedCount}`}
            icon={SchoolIcon}
            accent="#f6c945"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Quiz average"
            value={`${stats.averageScore}%`}
            icon={QueryStatsIcon}
            accent="#5bc0eb"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Hours learned"
            value="12.5"
            icon={TimerIcon}
            accent="#f97316"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Assignments due soon"
            value={`${summary.dueSoon}`}
            icon={EventIcon}
            accent="#ef5350"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Stack spacing={2.5}>
            <Typography variant="h5">Continue learning</Typography>
            {recentProgress.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography color="text.secondary">
                    No progress yet. Start a lesson to see it here.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={2}>
                {recentProgress.map((entry) => (
                  <Card key={entry.lessonId}>
                    <CardContent>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PlayCircleOutlineIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>
                              {entry.lesson.title}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Last accessed: {new Date(entry.lastAccessed).toLocaleDateString()}
                          </Typography>
                        </Stack>
                        <Button
                          component={Link}
                          href={`/lessons/${entry.lessonId}`}
                          variant="outlined"
                        >
                          Resume
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2.5}>
            <Typography variant="h5">Performance</Typography>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="This week" color="primary" size="small" />
                    <Typography variant="body2" color="text.secondary">
                      Average score trend
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1.5,
                      height: 220,
                    }}
                  >
                    {chartData.map((item) => (
                      <Stack key={item.day} alignItems="center" spacing={1} flex={1}>
                        <Box
                          sx={{
                            width: "100%",
                            borderRadius: 2,
                            backgroundColor:
                              item.score > 85
                                ? "primary.main"
                                : "rgba(255,255,255,0.12)",
                            height: `${item.score * 2}px`,
                            transition: "height 0.4s ease",
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {item.day}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <AiTutorWidget />
    </Stack>
  );
}
