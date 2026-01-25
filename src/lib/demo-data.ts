export type UserRole = "student" | "parent";

export type Subject = {
  id: number;
  name: string;
  grade: number;
  description: string;
  imageUrl?: string | null;
};

export type Module = {
  id: number;
  subjectId: number;
  title: string;
  description: string;
  order: number;
};

export type LessonType = "text" | "video";

export type Lesson = {
  id: number;
  moduleId: number;
  title: string;
  content: string;
  type: LessonType;
  videoUrl?: string | null;
  order: number;
};

export type Quiz = {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  aiGenerated: boolean;
};

export type Question = {
  id: number;
  quizId: number;
  questionText: string;
  type: "multiple_choice" | "short_answer";
  options?: string[];
  correctAnswer: string;
  explanation?: string;
};

export type ParentOverview = {
  studentId: number;
  studentName: string;
  completedLessons: number;
  quizAverage: number;
};

const subjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    grade: 10,
    description: "Build confidence with algebra, functions, and graphs aligned to CAPS.",
  },
  {
    id: 2,
    name: "Physical Sciences",
    grade: 11,
    description: "Master motion, forces, and chemical systems with practical examples.",
  },
  {
    id: 3,
    name: "Life Sciences",
    grade: 12,
    description: "Explore cells, genetics, and modern biology with focused lessons.",
  },
];

const modules: Module[] = [
  {
    id: 101,
    subjectId: 1,
    title: "Algebraic Expressions",
    description: "Simplify expressions and understand algebraic structure.",
    order: 1,
  },
  {
    id: 102,
    subjectId: 1,
    title: "Functions and Graphs",
    description: "Analyze linear functions and interpret graphs with confidence.",
    order: 2,
  },
  {
    id: 201,
    subjectId: 2,
    title: "Motion and Force",
    description: "Explore vectors, Newton's laws, and motion in one dimension.",
    order: 1,
  },
  {
    id: 202,
    subjectId: 2,
    title: "Chemical Systems",
    description: "Understand atomic structure and key reaction types.",
    order: 2,
  },
  {
    id: 301,
    subjectId: 3,
    title: "Cell Biology",
    description: "Study the building blocks of life and cellular processes.",
    order: 1,
  },
  {
    id: 302,
    subjectId: 3,
    title: "Genetics and Inheritance",
    description: "Learn DNA basics and inheritance patterns.",
    order: 2,
  },
];

const lessons: Lesson[] = [
  {
    id: 1001,
    moduleId: 101,
    title: "Intro to Algebra",
    content: "# Algebra introduction\n\nAlgebra uses symbols to represent unknown values. In CAPS, you will use algebra to model real problems and simplify expressions.\n\n## Goals\n- Understand variables and constants\n- Translate words into expressions\n- Simplify with basic rules\n\n## Key idea\nCombine like terms by adding their coefficients.",
    type: "text",
    order: 1,
  },
  {
    id: 1002,
    moduleId: 101,
    title: "Simplifying Expressions",
    content: "# Simplifying expressions\n\nYou can simplify by collecting like terms and factoring common factors.\n\n## Example\n2x + 3x - x = 4x\n\n## Practice\nSimplify: 5a - 2a + 7.",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/6-yJXqkty6I",
    order: 2,
  },
  {
    id: 1003,
    moduleId: 102,
    title: "Linear Functions",
    content: "# Linear functions\n\nA linear function has the form y = mx + c. The gradient tells you how steep the line is.\n\n## Goals\n- Interpret m and c\n- Plot straight lines\n- Compare gradients\n\n## Tip\nTwo points define a line. Use rise over run to find m.",
    type: "text",
    order: 1,
  },
  {
    id: 1004,
    moduleId: 102,
    title: "Graph Interpretation",
    content: "# Graph interpretation\n\nReading graphs is about understanding trends, intercepts, and scales.\n\n## Focus\n- Intercepts\n- Slope\n- Domain and range\n\n## Practice\nDescribe what happens when the graph crosses the y-axis at 3.",
    type: "text",
    order: 2,
  },
  {
    id: 2001,
    moduleId: 201,
    title: "Vectors and Scalars",
    content: "# Vectors and scalars\n\nScalars have magnitude only. Vectors have magnitude and direction.\n\n## Examples\n- Speed is a scalar\n- Velocity is a vector\n\n## Tip\nUse arrows to represent vectors.",
    type: "text",
    order: 1,
  },
  {
    id: 2002,
    moduleId: 201,
    title: "Newton's Laws",
    content: "# Newton's laws\n\nThese laws explain how forces affect motion.\n\n## Summary\n1. Inertia\n2. F = ma\n3. Action and reaction\n\n## Practice\nIdentify the forces on a sliding book.",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
    order: 2,
  },
  {
    id: 2003,
    moduleId: 202,
    title: "Atomic Structure",
    content: "# Atomic structure\n\nAtoms consist of protons, neutrons, and electrons.\n\n## Goals\n- Identify particles\n- Use atomic number and mass number\n- Understand isotopes\n\n## Tip\nAtomic number equals number of protons.",
    type: "text",
    order: 1,
  },
  {
    id: 2004,
    moduleId: 202,
    title: "Chemical Reactions",
    content: "# Chemical reactions\n\nReactions involve breaking and forming bonds.\n\n## Types\n- Synthesis\n- Decomposition\n- Combustion\n\n## Practice\nClassify the reaction: 2H2 + O2 -> 2H2O.",
    type: "text",
    order: 2,
  },
  {
    id: 3001,
    moduleId: 301,
    title: "Cell Structure",
    content: "# Cell structure\n\nCells are the basic unit of life. Eukaryotic cells contain organelles.\n\n## Organelles\n- Nucleus\n- Mitochondria\n- Ribosomes\n\n## Practice\nExplain the role of the nucleus.",
    type: "text",
    order: 1,
  },
  {
    id: 3002,
    moduleId: 301,
    title: "Mitosis Overview",
    content: "# Mitosis overview\n\nMitosis is cell division used for growth and repair.\n\n## Stages\n- Prophase\n- Metaphase\n- Anaphase\n- Telophase\n\n## Tip\nRemember PMAT to recall the order.",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/f-ldPgEfAHI",
    order: 2,
  },
  {
    id: 3003,
    moduleId: 302,
    title: "DNA Basics",
    content: "# DNA basics\n\nDNA carries genetic information. It is made of nucleotides.\n\n## Components\n- Sugar\n- Phosphate\n- Base\n\n## Practice\nName the four DNA bases.",
    type: "text",
    order: 1,
  },
  {
    id: 3004,
    moduleId: 302,
    title: "Punnett Squares",
    content: "# Punnett squares\n\nPunnett squares help predict inheritance patterns.\n\n## Goals\n- Set up a square\n- Identify genotypes\n- Calculate ratios\n\n## Tip\nUse uppercase for dominant traits.",
    type: "text",
    order: 2,
  },
];

const quizzes: Quiz[] = [
  {
    id: 5001,
    moduleId: 101,
    title: "Algebra Basics",
    description: "Check your understanding of algebraic expressions.",
    difficulty: "easy",
    aiGenerated: false,
  },
  {
    id: 5002,
    moduleId: 102,
    title: "Functions Sprint",
    description: "Short quiz on linear functions and graphs.",
    difficulty: "medium",
    aiGenerated: false,
  },
  {
    id: 5003,
    moduleId: 201,
    title: "Motion Check",
    description: "Test your knowledge of vectors and forces.",
    difficulty: "medium",
    aiGenerated: true,
  },
  {
    id: 5004,
    moduleId: 202,
    title: "Chemistry Essentials",
    description: "Review key ideas in chemical systems.",
    difficulty: "hard",
    aiGenerated: true,
  },
  {
    id: 5005,
    moduleId: 301,
    title: "Cell Quiz",
    description: "Assess your understanding of cell biology.",
    difficulty: "easy",
    aiGenerated: false,
  },
  {
    id: 5006,
    moduleId: 302,
    title: "Genetics Review",
    description: "Practice genetics and inheritance basics.",
    difficulty: "medium",
    aiGenerated: false,
  },
];

const questions: Question[] = [
  {
    id: 9001,
    quizId: 5001,
    questionText: "Solve for x: 2x = 10",
    type: "multiple_choice",
    options: ["2", "5", "10", "12"],
    correctAnswer: "5",
    explanation: "Divide both sides by 2 to get x = 5.",
  },
  {
    id: 9002,
    quizId: 5001,
    questionText: "Simplify: 3a + 4a - a",
    type: "multiple_choice",
    options: ["6a", "7a", "8a", "a"],
    correctAnswer: "6a",
    explanation: "Combine like terms: 3a + 4a - a = 6a.",
  },
  {
    id: 9003,
    quizId: 5001,
    questionText: "What does a variable represent?",
    type: "short_answer",
    correctAnswer: "unknown value",
  },
  {
    id: 9011,
    quizId: 5002,
    questionText: "What is the gradient of y = 4x + 1?",
    type: "multiple_choice",
    options: ["1", "4", "5", "0"],
    correctAnswer: "4",
  },
  {
    id: 9012,
    quizId: 5002,
    questionText: "Which point lies on y = 2x?",
    type: "multiple_choice",
    options: ["(1, 1)", "(2, 3)", "(3, 6)", "(4, 5)"],
    correctAnswer: "(3, 6)",
  },
  {
    id: 9013,
    quizId: 5002,
    questionText: "Define the y-intercept in a sentence.",
    type: "short_answer",
    correctAnswer: "where the graph crosses the y-axis",
  },
  {
    id: 9021,
    quizId: 5003,
    questionText: "Velocity is a: ",
    type: "multiple_choice",
    options: ["scalar", "vector", "unit", "mass"],
    correctAnswer: "vector",
  },
  {
    id: 9022,
    quizId: 5003,
    questionText: "Which law is F = ma?",
    type: "multiple_choice",
    options: ["First", "Second", "Third", "Fourth"],
    correctAnswer: "Second",
  },
  {
    id: 9023,
    quizId: 5003,
    questionText: "State Newton's third law.",
    type: "short_answer",
    correctAnswer: "every action has an equal and opposite reaction",
  },
  {
    id: 9031,
    quizId: 5004,
    questionText: "What is the atomic number?",
    type: "multiple_choice",
    options: ["Number of protons", "Number of neutrons", "Mass number", "Number of shells"],
    correctAnswer: "Number of protons",
  },
  {
    id: 9032,
    quizId: 5004,
    questionText: "Combustion is a reaction with:",
    type: "multiple_choice",
    options: ["oxygen", "nitrogen", "carbon", "water"],
    correctAnswer: "oxygen",
  },
  {
    id: 9033,
    quizId: 5004,
    questionText: "Give one example of a synthesis reaction.",
    type: "short_answer",
    correctAnswer: "2h2 + o2 -> 2h2o",
  },
  {
    id: 9041,
    quizId: 5005,
    questionText: "Which organelle controls cell activities?",
    type: "multiple_choice",
    options: ["Nucleus", "Ribosome", "Cell wall", "Chloroplast"],
    correctAnswer: "Nucleus",
  },
  {
    id: 9042,
    quizId: 5005,
    questionText: "Mitochondria are responsible for:",
    type: "multiple_choice",
    options: ["Photosynthesis", "Energy release", "Protein synthesis", "Storage"],
    correctAnswer: "Energy release",
  },
  {
    id: 9043,
    quizId: 5005,
    questionText: "Name the process of cell division.",
    type: "short_answer",
    correctAnswer: "mitosis",
  },
  {
    id: 9051,
    quizId: 5006,
    questionText: "DNA stands for:",
    type: "multiple_choice",
    options: ["Deoxyribonucleic acid", "Dioxyribonucleic acid", "Deoxyribose acid", "DNA acid"],
    correctAnswer: "Deoxyribonucleic acid",
  },
  {
    id: 9052,
    quizId: 5006,
    questionText: "Which base pairs with Adenine in DNA?",
    type: "multiple_choice",
    options: ["Cytosine", "Guanine", "Thymine", "Uracil"],
    correctAnswer: "Thymine",
  },
  {
    id: 9053,
    quizId: 5006,
    questionText: "Define genotype.",
    type: "short_answer",
    correctAnswer: "genetic makeup of an organism",
  },
];

const parentOverview: ParentOverview[] = [
  {
    studentId: 1,
    studentName: "Nala Mokoena",
    completedLessons: 6,
    quizAverage: 78,
  },
  {
    studentId: 2,
    studentName: "Samkelo Dube",
    completedLessons: 4,
    quizAverage: 64,
  },
];

export function getSubjects(): Subject[] {
  return subjects;
}

export function getSubjectById(id: number): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

export function getModulesBySubjectId(subjectId: number): Module[] {
  return modules
    .filter((module) => module.subjectId === subjectId)
    .sort((a, b) => a.order - b.order);
}

export function getModuleById(id: number): Module | undefined {
  return modules.find((module) => module.id === id);
}

export function getLessonsByModuleId(moduleId: number): Lesson[] {
  return lessons
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(id: number): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getQuizzesByModuleId(moduleId: number): Quiz[] {
  return quizzes.filter((quiz) => quiz.moduleId === moduleId);
}

export function getQuizById(id: number): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id);
}

export function getQuestionsByQuizId(quizId: number): Question[] {
  return questions.filter((question) => question.quizId === quizId);
}

export function getParentOverview(): ParentOverview[] {
  return parentOverview;
}
