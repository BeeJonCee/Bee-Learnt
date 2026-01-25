"use client";

import { useMemo, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventIcon from "@mui/icons-material/Event";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AssignmentList from "@/components/AssignmentList";
import StatCard from "@/components/StatCard";
import { getModuleById } from "@/lib/demo-data";
import { useAuth } from "@/providers/AuthProvider";
import { useDemoAssignments } from "@/hooks/useDemoAssignments";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
] as const;

type StatusFilter = (typeof statusOptions)[number]["value"];

type GradeFilter = "all" | "10" | "11" | "12";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { assignments, summary, toggleAssignment } = useDemoAssignments(user?.id);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [grade, setGrade] = useState<GradeFilter>("all");

  const items = useMemo(() => {
    const withModules = assignments.map((assignment) => ({
      ...assignment,
      moduleTitle: getModuleById(assignment.moduleId)?.title ?? "Module",
    }));

    return withModules
      .filter((assignment) => {
        if (status === "pending" && assignment.completed) return false;
        if (status === "completed" && !assignment.completed) return false;
        if (grade !== "all" && assignment.grade !== Number(grade)) return false;
        return true;
      })
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
  }, [assignments, grade, status]);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h3">Assignments</Typography>
        <Typography color="text.secondary">
          Track IT projects, practical tasks, and research work by due date.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Total assignments"
            value={`${summary.total}`}
            icon={AssignmentTurnedInIcon}
            accent="#f6c945"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Completed"
            value={`${summary.completed}`}
            icon={TaskAltIcon}
            accent="#5bc0eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Due soon"
            value={`${summary.dueSoon}`}
            icon={EventIcon}
            accent="#f97316"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Overdue"
            value={`${summary.overdue}`}
            icon={WarningAmberIcon}
            accent="#ef5350"
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <Tabs
          value={status}
          onChange={(_, value) => setStatus(value)}
          textColor="primary"
          indicatorColor="primary"
        >
          {statusOptions.map((option) => (
            <Tab key={option.value} value={option.value} label={option.label} />
          ))}
        </Tabs>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="grade-filter-label">Grade</InputLabel>
          <Select
            labelId="grade-filter-label"
            label="Grade"
            value={grade}
            onChange={(event) => setGrade(event.target.value as GradeFilter)}
          >
            <MenuItem value="all">All grades</MenuItem>
            <MenuItem value="10">Grade 10</MenuItem>
            <MenuItem value="11">Grade 11</MenuItem>
            <MenuItem value="12">Grade 12</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <AssignmentList items={items} onToggle={toggleAssignment} showModule />
    </Stack>
  );
}
