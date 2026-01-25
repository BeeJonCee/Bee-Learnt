"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Link as MuiLink,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import {
  getLessonsByModuleId,
  getModuleById,
  getQuizzesByModuleId,
  getSubjectById,
} from "@/lib/demo-data";
import AssignmentList from "@/components/AssignmentList";
import { useAuth } from "@/providers/AuthProvider";
import { useDemoAssignments } from "@/hooks/useDemoAssignments";

export default function ModulePage() {
  const params = useParams();
  const idParam = params?.id;
  const id = Number(Array.isArray(idParam) ? idParam[0] : idParam);
  const moduleData = getModuleById(id);
  const lessons = getLessonsByModuleId(id);
  const quizzes = getQuizzesByModuleId(id);
  const subject = moduleData ? getSubjectById(moduleData.subjectId) : undefined;
  const subjectHref = subject ? `/subjects/${subject.id}` : "/subjects";
  const [toastOpen, setToastOpen] = useState(false);
  const { user } = useAuth();
  const { getAssignmentsForModule, toggleAssignment } = useDemoAssignments(user?.id);
  const assignments = getAssignmentsForModule(id);

  if (!moduleData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Module not found</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={4}>
      <Breadcrumbs sx={{ color: "text.secondary" }}>
        <MuiLink component={NextLink} href={subjectHref} color="inherit" underline="hover">
          {subject?.name ?? "Subject"}
        </MuiLink>
        <Typography color="text.primary">{moduleData.title}</Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h3">{moduleData.title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {moduleData.description}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          onClick={() => setToastOpen(true)}
        >
          Generate AI quiz
        </Button>
      </Stack>

      <Stack spacing={3}>
        <Typography variant="h5">Lessons</Typography>
        <Stack spacing={2}>
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PlayCircleOutlineIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {lesson.title}
                      </Typography>
                    </Stack>
                    <Chip
                      label={lesson.type === "video" ? "Video lesson" : "Text lesson"}
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    />
                  </Stack>
                  <Button
                    component={NextLink}
                    href={`/lessons/${lesson.id}`}
                    variant="outlined"
                    endIcon={<ChevronRightIcon />}
                  >
                    Start lesson
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>

      <Stack spacing={3}>
        <Typography variant="h5">Quizzes</Typography>
        <Stack spacing={2}>
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <QuizIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {quiz.title}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip label={quiz.difficulty} size="small" />
                      {quiz.aiGenerated && (
                        <Chip label="AI" size="small" color="secondary" />
                      )}
                    </Stack>
                  </Stack>
                  <Button
                    component={NextLink}
                    href={`/quizzes/${quiz.id}`}
                    variant="outlined"
                  >
                    Start quiz
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>

      <Stack spacing={3}>
        <Typography variant="h5">Assignments</Typography>
        <AssignmentList items={assignments} onToggle={toggleAssignment} />
      </Stack>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setToastOpen(false)}
        >
          AI quiz generated. Check the quizzes list.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
