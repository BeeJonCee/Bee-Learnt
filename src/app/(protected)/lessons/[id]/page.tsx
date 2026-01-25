"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getLessonById, getModuleById } from "@/lib/demo-data";
import { useAuth } from "@/providers/AuthProvider";
import { useDemoProgress } from "@/hooks/useDemoProgress";

export default function LessonPage() {
  const params = useParams();
  const id = Number(params?.id);
  const lesson = getLessonById(id);
  const moduleData = lesson ? getModuleById(lesson.moduleId) : undefined;
  const { user } = useAuth();
  const { progress, markLessonComplete, touchLesson } = useDemoProgress(user?.id);

  useEffect(() => {
    if (lesson) {
      touchLesson(lesson.id);
    }
  }, [lesson, touchLesson]);

  if (!lesson) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Lesson not found</Typography>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = Boolean(progress[lesson.id]?.completed);

  return (
    <Stack spacing={4} sx={{ maxWidth: 960 }}>
      <Button
        component={Link}
        href={`/modules/${moduleData?.id ?? ""}`}
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: "flex-start" }}
      >
        Back to module
      </Button>

      <Stack spacing={2}>
        <Typography variant="h3">{lesson.title}</Typography>
        {lesson.videoUrl && (
          <Box
            component="iframe"
            src={lesson.videoUrl}
            title={lesson.title}
            sx={{
              width: "100%",
              minHeight: { xs: 220, md: 420 },
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        )}
        <Card>
          <CardContent>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <Typography variant="h4" gutterBottom>
                    {children}
                  </Typography>
                ),
                h2: ({ children }) => (
                  <Typography variant="h5" gutterBottom>
                    {children}
                  </Typography>
                ),
                p: ({ children }) => (
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {children}
                  </Typography>
                ),
                ul: ({ children }) => (
                  <Box component="ul" sx={{ pl: 3, mb: 2, color: "text.secondary" }}>
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Typography component="li" variant="body1" color="text.secondary">
                    {children}
                  </Typography>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<CheckCircleIcon />}
          onClick={() => markLessonComplete(lesson.id)}
          disabled={isCompleted}
        >
          {isCompleted ? "Completed" : "Mark as complete"}
        </Button>
      </Box>
    </Stack>
  );
}
