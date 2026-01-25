import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["STUDENT", "PARENT", "ADMIN"]);
export const lessonTypeEnum = pgEnum("lesson_type", ["text", "video", "diagram", "pdf"]);
export const resourceTypeEnum = pgEnum("resource_type", ["pdf", "link", "video", "diagram"]);
export const quizDifficultyEnum = pgEnum("quiz_difficulty", ["easy", "medium", "hard", "adaptive"]);
export const quizTypeEnum = pgEnum("quiz_question_type", ["multiple_choice", "short_answer", "essay"]);
export const assignmentPriorityEnum = pgEnum("assignment_priority", ["low", "medium", "high"]);
export const assignmentStatusEnum = pgEnum("assignment_status", ["todo", "in_progress", "submitted", "graded"]);
export const badgeRuleEnum = pgEnum("badge_rule", [
  "lesson_streak",
  "quiz_mastery",
  "assignment_finisher",
  "study_time",
]);

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: roleEnum("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  image: text("image"),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const parentStudentLinks = pgTable("parent_student_links", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => users.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  minGrade: integer("min_grade").notNull(),
  maxGrade: integer("max_grade").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  grade: integer("grade").notNull(),
  order: integer("order").notNull(),
  capsTags: jsonb("caps_tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  content: text("content"),
  type: lessonTypeEnum("type").notNull(),
  videoUrl: text("video_url"),
  diagramUrl: text("diagram_url"),
  pdfUrl: text("pdf_url"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lessonResources = pgTable("lesson_resources", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  type: resourceTypeEnum("type").notNull(),
  url: text("url").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const progressTracking = pgTable("progress_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id),
  moduleId: integer("module_id").references(() => modules.id),
  completed: boolean("completed").default(false).notNull(),
  timeSpentMinutes: integer("time_spent_minutes").default(0).notNull(),
  lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  priority: assignmentPriorityEnum("priority").default("medium").notNull(),
  status: assignmentStatusEnum("status").default("todo").notNull(),
  grade: integer("grade").notNull(),
  reminders: jsonb("reminders").$type<string[]>().default([]),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const moduleChecklistItems = pgTable("module_checklist_items", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  order: integer("order").notNull(),
  required: boolean("required").default(true).notNull(),
});

export const checklistProgress = pgTable("checklist_progress", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").references(() => moduleChecklistItems.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  difficulty: quizDifficultyEnum("difficulty").default("medium").notNull(),
  source: varchar("source", { length: 40 }).default("manual").notNull(),
  capsTags: jsonb("caps_tags").$type<string[]>().default([]),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  type: quizTypeEnum("type").notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options").$type<string[] | null>().default(null),
  correctAnswer: text("correct_answer"),
  explanation: text("explanation"),
  points: integer("points").default(1).notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => quizAttempts.id).notNull(),
  questionId: integer("question_id").references(() => quizQuestions.id).notNull(),
  answer: text("answer"),
  isCorrect: boolean("is_correct").default(false).notNull(),
  score: integer("score").default(0).notNull(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  ruleKey: badgeRuleEnum("rule_key").notNull(),
  criteria: jsonb("criteria").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badges.id).notNull(),
  awardedAt: timestamp("awarded_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  durationMinutes: integer("duration_minutes").default(0).notNull(),
  source: varchar("source", { length: 40 }).default("timer").notNull(),
});

export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastStudyDate: timestamp("last_study_date", { withTimezone: true }),
  weeklyMinutes: integer("weekly_minutes").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 80 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  message: text("message"),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => users.id),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 120 }).notNull(),
  entityId: integer("entity_id"),
  details: jsonb("details").$type<Record<string, unknown>>().default({}),
  ipAddress: varchar("ip_address", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
