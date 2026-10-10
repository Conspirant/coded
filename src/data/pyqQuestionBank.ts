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
  explanation_image_url?: string;
  option_images?: string[];
}

export interface ChapterInfo {
  number: number;
  name: string;
  questionCount: number;
  subject: string;
}

export interface QuestionFilters {
  subjects?: string[];
  chapterKeys?: string[];
  startYear?: number;
  endYear?: number;
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
    4: "Chemical Bonding and Molecular Structure", 5: "Thermodynamics", 6: "Equilibrium",
    7: "Redox Reactions", 8: "Organic Chemistry: Some Basic Principles and Techniques", 9: "Hydrocarbons",
    10: "Solutions", 11: "Electrochemistry", 12: "Chemical Kinetics",
    13: "The d- and f-Block Elements", 14: "Coordination Compounds", 15: "Haloalkanes and Haloarenes",
    16: "Alcohols, Phenols and Ethers", 17: "Aldehydes, Ketones and Carboxylic Acids", 18: "Amines",
    19: "Biomolecules"
}

export const MATHS_CHAPTERS: Record<number, string> = {
    1: "Sets", 2: "Relations and Functions", 3: "Trigonometric Functions",
    4: "Complex Numbers", 5: "Linear Inequalities", 6: "Permutations and Combinations",
    7: "Binomial Theorem", 8: "Sequences and Series", 9: "Straight Lines",
    10: "Conic Sections", 11: "Statistics", 12: "Probability",
    13: "Matrices and Determinants", 14: "Limits and Derivatives",
    15: "Continuity and Differentiability", 16: "Application of Derivatives",
    17: "Integrals", 18: "Differential Equations", 19: "Vector Algebra",
    20: "Three Dimensional Geometry", 21: "Linear Programming", 22: "Probability"
}

export function getChaptersForSubject(subject: string): Record<number, string> {
    if (subject === "Chemistry") return CHEMISTRY_CHAPTERS
    if (subject === "Mathematics") return MATHS_CHAPTERS
    return PHYSICS_CHAPTERS
}

import fallbackPhysicsJson from './pyq_physics_ch1_ch2.json'
import fallbackPhysicsCh3Json from './pyq_physics_ch3.json'
import fallbackPhysicsCh4Json from './pyq_physics_ch4.json'
import fallbackPhysicsCh5Json from './pyq_physics_ch5.json'
import fallbackPhysicsCh6Json from './pyq_physics_ch6.json'
import fallbackPhysicsCh7Json from './pyq_physics_ch7.json'
import fallbackPhysicsCh8Json from './pyq_physics_ch8.json'
import fallbackPhysicsCh9Json from './pyq_physics_ch9.json'
import fallbackPhysicsCh10Json from './pyq_physics_ch10.json'
import fallbackPhysicsCh11Json from './pyq_physics_ch11.json'
import fallbackPhysicsCh12Json from './pyq_physics_ch12.json'
import fallbackPhysicsCh13Json from './pyq_physics_ch13.json'
import fallbackPhysicsCh14Json from './pyq_physics_ch14.json'
import fallbackPhysicsCh15Json from './pyq_physics_ch15.json'
import fallbackPhysicsCh16Json from './pyq_physics_ch16.json'
import fallbackPhysicsCh17Json from './pyq_physics_ch17.json'
import fallbackPhysicsCh18Json from './pyq_physics_ch18.json'
import fallbackPhysicsCh19Json from './pyq_physics_ch19.json'
import fallbackPhysicsCh20Json from './pyq_physics_ch20.json'
import fallbackPhysicsCh21Json from './pyq_physics_ch21.json'
import fallbackPhysicsCh22Json from './pyq_physics_ch22.json'
import fallbackPhysicsCh23Json from './pyq_physics_ch23.json'
import fallbackChemJson from './pyq_chemistry_ch1.json'
import fallbackChemCh2Json from './pyq_chemistry_ch2.json'
import fallbackChemCh3Json from './pyq_chemistry_ch3.json'
import fallbackChemCh4Json from './pyq_chemistry_ch4.json'
import fallbackChemCh5Json from './pyq_chemistry_ch5.json'
import fallbackChemCh6Json from './pyq_chemistry_ch6.json'
import fallbackChemCh7Json from './pyq_chemistry_ch7.json'
import fallbackChemCh8Json from './pyq_chemistry_ch8.json'
import fallbackChemCh9Json from './pyq_chemistry_ch9.json'
import fallbackChemCh10Json from './pyq_chemistry_ch10.json'
import fallbackChemCh11Json from './pyq_chemistry_ch11.json'
import fallbackChemCh12Json from './pyq_chemistry_ch12.json'
import fallbackChemCh13Json from './pyq_chemistry_ch13.json'
import fallbackChemCh14Json from './pyq_chemistry_ch14.json'
import fallbackChemCh15Json from './pyq_chemistry_ch15.json'
import fallbackChemCh16Json from './pyq_chemistry_ch16.json'
import fallbackChemCh17Json from './pyq_chemistry_ch17.json'
import fallbackChemCh18Json from './pyq_chemistry_ch18.json'
import fallbackChemCh19Json from './pyq_chemistry_ch19.json'
import fallbackMathJson from './pyq_maths_ch1.json'
import fallbackMathCh2Json from './pyq_maths_ch2.json'
import fallbackMathCh3Json from './pyq_maths_ch3.json'
import fallbackMathCh4Json from './pyq_maths_ch4.json'
import fallbackMathCh6Json from './pyq_maths_ch6.json'
import fallbackMathCh7Json from './pyq_maths_ch7.json'
import fallbackMathCh8Json from './pyq_maths_ch8.json'
import fallbackMathCh9Json from './pyq_maths_ch9.json'
import fallbackMathCh10Json from './pyq_maths_ch10.json'
import fallbackMathCh11Json from './pyq_maths_ch11.json'
import fallbackMathCh12Json from './pyq_maths_ch12.json'
import fallbackMathCh13Json from './pyq_maths_ch13.json'
import fallbackMathCh14Json from './pyq_maths_ch14.json'
import fallbackMathCh15Json from './pyq_maths_ch15.json'
import fallbackMathCh16Json from './pyq_maths_ch16.json'
import fallbackMathCh17Json from './pyq_maths_ch17.json'
import fallbackMathCh18Json from './pyq_maths_ch18.json'
import fallbackMathCh19Json from './pyq_maths_ch19.json'

export let cachedChapterData: ChapterInfo[] = []

const allFallbackRaw = [
  ...(fallbackPhysicsJson as any[]),
  ...(fallbackPhysicsCh3Json as any[]),
  ...(fallbackPhysicsCh4Json as any[]),
  ...(fallbackPhysicsCh5Json as any[]),
  ...(fallbackPhysicsCh6Json as any[]),
  ...(fallbackPhysicsCh7Json as any[]),
  ...(fallbackPhysicsCh8Json as any[]),
  ...(fallbackPhysicsCh9Json as any[]),
  ...(fallbackPhysicsCh10Json as any[]),
  ...(fallbackPhysicsCh11Json as any[]),
  ...(fallbackPhysicsCh12Json as any[]),
  ...(fallbackPhysicsCh13Json as any[]),
  ...(fallbackPhysicsCh14Json as any[]),
  ...(fallbackPhysicsCh15Json as any[]),
  ...(fallbackPhysicsCh16Json as any[]),
  ...(fallbackPhysicsCh17Json as any[]),
  ...(fallbackPhysicsCh18Json as any[]),
  ...(fallbackPhysicsCh19Json as any[]),
  ...(fallbackPhysicsCh20Json as any[]),
  ...(fallbackPhysicsCh21Json as any[]),
  ...(fallbackPhysicsCh22Json as any[]),
  ...(fallbackPhysicsCh23Json as any[]),
  ...(fallbackChemJson as any[]),
  ...(fallbackChemCh2Json as any[]),
  ...(fallbackChemCh3Json as any[]),
  ...(fallbackChemCh4Json as any[]),
  ...(fallbackChemCh5Json as any[]),
  ...(fallbackChemCh6Json as any[]),
  ...(fallbackChemCh7Json as any[]),
  ...(fallbackChemCh8Json as any[]),
  ...(fallbackChemCh9Json as any[]),
  ...(fallbackChemCh10Json as any[]),
  ...(fallbackChemCh11Json as any[]),
  ...(fallbackChemCh12Json as any[]),
  ...(fallbackChemCh13Json as any[]),
  ...(fallbackChemCh14Json as any[]),
  ...(fallbackChemCh15Json as any[]),
  ...(fallbackChemCh16Json as any[]),
  ...(fallbackChemCh17Json as any[]),
  ...(fallbackChemCh18Json as any[]),
  ...(fallbackChemCh19Json as any[]),
  ...(fallbackMathJson as any[]),
  ...(fallbackMathCh2Json as any[]),
  ...(fallbackMathCh3Json as any[]),
  ...(fallbackMathCh4Json as any[]),
  ...(fallbackMathCh6Json as any[]),
  ...(fallbackMathCh7Json as any[]),
  ...(fallbackMathCh8Json as any[]),
  ...(fallbackMathCh9Json as any[]),
  ...(fallbackMathCh10Json as any[]),
  ...(fallbackMathCh11Json as any[]),
  ...(fallbackMathCh12Json as any[]),
  ...(fallbackMathCh13Json as any[]),
  ...(fallbackMathCh14Json as any[]),
  ...(fallbackMathCh15Json as any[]),
  ...(fallbackMathCh16Json as any[]),
  ...(fallbackMathCh17Json as any[]),
  ...(fallbackMathCh18Json as any[]),
  ...(fallbackMathCh19Json as any[])
]

const FALLBACK_QUESTIONS: PYQQuestion[] = allFallbackRaw.map((q, idx) => ({
  id: `fallback-${q.subject || 'Physics'}-${idx}`,
  chapter: q.chapter,
  chapterNumber: q.chapter_number,
  question: q.question,
  options: q.options,
  correct: q.correct_answer,
  year: q.year,
  explanation: q.explanation || "",
  subject: q.subject || "Physics",
  needs_image: q.needs_image || false,
  image_url: q.image_url || "",
  explanation_image_url: q.explanation_image_url || "",
  option_images: q.option_images || []
}))

const questionKey = (q: PYQQuestion) =>
  `${q.subject || "Physics"}|${q.chapterNumber}|${q.year}|${q.question.trim().replace(/\s+/g, " ").slice(0, 180)}`;

function mergeQuestions(databaseQuestions: PYQQuestion[]) {
  const merged = new Map<string, PYQQuestion>();
  FALLBACK_QUESTIONS.forEach((question) => merged.set(questionKey(question), question));
  databaseQuestions.forEach((question) => merged.set(questionKey(question), question));
  return [...merged.values()];
}

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
    explanation_image_url: q.explanation_image_url,
    option_images: q.option_images,
  };
}

async function getQuestionPool(): Promise<PYQQuestion[]> {
  try {
    const { data, error } = await supabase.from('pyq_questions' as any).select('*');
    if (!error && data) return mergeQuestions(data.map(mapDbRow));
  } catch (err) {
    console.warn("Supabase question fetch failed, using bundled questions:", err);
  }
  return FALLBACK_QUESTIONS;
}

export async function getQuestionsByChapter(subject: string, chapterNumber: number): Promise<PYQQuestion[]> {
  const pool = await getQuestionPool();
  return pool.filter(q => q.subject === subject && q.chapterNumber === chapterNumber).sort((a, b) => a.year - b.year);
}

export async function getRandomQuestions(count: number, subject?: string): Promise<PYQQuestion[]> {
  const questions = await getQuestionPool();
  const pool = subject && subject !== 'All' ? questions.filter(q => q.subject === subject) : questions;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

export async function getFilteredQuestions(filters: QuestionFilters = {}): Promise<PYQQuestion[]> {
  const pool = await getQuestionPool();
  return pool.filter((question) => {
    const subjectMatches = !filters.subjects?.length || filters.subjects.includes(question.subject || "Physics");
    const chapterMatches = !filters.chapterKeys?.length || filters.chapterKeys.includes(`${question.subject}-${question.chapterNumber}`);
    const yearMatches = (!filters.startYear || question.year >= filters.startYear) && (!filters.endYear || question.year <= filters.endYear);
    return subjectMatches && chapterMatches && yearMatches;
  });
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
  return getQuestionPool();
}

// Dynamically update chapter counts
export async function loadChapterCounts(): Promise<void> {
  const counts: Record<string, number> = {};

  const questions = await getQuestionPool();
  questions.forEach(q => {
    const key = `${q.subject}-${q.chapterNumber}`;
    counts[key] = (counts[key] || 0) + 1;
  });

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
