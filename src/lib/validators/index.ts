import { z } from "zod";

export const moduleCreateSchema = z.object({
  subjectId: z.number().int().positive(),
  title: z.string().min(3),
  description: z.string().optional(),
  grade: z.number().int().min(9).max(12),
  order: z.number().int().min(1),
  capsTags: z.array(z.string()).default([]),
});

export const moduleUpdateSchema = moduleCreateSchema.partial();

export const lessonCreateSchema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().min(3),
  content: z.string().optional(),
  type: z.enum(["text", "video", "diagram", "pdf"]),
  videoUrl: z.string().url().optional().nullable(),
  diagramUrl: z.string().url().optional().nullable(),
  pdfUrl: z.string().url().optional().nullable(),
  order: z.number().int().min(1),
});

export const lessonUpdateSchema = lessonCreateSchema.partial();

export const resourceCreateSchema = z.object({
  lessonId: z.number().int().positive(),
  title: z.string().min(3),
  type: z.enum(["pdf", "link", "video", "diagram"]),
  url: z.string().url(),
  tags: z.array(z.string()).default([]),
});

export const assignmentCreateSchema = z.object({
  moduleId: z.number().int().positive(),
  lessonId: z.number().int().positive().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["todo", "in_progress", "submitted", "graded"]).default("todo"),
  grade: z.number().int().min(9).max(12),
});

export const quizGenerateSchema = z.object({
  subjectId: z.number().int().positive(),
  moduleId: z.number().int().positive(),
  topic: z.string().min(3),
  grade: z.number().int().min(9).max(12),
  capsTags: z.array(z.string()).default([]),
  difficulty: z.enum(["easy", "medium", "hard", "adaptive"]).default("medium"),
  performance: z
    .object({
      averageScore: z.number().min(0).max(100).optional(),
      recentMistakes: z.array(z.string()).optional(),
    })
    .optional(),
});

export const quizSubmitSchema = z.object({
  quizId: z.number().int().positive(),
  answers: z.array(
    z.object({
      questionId: z.number().int().positive(),
      answer: z.string().min(1),
    })
  ),
});

export const studySessionCreateSchema = z.object({
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  durationMinutes: z.number().int().min(1),
});

export const searchQuerySchema = z.object({
  query: z.string().min(2),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "PARENT"]).default("STUDENT"),
});
