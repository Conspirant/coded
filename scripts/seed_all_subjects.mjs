import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env if not loaded
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
  const chemData = JSON.parse(fs.readFileSync('src/data/pyq_chemistry_ch1.json', 'utf-8'));
  const mathData = JSON.parse(fs.readFileSync('src/data/pyq_maths_ch1.json', 'utf-8'));

  console.log(`Seeding Chemistry Ch 1 (${chemData.length} questions)...`);
  await supabase.from('pyq_questions').delete().eq('subject', 'Chemistry').eq('chapter_number', 1);
  const { error: errChem } = await supabase.from('pyq_questions').insert(chemData);
  if (errChem) console.error('Chem seed error:', errChem);
  else console.log('Successfully seeded Chemistry Ch 1!');

  console.log(`Seeding Mathematics Ch 1 (${mathData.length} questions)...`);
  await supabase.from('pyq_questions').delete().eq('subject', 'Mathematics').eq('chapter_number', 1);
  const { error: errMath } = await supabase.from('pyq_questions').insert(mathData);
  if (errMath) console.error('Math seed error:', errMath);
  else console.log('Successfully seeded Mathematics Ch 1!');
}

main().catch(console.error);
