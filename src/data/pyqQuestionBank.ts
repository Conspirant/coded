import { supabase } from "@/integrations/supabase/client"

export interface PYQQuestion {
  id: string | number;
  chapter: string;
  chapterNumber: number;
  question: string;
  options: string[];
  correct: number;
  year: number;
  explanation: string;
  subject?: string;
  needs_image?: boolean;
  image_url?: string;
  option_images?: string[];
}

export interface ChapterInfo {
  number: number;
  name: string;
  questionCount: number;
  subject: string;
}

export const SUBJECTS = ["Physics", "Chemistry", "Mathematics"] as const
export type Subject = typeof SUBJECTS[number]

export const PHYSICS_CHAPTERS: Record<number, string> = {
    1: "Units and Measurements", 2: "Motion in a Straight Line", 3: "Motion in a Plane",
    4: "Laws of Motion", 5: "Work, Energy and Power", 6: "System of Particles and Rotational Motion",
    7: "Gravitation", 8: "Mechanical Properties of Solids", 9: "Mechanical Properties of Fluids",
    10: "Thermal Properties of Matter", 11: "Thermodynamics", 12: "Kinetic Theory",
    13: "Oscillations", 14: "Waves", 15: "Electric Charges and Fields",
    16: "Electrostatic Potential and Capacitance", 17: "Current Electricity", 18: "Moving Charges and Magnetism",
    19: "Magnetism and Matter", 20: "Electromagnetic Induction", 21: "Alternating Current",
    22: "Electromagnetic Waves", 23: "Ray Optics and Optical Instruments", 24: "Wave Optics",
    25: "Dual Nature of Radiation and Matter", 26: "Atoms", 27: "Nuclei", 28: "Semiconductor Electronics"
}

export const CHEMISTRY_CHAPTERS: Record<number, string> = {
    1: "Some Basic Concepts of Chemistry", 2: "Structure of Atom", 3: "Classification of Elements",
    4: "Chemical Bonding and Molecular Structure", 5: "States of Matter", 6: "Thermodynamics",
    7: "Equilibrium", 8: "Redox Reactions", 9: "Hydrogen",
    10: "The s-Block Elements", 11: "The p-Block Elements", 12: "Organic Chemistry: Basic Principles",
    13: "Hydrocarbons", 14: "Environmental Chemistry", 15: "The Solid State",
    16: "Solutions", 17: "Electrochemistry", 18: "Chemical Kinetics",
    19: "Surface Chemistry", 20: "General Principles of Isolation of Elements", 21: "The d- and f-Block Elements",
    22: "Coordination Compounds", 23: "Haloalkanes and Haloarenes", 24: "Alcohols, Phenols and Ethers",
    25: "Aldehydes, Ketones and Carboxylic Acids", 26: "Amines", 27: "Biomolecules", 28: "Polymers"
}

export const MATHS_CHAPTERS: Record<number, string> = {
    1: "Sets", 2: "Relations and Functions", 3: "Trigonometric Functions",
    4: "Complex Numbers", 5: "Linear Inequalities", 6: "Permutations and Combinations",
    7: "Binomial Theorem", 8: "Sequences and Series", 9: "Straight Lines",
    10: "Conic Sections", 11: "Introduction to 3D Geometry", 12: "Limits and Derivatives",
    13: "Statistics", 14: "Probability", 15: "Inverse Trigonometric Functions",
    16: "Matrices", 17: "Determinants", 18: "Continuity and Differentiability",
    19: "Application of Derivatives", 20: "Integrals", 21: "Application of Integrals",
    22: "Differential Equations", 23: "Vector Algebra", 24: "Three Dimensional Geometry",
    25: "Linear Programming", 26: "Probability (Class 12)"
}

export function getChaptersForSubject(subject: string): Record<number, string> {
    if (subject === "Chemistry") return CHEMISTRY_CHAPTERS
    if (subject === "Mathematics") return MATHS_CHAPTERS
    return PHYSICS_CHAPTERS
}

export let cachedChapterData: ChapterInfo[] = []

// Map DB row to PYQQuestion interface
function mapDbRow(q: any): PYQQuestion {
  return {
    id: q.id,
    chapter: q.chapter,
    chapterNumber: q.chapter_number,
    question: q.question,
    options: q.options,
    correct: q.correct_answer,
    year: q.year,
    explanation: q.explanation || "",
    subject: q.subject || "Physics",
    needs_image: q.needs_image,
    image_url: q.image_url,
    option_images: q.option_images,
  };
}

export async function getQuestionsByChapter(subject: string, chapterNumber: number): Promise<PYQQuestion[]> {
  const { data } = await supabase.from('pyq_questions' as any).select('*')
    .eq('subject', subject)
    .eq('chapter_number', chapterNumber);
  return (data || []).map(mapDbRow);
}

export async function getRandomQuestions(count: number): Promise<PYQQuestion[]> {
  const { data } = await supabase.from('pyq_questions' as any).select('*');
  const all = (data || []).map(mapDbRow);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function getQuestionsByYearRange(startYear: number, endYear: number): Promise<PYQQuestion[]> {
  const { data } = await supabase.from('pyq_questions' as any).select('*').gte('year', startYear).lte('year', endYear);
  return (data || []).map(mapDbRow);
}

export async function getQuestionsBySubject(subject: string): Promise<PYQQuestion[]> {
  const { data } = await supabase.from('pyq_questions' as any).select('*').eq('subject', subject);
  return (data || []).map(mapDbRow);
}

export async function getAllQuestions(): Promise<PYQQuestion[]> {
  const { data } = await supabase.from('pyq_questions' as any).select('*');
  return (data || []).map(mapDbRow);
}

// Dynamically update chapter counts
export async function loadChapterCounts(): Promise<void> {
  const response = await supabase.from('pyq_questions' as any).select('subject, chapter_number');
  const data = response.data as any[] | null;
  const counts: Record<string, number> = {};
  
  if (data) {
    for (const row of data) {
      const subj = row.subject || "Physics";
      const key = `${subj}-${row.chapter_number}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  const newCache: ChapterInfo[] = [];
  for (const subject of SUBJECTS) {
    const chapters = getChaptersForSubject(subject);
    for (const [numStr, name] of Object.entries(chapters)) {
      const num = parseInt(numStr);
      newCache.push({
        number: num,
        name,
        subject,
        questionCount: counts[`${subject}-${num}`] || 0
      });
    }
  }
  
  cachedChapterData = newCache;
}

export function getCachedChapters(subject?: string): ChapterInfo[] {
  if (subject && subject !== "All") {
    return cachedChapterData.filter(c => c.subject === subject);
  }
  return cachedChapterData;
}
