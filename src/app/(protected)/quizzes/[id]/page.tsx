"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  getModuleById,
  getQuestionsByQuizId,
  getQuizById,
} from "@/lib/demo-data";
import { useAuth } from "@/providers/AuthProvider";
import { useDemoQuizResults } from "@/hooks/useDemoQuizResults";
import type { QuizResult } from "@/lib/demo-storage";

export default function QuizPage() {
  const params = useParams();
  const idParam = params?.id;
  const id = Number(Array.isArray(idParam) ? idParam[0] : idParam);
  const quiz = getQuizById(id);
  const questions = getQuestionsByQuizId(id);
  const moduleData = quiz ? getModuleById(quiz.moduleId) : undefined;
  const moduleHref = moduleData ? `/modules/${moduleData.id}` : "/subjects";
  const { user } = useAuth();
  const { results, recordResult } = useDemoQuizResults(user?.id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    setResult(results[id] ?? null);
  }, [id, results]);

  const progress = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round(((currentQuestion + 1) / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  if (!quiz) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Quiz not found</Typography>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">No questions available</Typography>
          <Typography color="text.secondary">
            This quiz does not have any questions yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((question) => {
      const answer = (answers[question.id] ?? "").trim();
      if (!answer) return;
      if (question.type === "short_answer") {
        if (answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
          correct += 1;
        }
      } else if (answer === question.correctAnswer) {
        correct += 1;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const feedback =
      score >= 80
        ? "Excellent work. You are ready for the next lesson."
        : score >= 50
        ? "Good effort. Review a few questions and try again."
        : "Keep practicing. A quick recap will help a lot.";

    const nextResult: QuizResult = {
      quizId: quiz.id,
      score,
      totalQuestions: questions.length,
      feedback,
      completedAt: new Date().toISOString(),
    };

    recordResult(nextResult);
    setResult(nextResult);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
  };

  if (result) {
    return (
      <Card sx={{ maxWidth: 520, mx: "auto" }}>
        <CardContent>
          <Stack spacing={3} textAlign="center">
            <CheckCircleIcon sx={{ fontSize: 64, color: "primary.main", mx: "auto" }} />
            <Typography variant="h4">Quiz completed</Typography>
            <Typography variant="h2" sx={{ color: "primary.main" }}>
              {result.score}%
            </Typography>
            <Typography color="text.secondary">{result.feedback}</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button component={Link} href={moduleHref} variant="contained" fullWidth>
                Back to module
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                fullWidth
              >
                Retake
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Stack spacing={3} sx={{ maxWidth: 820, mx: "auto" }}>
      <Box>
        <Typography variant="h4">{quiz.title}</Typography>
        <Typography color="text.secondary">{quiz.description}</Typography>
      </Box>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 8 }} />

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
            <Typography variant="h5">{question.questionText}</Typography>

            <Stack spacing={1.5}>
              {question.type === "multiple_choice" &&
                question.options?.map((option) => (
                  <Button
                    key={option}
                    variant={answers[question.id] === option ? "contained" : "outlined"}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: option,
                      }))
                    }
                  >
                    {option}
                  </Button>
                ))}

              {question.type === "short_answer" && (
                <TextField
                  placeholder="Type your answer"
                  multiline
                  minRows={3}
                  value={answers[question.id] ?? ""}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: event.target.value,
                    }))
                  }
                />
              )}
            </Stack>

            <Box textAlign="right">
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                disabled={!answers[question.id]}
              >
                {currentQuestion === questions.length - 1
                  ? "Submit quiz"
                  : "Next question"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
