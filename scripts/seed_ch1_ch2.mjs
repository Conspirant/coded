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

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const data = JSON.parse(fs.readFileSync('src/data/pyq_physics_ch1_ch2.json', 'utf-8'));
  console.log(`Loaded ${data.length} verified questions for Chapter 1 & 2.`);

  // Clear existing unverified questions for chapters 1 and 2 to ensure clean state
  console.log('Cleaning existing unverified questions for Physics Chapter 1 & 2...');
  await supabase.from('pyq_questions').delete().eq('subject', 'Physics').in('chapter_number', [1, 2]);

  // Insert the fresh verified questions
  console.log('Inserting verified questions with years, explanations and diagrams...');
  const { data: inserted, error } = await supabase.from('pyq_questions').insert(data).select();

  if (error) {
    console.error('Error inserting questions:', error);
  } else {
    console.log(`Successfully seeded ${inserted ? inserted.length : data.length} questions to Supabase!`);
  }
}

main().catch(console.error);
