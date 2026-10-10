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
  const ch23Data = JSON.parse(fs.readFileSync('src/data/pyq_physics_ch23.json', 'utf-8'));
  console.log(`Loaded ${ch23Data.length} Physics Chapter 23 questions.`);

  const dbRows = ch23Data.map(q => ({
    subject: q.subject,
    chapter: q.chapter,
    chapter_number: 23,
    year: q.year,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    needs_image: q.needs_image || false,
    image_url: q.image_url || null
  }));

  console.log('Clearing old Physics Chapter 23 questions from Supabase...');
  await supabase.from('pyq_questions').delete().eq('subject', 'Physics').eq('chapter_number', 23);

  console.log('Inserting 72 verified Physics Chapter 23 questions...');
  for (let i = 0; i < dbRows.length; i += 50) {
    const chunk = dbRows.slice(i, i + 50);
    const { data: inserted, error: insErr } = await supabase.from('pyq_questions').insert(chunk).select();
    if (insErr) {
      console.error('Insert error:', insErr);
      process.exit(1);
    }
    console.log(`Inserted chunk of ${inserted.length} questions.`);
  }

  console.log(`Successfully seeded all Physics Chapter 23 questions into Supabase!`);
}

main().catch(console.error);
