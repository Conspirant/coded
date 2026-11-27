export type Difficulty = "Easy" | "Average" | "Difficult";
export type PucSubjectKey = "physics" | "chemistry" | "mathematics";

export interface PucMcqQuestion {
  id: string;
  type: "mcq";
  subject: PucSubjectKey;
  chapterNumber: number;
  chapterName: string;
  questionNumber: number;
  question: string;
  options: [string, string, string, string];
  optionImages?: [string?, string?, string?, string?];
  correctIndex: number;
  difficulty?: Difficulty | null;
  imageUrl?: string;
}

export interface PucFibQuestion {
  id: string;
  type: "fib";
  subject: PucSubjectKey;
  chapterNumber: number;
  chapterName: string;
  setNumber: number;
  wordBank: string[];
  questionNumber: number;
  question: string;
  answer: string;
  difficulty?: Difficulty | null;
  imageUrl?: string;
}

export type PucQuestion = PucMcqQuestion | PucFibQuestion;

export interface PucChapterBank {
  chapterNumber: number;
  chapterName: string;
  mcqs: PucMcqQuestion[];
  fibs: PucFibQuestion[];
}

export interface PucSubjectBank {
  subject: PucSubjectKey;
  subjectCode: string;
  subjectName: string;
  chapters: PucChapterBank[];
}

const cache: Partial<Record<PucSubjectKey, PucSubjectBank>> = {};

export async function loadPucSubjectBank(subject: PucSubjectKey): Promise<PucSubjectBank> {
  if (cache[subject]) return cache[subject]!;
  let mod: { default: PucSubjectBank };
  if (subject === "physics") {
    mod = (await import("./physics-qb.json")) as unknown as { default: PucSubjectBank };
  } else if (subject === "chemistry") {
    mod = (await import("./chemistry-qb.json")) as unknown as { default: PucSubjectBank };
  } else {
    mod = (await import("./mathematics-qb.json")) as unknown as { default: PucSubjectBank };
  }
  cache[subject] = mod.default;
  return mod.default;
}

export function normalizeFibAnswer(val: string): string {
  return val
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;]+$/, "");
}

export function isFibCorrect(userAnswer: string | null | undefined, expected: string): boolean {
  if (!userAnswer) return false;
  return normalizeFibAnswer(userAnswer) === normalizeFibAnswer(expected);
}
