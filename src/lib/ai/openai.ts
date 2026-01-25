import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openai = new OpenAI({
  apiKey,
});

export const quizPromptTemplate = ({
  grade,
  subject,
  topic,
  capsTags,
  difficulty,
}: {
  grade: number;
  subject: string;
  topic: string;
  capsTags: string[];
  difficulty: string;
}) => {
  return `You are a CAPS-aligned tutor for South African learners.\nCreate a ${difficulty} quiz for Grade ${grade} in ${subject}.\nTopic: ${topic}.\nCAPS tags: ${capsTags.join(", ") || "general"}.\nReturn JSON with: title, description, questions[]. Each question: questionText, type (multiple_choice|short_answer|essay), options (array, optional), correctAnswer, explanation, points.`;
};
