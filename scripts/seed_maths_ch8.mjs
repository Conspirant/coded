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
  const ch8Data = JSON.parse(fs.readFileSync('src/data/pyq_maths_ch8.json', 'utf-8'));
  console.log(`Loaded ${ch8Data.length} Mathematics Chapter 8 questions.`);

  const dbRows = ch8Data.map(q => ({
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

  console.log('Clearing old Mathematics Chapter 8 questions from Supabase...');
  await supabase.from('pyq_questions').delete().eq('subject', 'Mathematics').eq('chapter_number', 8);

  console.log('Inserting 8 aligned Mathematics Chapter 8 questions...');
  const { data: inserted, error: insErr } = await supabase.from('pyq_questions').insert(dbRows).select();
  if (insErr) {
    console.error('Insert error:', insErr);
    process.exit(1);
  }

  console.log(`Successfully seeded ${inserted.length} Mathematics Chapter 8 questions into Supabase!`);
}

main().catch(console.error);
