"use client";

import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { getParentOverview } from "@/lib/demo-data";

export default function ChildrenPage() {
  const overview = getParentOverview();

  return (
    <Stack spacing={3}>
      <Typography variant="h3">Children</Typography>
      <Typography color="text.secondary">
        Track progress and support each learner with focused feedback.
      </Typography>
      <Grid container spacing={3}>
        {overview.map((child) => (
          <Grid item xs={12} md={6} key={child.studentId}>
            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{child.studentName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lessons completed: {child.completedLessons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quiz average: {child.quizAverage}%
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
