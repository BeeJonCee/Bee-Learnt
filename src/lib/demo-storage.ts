export type LessonProgress = {
  lessonId: number;
  completed: boolean;
  lastAccessed: string;
};

export type QuizResult = {
  quizId: number;
  score: number;
  totalQuestions: number;
  feedback: string;
  completedAt: string;
};

type ProgressStore = Record<string, Record<number, LessonProgress>>;
type QuizStore = Record<string, Record<number, QuizResult>>;

const PROGRESS_KEY = "beelearn-progress";
const QUIZ_KEY = "beelearn-quiz-results";

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLessonProgress(userId: string): Record<number, LessonProgress> {
  const store = readStore<ProgressStore>(PROGRESS_KEY, {});
  return store[userId] ?? {};
}

export function upsertLessonProgress(
  userId: string,
  lessonId: number,
  updates: Partial<LessonProgress>
): LessonProgress {
  const store = readStore<ProgressStore>(PROGRESS_KEY, {});
  const current = store[userId] ?? {};
  const existing = current[lessonId] ?? {
    lessonId,
    completed: false,
    lastAccessed: new Date().toISOString(),
  };
  const next = {
    ...existing,
    ...updates,
    lessonId,
  };
  const nextStore: ProgressStore = {
    ...store,
    [userId]: {
      ...current,
      [lessonId]: next,
    },
  };
  writeStore(PROGRESS_KEY, nextStore);
  return next;
}

export function getQuizResults(userId: string): Record<number, QuizResult> {
  const store = readStore<QuizStore>(QUIZ_KEY, {});
  return store[userId] ?? {};
}

export function saveQuizResult(userId: string, result: QuizResult) {
  const store = readStore<QuizStore>(QUIZ_KEY, {});
  const current = store[userId] ?? {};
  const nextStore: QuizStore = {
    ...store,
    [userId]: {
      ...current,
      [result.quizId]: result,
    },
  };
  writeStore(QUIZ_KEY, nextStore);
}
