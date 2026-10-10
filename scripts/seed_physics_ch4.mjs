import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const ch4Data = JSON.parse(fs.readFileSync('src/data/pyq_physics_ch4.json', 'utf-8'));
  console.log(`Loaded ${ch4Data.length} Physics Chapter 4 questions.`);

  // Prepare rows for Supabase pyq_questions (let Supabase generate UUID id)
  const dbRows = ch4Data.map(q => ({
    subject: q.subject,
    chapter: q.chapter,
    chapter_number: q.chapter_number,
    year: q.year,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    needs_image: q.needs_image || false,
    image_url: q.image_url || ''
  }));

  console.log('Clearing old Physics Chapter 4 questions from Supabase...');
  const { error: delErr } = await supabase.from('pyq_questions').delete().eq('subject', 'Physics').eq('chapter_number', 4);
  if (delErr) {
    console.error('Delete error:', delErr);
    process.exit(1);
  }

  console.log('Inserting 29 aligned Physics Chapter 4 questions with explanation diagrams...');
  const { data: inserted, error: insErr } = await supabase.from('pyq_questions').insert(dbRows).select();
  if (insErr) {
    console.error('Insert error:', insErr);
    process.exit(1);
  }

  console.log(`Successfully seeded ${inserted.length} Physics Chapter 4 questions into Supabase!`);
}

main().catch(console.error);
