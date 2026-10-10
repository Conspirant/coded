import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

let SUPABASE_URL = process.env.VITE_SUPABASE_URL;
let SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  if (fs.existsSync('.env')) {
    const envText = fs.readFileSync('.env', 'utf-8');
    for (const line of envText.split('\n')) {
      const [k, ...v] = line.trim().split('=');
      if (k === 'VITE_SUPABASE_URL') SUPABASE_URL = v.join('=').trim();
      if (k === 'VITE_SUPABASE_ANON_KEY') SUPABASE_KEY = v.join('=').trim();
    }
  }
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_DIR = path.resolve('src/data');

// Chapters to reseed (all chapters with image fixes or all existing verified chapters)
const TARGET_FILES = [
  // Chemistry
  'pyq_chemistry_ch5.json',
  'pyq_chemistry_ch8.json',
  'pyq_chemistry_ch9.json',
  'pyq_chemistry_ch15.json',
  'pyq_chemistry_ch16.json',
  'pyq_chemistry_ch17.json',
  'pyq_chemistry_ch18.json',
  // Maths
  'pyq_maths_ch3.json',
  'pyq_maths_ch10.json',
  // Physics
  'pyq_physics_ch4.json',
  'pyq_physics_ch6.json',
  'pyq_physics_ch7.json',
  'pyq_physics_ch9.json',
  'pyq_physics_ch10.json',
  'pyq_physics_ch11.json',
  'pyq_physics_ch13.json',
  'pyq_physics_ch14.json',
  'pyq_physics_ch15.json',
  'pyq_physics_ch16.json',
  'pyq_physics_ch17.json',
  'pyq_physics_ch18.json',
  'pyq_physics_ch20.json',
  'pyq_physics_ch21.json',
  'pyq_physics_ch22.json'
];

async function reseedFile(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${fileName}: file not found.`);
    return;
  }
  
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const questions = Array.isArray(raw) ? raw : (raw.questions || []);
  if (questions.length === 0) return;

  const subject = questions[0].subject;
  const chapterNumber = questions[0].chapter_number;

  const dbRows = questions.map(q => ({
    subject: q.subject,
    chapter: q.chapter,
    chapter_number: q.chapter_number,
    year: q.year || 2024,
    question: q.question,
    options: q.options,
    correct_answer: typeof q.correct_answer === 'number' ? q.correct_answer : (typeof q.correct === 'number' ? q.correct : 0),
    explanation: q.explanation || q.solution || '',
    needs_image: q.needs_image || false,
    image_url: q.image_url || null
  }));

  // Delete old rows
  const { error: delErr } = await supabase
    .from('pyq_questions')
    .delete()
    .eq('subject', subject)
    .eq('chapter_number', chapterNumber);

  if (delErr) {
    console.error(`Error deleting ${subject} Ch ${chapterNumber}:`, delErr);
    return;
  }

  // Insert in batches of 50
  for (let i = 0; i < dbRows.length; i += 50) {
    const chunk = dbRows.slice(i, i + 50);
    const { error: insErr } = await supabase.from('pyq_questions').insert(chunk);
    if (insErr) {
      console.error(`Error inserting chunk for ${subject} Ch ${chapterNumber}:`, insErr);
      return;
    }
  }

  console.log(`✓ Reseeded ${subject} Ch ${chapterNumber} (${dbRows.length} questions)`);
}

async function main() {
  console.log(`Starting reseed for ${TARGET_FILES.length} cleaned chapters...`);
  for (const f of TARGET_FILES) {
    await reseedFile(f);
  }
  
  const { count } = await supabase.from('pyq_questions').select('*', { count: 'exact', head: true });
  console.log(`\nReseed complete! Total rows in Supabase pyq_questions: ${count}`);
}

main().catch(console.error);
