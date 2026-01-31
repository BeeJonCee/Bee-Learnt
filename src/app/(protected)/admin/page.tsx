"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShieldIcon from "@mui/icons-material/Shield";
import CampaignIcon from "@mui/icons-material/Campaign";
import SchoolIcon from "@mui/icons-material/School";
import { getDashboardPath } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";
import AdminInsightsPanel from "@/components/AdminInsightsPanel";
import SystemHealthPanel from "@/components/SystemHealthPanel";
import AdminReportsPanel from "@/components/AdminReportsPanel";
import { StudentCountChart, EngagementChart, PerformanceMeter } from "@/components/charts";
import AnnouncementsPanel from "@/components/AnnouncementsPanel";
import EventsCalendarPanel from "@/components/EventsCalendarPanel";

const quickStats = [
  { label: "Active learners", value: "1,248", helper: "Last 7 days" },
  { label: "Modules live", value: "18", helper: "CAPS aligned" },
  { label: "Avg. quiz score", value: "78%", helper: "All grades" },
];

export default function AdminPage() {
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
    <Stack spacing={4}>
      <Stack spacing={1}>
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
            <AdminPanelSettingsIcon fontSize="small" />
          </Box>
          <Typography variant="h3">Admin panel</Typography>
          <Chip label="Secure workspace" size="small" icon={<ShieldIcon fontSize="small" />} />
        </Stack>
        <Typography color="text.secondary">
          Manage users, review platform health, and jump into content administration.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {quickStats.map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="overline" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h4">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.helper}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Visual Analytics Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StudentCountChart
            data={{
              total: 1248,
              grades: [
                { grade: 9, count: 312 },
                { grade: 10, count: 345 },
                { grade: 11, count: 298 },
                { grade: 12, count: 293 },
              ],
            }}
            title="Students by Grade"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <EngagementChart
            title="Weekly Platform Engagement"
            showMinutes
          />
        </Grid>
      </Grid>

      {/* Platform Analytics */}
      <Stack spacing={3}>
        <Typography variant="h5">Platform Analytics</Typography>
        <AdminInsightsPanel />
      </Stack>

      {/* System Health */}
      <Stack spacing={3}>
        <Typography variant="h5">System Health</Typography>
        <SystemHealthPanel />
      </Stack>

      {/* Reports */}
      <Stack spacing={3}>
        <Typography variant="h5">Reports & Analytics</Typography>
        <AdminReportsPanel />
      </Stack>

      {/* Management Tools */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PeopleAltIcon color="primary" />
                  <Typography variant="h6">User management</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Review learner accounts, invite staff, and adjust role assignments.
                </Typography>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Coming soon: bulk role updates, guardian linking, and audit logs.
                </Typography>
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button component={Link} href="/admin/users" variant="contained">
                Go to users
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EditNoteIcon color="primary" />
                  <Typography variant="h6">Content editor</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Curate modules, lessons, and quizzes aligned to the CAPS curriculum.
                </Typography>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Coming soon: module templates, quiz workflows, and approvals.
                </Typography>
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button component={Link} href="/admin/content" variant="outlined">
                Open content tools
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CampaignIcon color="primary" />
                  <Typography variant="h6">Announcements & events</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Publish campus updates, deadlines, and upcoming sessions.
                </Typography>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Share updates with students, parents, tutors, or admins only.
                </Typography>
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button component={Link} href="/admin/announcements-events" variant="contained">
                Manage announcements
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <SchoolIcon color="primary" />
                  <Typography variant="h6">Tutor management</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Manage tutor profiles, assignments, and monitor tutoring sessions.
                </Typography>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Review tutor performance, expertise, and student feedback.
                </Typography>
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button component={Link} href="/admin/tutors" variant="outlined">
                Manage tutors
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Announcements & Events */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <AnnouncementsPanel />
        </Grid>
        <Grid item xs={12} lg={6}>
          <EventsCalendarPanel />
        </Grid>
      </Grid>
    </Stack>
  );
}
