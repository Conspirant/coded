import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(Boolean).map(line => {
  const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1).trim()];
}));
const url = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Missing Supabase credentials');
const supabase = createClient(url, key);
const dir = path.resolve('src/data');
const files = fs.readdirSync(dir).filter(f => /^pyq_(physics|chemistry|maths)_ch\d+\.json$/.test(f));

for (const file of files) {
  const questions = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  if (!Array.isArray(questions) || !questions.length) continue;
  const first = questions[0];
  const subject = first.subject === 'Mathematics' ? 'Mathematics' : first.subject;
  const chapterNumber = first.chapter_number;
  const rows = questions.map(q => ({
    subject, chapter: q.chapter, chapter_number: q.chapter_number, year: q.year,
    question: q.question, options: q.options, correct_answer: q.correct_answer,
    explanation: q.explanation || '', needs_image: !!q.needs_image,
    image_url: q.image_url || null
  }));
  const { error: delError } = await supabase.from('pyq_questions').delete().eq('subject', subject).eq('chapter_number', chapterNumber);
  if (delError) throw new Error(`${file}: delete failed: ${delError.message}`);
  for (let i = 0; i < rows.length; i += 50) {
    const { error } = await supabase.from('pyq_questions').insert(rows.slice(i, i + 50));
    if (error) throw new Error(`${file}: insert failed: ${error.message}`);
  }
  console.log(`Seeded ${subject} chapter ${chapterNumber}: ${rows.length}`);
}
