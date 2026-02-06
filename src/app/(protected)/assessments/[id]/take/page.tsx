"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { apiFetch } from "@/lib/utils/api";

type StartAttemptPayload = {
  attemptId: string;
  assessment: {
    id: number;
    title: string;
    type: string;
    timeLimitMinutes?: number | null;
    instructions?: string | null;
  };
  sections: Array<{
    id: number;
    title?: string | null;
    order: number;
    instructions?: string | null;
    questions: Array<{
      assessmentQuestionId: number;
      questionBankItemId: number;
      order: number;
      type: string;
      difficulty: string;
      questionText: string;
      questionHtml?: string | null;
      imageUrl?: string | null;
      options?: unknown;
      points: number;
    }>;
  }>;
};

function extractOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((value): value is string => typeof value === "string");
  }
  if (raw && typeof raw === "object") {
    const options = (raw as any).options;
    if (Array.isArray(options)) {
      return options.filter((value: unknown): value is string => typeof value === "string");
    }
  }
  return [];
}

export default function TakeAssessmentPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const assessmentId = Number(params?.id);
  const attemptIdFromQuery = searchParams.get("attemptId") ?? "";

  const [payload, setPayload] = useState<StartAttemptPayload | null>(null);
  const [hydrating, setHydrating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingQuestionId, setSavingQuestionId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});

  const attemptId = payload?.attemptId ?? attemptIdFromQuery;

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setError(null);
      setHydrating(true);

      try {
        if (!Number.isFinite(assessmentId)) {
          throw new Error("Invalid assessment id.");
        }

        // Try sessionStorage first (fast path).
        if (attemptIdFromQuery) {
          const cached = window.sessionStorage.getItem(`beelearn-attempt:${attemptIdFromQuery}`);
          if (cached) {
            const parsed = JSON.parse(cached) as StartAttemptPayload;
            if (active) setPayload(parsed);
            return;
          }
        }

        // Fallback: (re)start an attempt (e.g. after a refresh).
        const started = await apiFetch<StartAttemptPayload>(`/api/assessments/${assessmentId}/start`, {
          method: "POST",
        });
        window.sessionStorage.setItem(`beelearn-attempt:${started.attemptId}`, JSON.stringify(started));

        if (!active) return;
        setPayload(started);

        // Keep URL in sync for reloadability.
        router.replace(
          `/assessments/${assessmentId}/take?attemptId=${encodeURIComponent(started.attemptId)}`
        );
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load assessment attempt.");
      } finally {
        if (active) setHydrating(false);
      }
    };

    void hydrate();

    return () => {
      active = false;
    };
  }, [assessmentId, attemptIdFromQuery, router]);

  const flatQuestions = useMemo(() => {
    if (!payload) return [];
    return payload.sections.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        sectionTitle: section.title ?? `Section ${section.order}`,
      }))
    );
  }, [payload]);

  const current = flatQuestions[currentIndex] ?? null;
  const progress =
    flatQuestions.length > 0 ? Math.round(((currentIndex + 1) / flatQuestions.length) * 100) : 0;

  const saveAnswer = async (assessmentQuestionId: number, value: unknown) => {
    if (!attemptId) return;
    setError(null);
    setSavingQuestionId(assessmentQuestionId);
    try {
      await apiFetch(`/api/attempts/${attemptId}/answer`, {
        method: "PUT",
        body: JSON.stringify({ assessmentQuestionId, answer: value }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save answer.");
    } finally {
      setSavingQuestionId(null);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch(`/api/attempts/${attemptId}/submit`, { method: "POST" });
      router.push(`/assessments/results/${encodeURIComponent(attemptId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit attempt.");
    } finally {
      setSubmitting(false);
    }
  };

  if (hydrating || !payload) {
    return (
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Card>
          <CardContent>
            <Typography color="text.secondary">Preparing assessment...</Typography>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  if (!current) {
    return (
      <Stack spacing={2}>
        <Alert severity="warning">This assessment has no questions.</Alert>
        <Button variant="outlined" href={`/assessments/${assessmentId}`}>
          Back
        </Button>
      </Stack>
    );
  }

  const currentAnswer = answers[current.assessmentQuestionId];
  const options = extractOptions(current.options);

  return (
    <Stack spacing={2.5}>
      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack spacing={0.5}>
              <Typography variant="h5">{payload.assessment.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                Question {currentIndex + 1} of {flatQuestions.length} • {current.points} pts •{" "}
                {current.sectionTitle}
              </Typography>
            </Stack>

            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 6 }} />

            {payload.assessment.instructions ? (
              <>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  {payload.assessment.instructions}
                </Typography>
              </>
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">{current.questionText}</Typography>

            {current.type === "multiple_choice" && options.length > 0 ? (
              <RadioGroup
                value={typeof currentAnswer === "string" ? currentAnswer : ""}
                onChange={async (event) => {
                  const value = event.target.value;
                  setAnswers((prev) => ({ ...prev, [current.assessmentQuestionId]: value }));
                  await saveAnswer(current.assessmentQuestionId, value);
                }}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            ) : (
              <TextField
                label={current.type === "essay" ? "Your response" : "Answer"}
                multiline={current.type === "essay"}
                minRows={current.type === "essay" ? 6 : 1}
                value={typeof currentAnswer === "string" ? currentAnswer : ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setAnswers((prev) => ({ ...prev, [current.assessmentQuestionId]: value }));
                }}
                onBlur={async (event) => {
                  const value = normalizeString(event.target.value) ?? "";
                  await saveAnswer(current.assessmentQuestionId, value);
                }}
              />
            )}

            {savingQuestionId === current.assessmentQuestionId ? (
              <Typography variant="caption" color="text.secondary">
                Saving...
              </Typography>
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      <Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between">
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              disabled={currentIndex >= flatQuestions.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, flatQuestions.length - 1))}
            >
              Next
            </Button>
          </Stack>

          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : null;
}
