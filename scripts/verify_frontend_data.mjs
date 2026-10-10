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

async function testFrontend() {
  console.log("--- Testing Supabase Chapter Counts ---");
  
  // 1. Chemistry Chapter 1
  const { data: chem1, error: errChem } = await supabase.from('pyq_questions')
    .select('id, question, year, options')
    .eq('subject', 'Chemistry')
    .eq('chapter_number', 1);
  console.log(`Chemistry Chapter 1 total in DB: ${chem1 ? chem1.length : 0} (Expected: 46)`);
  if (chem1 && chem1.length > 0) {
    console.log(`Sample Chem Q1: ${chem1[0].question.substring(0, 80)}...`);
  }

  // 2. Mathematics Chapter 1
  const { data: math1, error: errMath } = await supabase.from('pyq_questions')
    .select('id, question, year, options')
    .eq('subject', 'Mathematics')
    .eq('chapter_number', 1);
  console.log(`Mathematics Chapter 1 total in DB: ${math1 ? math1.length : 0} (Expected: 5)`);
  if (math1 && math1.length > 0) {
    console.log(`Sample Math Q1: ${math1[0].question.substring(0, 80)}...`);
  }

  // 3. Physics Chapter 1 & 2
  const { data: phys1 } = await supabase.from('pyq_questions')
    .select('id')
    .eq('subject', 'Physics')
    .eq('chapter_number', 1);
  const { data: phys2 } = await supabase.from('pyq_questions')
    .select('id')
    .eq('subject', 'Physics')
    .eq('chapter_number', 2);
  console.log(`Physics Chapter 1 total in DB: ${phys1 ? phys1.length : 0} (Expected: 17)`);
  console.log(`Physics Chapter 2 total in DB: ${phys2 ? phys2.length : 0} (Expected: 12)`);
}

testFrontend().catch(console.error);
