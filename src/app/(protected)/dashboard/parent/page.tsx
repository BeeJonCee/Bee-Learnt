"use client";

import {
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getParentOverview } from "@/lib/demo-data";

export default function ParentDashboardPage() {
  const overview = getParentOverview();

  return (
    <Stack spacing={3}>
      <Typography variant="h3">Parent overview</Typography>
      <Grid container spacing={3}>
        {overview.map((child) => (
          <Grid item xs={12} md={6} key={child.studentId}>
            <Card>
              <CardContent>
                <Stack spacing={2.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="h6">{child.studentName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Student ID: {child.studentId}
                      </Typography>
                    </Stack>
                    <Chip label="Active" color="primary" size="small" />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <SchoolIcon color="primary" />
                      <Stack>
                        <Typography variant="subtitle2">Lessons completed</Typography>
                        <Typography variant="h6">{child.completedLessons}</Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <TrendingUpIcon sx={{ color: "secondary.main" }} />
                      <Stack>
                        <Typography variant="subtitle2">Quiz average</Typography>
                        <Typography variant="h6">{child.quizAverage}%</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
