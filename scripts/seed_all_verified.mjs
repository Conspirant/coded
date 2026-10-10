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

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  // 1. Chemistry Chapter 1
  const chemData = JSON.parse(fs.readFileSync('src/data/pyq_chemistry_ch1.json', 'utf-8'));
  console.log(`Loaded ${chemData.length} Chemistry Chapter 1 questions.`);
  
  console.log('Clearing old Chemistry Chapter 1 questions from Supabase...');
  await supabase.from('pyq_questions').delete().eq('subject', 'Chemistry').eq('chapter_number', 1);

  console.log('Inserting complete Chemistry Chapter 1 questions...');
  const { data: insertedChem, error: errChem } = await supabase.from('pyq_questions').insert(chemData).select();
  if (errChem) {
    console.error('Error inserting Chemistry:', errChem);
  } else {
    console.log(`Successfully inserted ${insertedChem.length} Chemistry questions!`);
  }

  // 2. Mathematics Chapter 1
  const mathData = JSON.parse(fs.readFileSync('src/data/pyq_maths_ch1.json', 'utf-8'));
  console.log(`Loaded ${mathData.length} Mathematics Chapter 1 questions.`);

  console.log('Clearing old Mathematics Chapter 1 questions from Supabase...');
  await supabase.from('pyq_questions').delete().eq('subject', 'Mathematics').eq('chapter_number', 1);

  console.log('Inserting verified Mathematics Chapter 1 questions...');
  const { data: insertedMath, error: errMath } = await supabase.from('pyq_questions').insert(mathData).select();
  if (errMath) {
    console.error('Error inserting Mathematics:', errMath);
  } else {
    console.log(`Successfully inserted ${insertedMath.length} Mathematics questions!`);
  }

  // 3. Check final total count in DB
  const { count, error: countErr } = await supabase.from('pyq_questions').select('*', { count: 'exact', head: true });
  console.log(`Total rows currently in Supabase pyq_questions: ${count}`);
}

main().catch(console.error);
