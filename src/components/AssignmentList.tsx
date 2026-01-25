import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { Assignment } from "@/lib/demo-data";

export type AssignmentItem = Assignment & {
  completed: boolean;
  completedAt?: string | null;
  moduleTitle?: string;
};

type AssignmentListProps = {
  items: AssignmentItem[];
  onToggle: (assignmentId: number) => void;
  showModule?: boolean;
};

function getDueLabel(dueDate: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} days`;
  }
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays} days`;
}

function formatTypeLabel(type: Assignment["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function AssignmentList({ items, onToggle, showModule }: AssignmentListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">No assignments yet.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {items.map((assignment) => (
        <Card key={assignment.id}>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Checkbox
                    checked={assignment.completed}
                    onChange={() => onToggle(assignment.id)}
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ textDecoration: assignment.completed ? "line-through" : "none" }}
                  >
                    {assignment.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {assignment.description}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={formatTypeLabel(assignment.type)} size="small" />
                  <Chip label={`Grade ${assignment.grade}`} size="small" />
                  {showModule && assignment.moduleTitle && (
                    <Chip label={assignment.moduleTitle} size="small" color="secondary" />
                  )}
                </Stack>
              </Stack>
              <Box textAlign={{ xs: "left", md: "right" }}>
                <Typography variant="body2" color="text.secondary">
                  {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
                <Typography
                  variant="caption"
                  color={assignment.completed ? "text.secondary" : "primary.main"}
                >
                  {assignment.completed ? "Completed" : getDueLabel(assignment.dueDate)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
