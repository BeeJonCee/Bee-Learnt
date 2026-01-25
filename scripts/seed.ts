import "dotenv/config";
import { db } from "../src/lib/db";
import {
  assignments,
  badges,
  lessonResources,
  lessons,
  moduleChecklistItems,
  modules,
  roles,
  subjects,
  users,
} from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  const existingRoles = await db.select().from(roles);
  if (existingRoles.length === 0) {
    await db.insert(roles).values([
      { name: "STUDENT", description: "Student role" },
      { name: "PARENT", description: "Parent role" },
      { name: "ADMIN", description: "Admin role" },
    ]);
  }

  const [studentRole] = await db.select().from(roles).where(eq(roles.name, "STUDENT"));
  const [parentRole] = await db.select().from(roles).where(eq(roles.name, "PARENT"));
  const [adminRole] = await db.select().from(roles).where(eq(roles.name, "ADMIN"));

  const sampleUsers = await db.select().from(users).limit(1);
  if (sampleUsers.length === 0 && studentRole && parentRole && adminRole) {
    const studentHash = await bcrypt.hash("learn", 10);
    const parentHash = await bcrypt.hash("care", 10);
    const adminHash = await bcrypt.hash("adminpass", 10);

    await db.insert(users).values([
      {
        name: "Nala Mokoena",
        email: "student@beelearn.local",
        passwordHash: studentHash,
        roleId: studentRole.id,
      },
      {
        name: "Thabo Khumalo",
        email: "parent@beelearn.local",
        passwordHash: parentHash,
        roleId: parentRole.id,
      },
      {
        name: "Admin Bee",
        email: "admin@beelearn.local",
        passwordHash: adminHash,
        roleId: adminRole.id,
      },
    ]);
  }

  const existingSubjects = await db.select().from(subjects);
  if (existingSubjects.length === 0) {
    await db.insert(subjects).values([
      {
        name: "Mathematics",
        description: "Algebra, functions, and graphs aligned to CAPS.",
        minGrade: 9,
        maxGrade: 12,
      },
      {
        name: "Physical Sciences",
        description: "Motion, forces, and chemical systems.",
        minGrade: 9,
        maxGrade: 12,
      },
      {
        name: "Life Sciences",
        description: "Cells, genetics, and biological systems.",
        minGrade: 9,
        maxGrade: 12,
      },
      {
        name: "Information Technology",
        description:
          "CAPS-aligned programming, systems, and digital technologies for Grades 10-12.",
        minGrade: 10,
        maxGrade: 12,
      },
    ]);
  }

  const subjectRows = await db.select().from(subjects);
  const subjectByName = new Map(subjectRows.map((subject) => [subject.name, subject]));
  const itSubject = subjectByName.get("Information Technology");

  const existingModules = await db.select().from(modules);
  if (existingModules.length === 0 && itSubject) {
    await db.insert(modules).values([
      {
        subjectId: itSubject.id,
        title: "Hardware and Software Basics",
        description: "Computer components, operating systems, and device management.",
        grade: 10,
        order: 1,
        capsTags: ["hardware", "software"],
      },
      {
        subjectId: itSubject.id,
        title: "Data Representation",
        description: "Binary, hex, and data measurement concepts.",
        grade: 10,
        order: 2,
        capsTags: ["binary", "hex"],
      },
      {
        subjectId: itSubject.id,
        title: "Algorithms and Pseudocode",
        description: "Problem-solving with structured logic and flow control.",
        grade: 10,
        order: 3,
        capsTags: ["algorithms", "pseudocode"],
      },
      {
        subjectId: itSubject.id,
        title: "Programming in Delphi",
        description: "Foundations of Delphi syntax, variables, and UI components.",
        grade: 10,
        order: 4,
        capsTags: ["delphi", "programming"],
      },
      {
        subjectId: itSubject.id,
        title: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, and encapsulation.",
        grade: 11,
        order: 5,
        capsTags: ["oop"],
      },
      {
        subjectId: itSubject.id,
        title: "File Handling",
        description: "Reading, writing, and validating data files.",
        grade: 11,
        order: 6,
        capsTags: ["file-handling"],
      },
      {
        subjectId: itSubject.id,
        title: "Databases and SQL",
        description: "Relational data modeling, SQL queries, and normalization.",
        grade: 11,
        order: 7,
        capsTags: ["sql", "normalization"],
      },
      {
        subjectId: itSubject.id,
        title: "Networks",
        description: "Network models, IP addressing, and secure connectivity.",
        grade: 11,
        order: 8,
        capsTags: ["networks"],
      },
      {
        subjectId: itSubject.id,
        title: "Systems Analysis and Design",
        description: "SDLC, requirements gathering, and design artifacts.",
        grade: 12,
        order: 9,
        capsTags: ["sdlc", "systems"],
      },
      {
        subjectId: itSubject.id,
        title: "Cybersecurity and Ethics",
        description: "Digital safety, privacy, and ethical computing.",
        grade: 12,
        order: 10,
        capsTags: ["cybersecurity", "ethics"],
      },
    ]);
  }

  const moduleRows = await db.select().from(modules);
  const moduleByTitle = new Map(moduleRows.map((module) => [module.title, module]));

  const existingLessons = await db.select().from(lessons);
  if (existingLessons.length === 0) {
    const hardwareModule = moduleByTitle.get("Hardware and Software Basics");
    const dataModule = moduleByTitle.get("Data Representation");
    const algoModule = moduleByTitle.get("Algorithms and Pseudocode");
    const delphiModule = moduleByTitle.get("Programming in Delphi");
    const oopModule = moduleByTitle.get("Object-Oriented Programming");
    const fileModule = moduleByTitle.get("File Handling");
    const dbModule = moduleByTitle.get("Databases and SQL");
    const networkModule = moduleByTitle.get("Networks");
    const sdlcModule = moduleByTitle.get("Systems Analysis and Design");
    const cyberModule = moduleByTitle.get("Cybersecurity and Ethics");

    await db.insert(lessons).values([
      {
        moduleId: hardwareModule?.id ?? 1,
        title: "Computer Components",
        content: "# Components\n\nIdentify CPU, RAM, storage, and peripherals.",
        type: "text",
        order: 1,
      },
      {
        moduleId: dataModule?.id ?? 1,
        title: "Binary and Hex",
        content: "# Binary basics\n\nConvert decimal to binary and hexadecimal.",
        type: "text",
        order: 1,
      },
      {
        moduleId: algoModule?.id ?? 1,
        title: "Algorithm Steps",
        content: "# Algorithms\n\nPlan logic using pseudocode and flowcharts.",
        type: "text",
        order: 1,
      },
      {
        moduleId: delphiModule?.id ?? 1,
        title: "Delphi Fundamentals",
        content: "# Delphi\n\nVariables, input/output, and basic UI controls.",
        type: "text",
        order: 1,
      },
      {
        moduleId: oopModule?.id ?? 1,
        title: "Classes and Objects",
        content: "# OOP\n\nDefine classes, instantiate objects, and use methods.",
        type: "text",
        order: 1,
      },
      {
        moduleId: fileModule?.id ?? 1,
        title: "File IO",
        content: "# File handling\n\nRead and write data files safely.",
        type: "text",
        order: 1,
      },
      {
        moduleId: dbModule?.id ?? 1,
        title: "SQL Basics",
        content: "# SQL\n\nSELECT, INSERT, UPDATE, DELETE with best practices.",
        type: "text",
        order: 1,
      },
      {
        moduleId: networkModule?.id ?? 1,
        title: "Network Models",
        content: "# Networks\n\nOSI and TCP/IP fundamentals.",
        type: "text",
        order: 1,
      },
      {
        moduleId: sdlcModule?.id ?? 1,
        title: "SDLC Overview",
        content: "# SDLC\n\nUnderstand each phase and its outputs.",
        type: "text",
        order: 1,
      },
      {
        moduleId: cyberModule?.id ?? 1,
        title: "Cyber Safety",
        content: "# Cybersecurity\n\nProtect identity and data online.",
        type: "text",
        order: 1,
      },
    ]);
  }

  const lessonRows = await db.select().from(lessons);
  const lessonByTitle = new Map(lessonRows.map((lesson) => [lesson.title, lesson]));

  const existingResources = await db.select().from(lessonResources);
  if (existingResources.length === 0) {
    const resourcesSeed = [
      {
        lesson: "Binary and Hex",
        title: "Binary practice sheet",
        type: "pdf" as const,
        url: "https://example.com/binary-practice.pdf",
        tags: ["binary", "practice"],
      },
      {
        lesson: "Delphi Fundamentals",
        title: "Delphi starter project",
        type: "link" as const,
        url: "https://example.com/delphi-starter",
        tags: ["delphi", "starter"],
      },
    ];

    await db.insert(lessonResources).values(
      resourcesSeed.map((resource) => ({
        lessonId: lessonByTitle.get(resource.lesson)?.id ?? 1,
        title: resource.title,
        type: resource.type,
        url: resource.url,
        tags: resource.tags,
      }))
    );
  }

  const existingAssignments = await db.select().from(assignments);
  if (existingAssignments.length === 0) {
    const assignmentSeed = [
      {
        moduleTitle: "Programming in Delphi",
        title: "Delphi Calculator",
        description: "Build a calculator with validation and error handling.",
        dueDate: "2026-03-20T12:00:00Z",
        priority: "high" as const,
        status: "todo" as const,
        grade: 10,
      },
      {
        moduleTitle: "Databases and SQL",
        title: "SQL Query Portfolio",
        description: "Write 10 queries against the learner database.",
        dueDate: "2026-04-10T12:00:00Z",
        priority: "medium" as const,
        status: "todo" as const,
        grade: 11,
      },
      {
        moduleTitle: "Systems Analysis and Design",
        title: "SDLC Case Study",
        description: "Document SDLC phases for a school app.",
        dueDate: "2026-05-05T12:00:00Z",
        priority: "medium" as const,
        status: "todo" as const,
        grade: 12,
      },
    ];

    await db.insert(assignments).values(
      assignmentSeed.map((assignment) => ({
        moduleId: moduleByTitle.get(assignment.moduleTitle)?.id ?? 1,
        title: assignment.title,
        description: assignment.description,
        dueDate: new Date(assignment.dueDate),
        priority: assignment.priority,
        status: assignment.status,
        grade: assignment.grade,
      }))
    );
  }

  const existingChecklist = await db.select().from(moduleChecklistItems);
  if (existingChecklist.length === 0) {
    const checklistSeed = [
      {
        moduleTitle: "Programming in Delphi",
        title: "Design UI layout",
        order: 1,
      },
      {
        moduleTitle: "Programming in Delphi",
        title: "Handle button click events",
        order: 2,
      },
      {
        moduleTitle: "Databases and SQL",
        title: "Normalize sample tables",
        order: 1,
      },
      {
        moduleTitle: "Cybersecurity and Ethics",
        title: "Write a security checklist",
        order: 1,
      },
    ];

    await db.insert(moduleChecklistItems).values(
      checklistSeed.map((item) => ({
        moduleId: moduleByTitle.get(item.moduleTitle)?.id ?? 1,
        title: item.title,
        order: item.order,
        required: true,
      }))
    );
  }

  const existingBadges = await db.select().from(badges);
  if (existingBadges.length === 0) {
    await db.insert(badges).values([
      {
        name: "Streak Starter",
        description: "Study 3 days in a row.",
        ruleKey: "lesson_streak",
        criteria: { streak: 3 },
      },
      {
        name: "Quiz Closer",
        description: "Score above 80% on 3 quizzes.",
        ruleKey: "quiz_mastery",
        criteria: { score: 80, count: 3 },
      },
      {
        name: "Assignment Ace",
        description: "Complete 5 assignments on time.",
        ruleKey: "assignment_finisher",
        criteria: { count: 5 },
      },
    ]);
  }

  console.log("Seed complete");
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
