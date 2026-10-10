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

async function verifyAll() {
  console.log('=== Checking Local Offline JSON Fallbacks ===');
  const targets = [
    { file: 'pyq_physics_ch3.json', subject: 'Physics', ch: 3, expected: 21 },
    { file: 'pyq_physics_ch4.json', subject: 'Physics', ch: 4, expected: 29 },
    { file: 'pyq_physics_ch5.json', subject: 'Physics', ch: 5, expected: 20 },
    { file: 'pyq_physics_ch6.json', subject: 'Physics', ch: 6, expected: 15 },
    { file: 'pyq_physics_ch7.json', subject: 'Physics', ch: 7, expected: 18 },
    { file: 'pyq_physics_ch8.json', subject: 'Physics', ch: 8, expected: 10 },
    { file: 'pyq_physics_ch9.json', subject: 'Physics', ch: 9, expected: 23 },
    { file: 'pyq_physics_ch10.json', subject: 'Physics', ch: 10, expected: 28 },
    { file: 'pyq_physics_ch11.json', subject: 'Physics', ch: 11, expected: 23 },
    { file: 'pyq_physics_ch12.json', subject: 'Physics', ch: 12, expected: 13 },
    { file: 'pyq_physics_ch13.json', subject: 'Physics', ch: 13, expected: 13 },
    { file: 'pyq_physics_ch14.json', subject: 'Physics', ch: 14, expected: 31 },
    { file: 'pyq_physics_ch15.json', subject: 'Physics', ch: 15, expected: 48 },
    { file: 'pyq_physics_ch16.json', subject: 'Physics', ch: 16, expected: 63 },
    { file: 'pyq_physics_ch17.json', subject: 'Physics', ch: 17, expected: 80 },
    { file: 'pyq_physics_ch18.json', subject: 'Physics', ch: 18, expected: 75 },
    { file: 'pyq_physics_ch19.json', subject: 'Physics', ch: 19, expected: 7 },
    { file: 'pyq_physics_ch20.json', subject: 'Physics', ch: 20, expected: 28 },
    { file: 'pyq_physics_ch21.json', subject: 'Physics', ch: 21, expected: 52 },
    { file: 'pyq_physics_ch22.json', subject: 'Physics', ch: 22, expected: 16 },
    { file: 'pyq_physics_ch23.json', subject: 'Physics', ch: 23, expected: 76 },
    { file: 'pyq_chemistry_ch2.json', subject: 'Chemistry', ch: 2, expected: 27 },
    { file: 'pyq_chemistry_ch3.json', subject: 'Chemistry', ch: 3, expected: 23 },
    { file: 'pyq_chemistry_ch4.json', subject: 'Chemistry', ch: 4, expected: 47 },
    { file: 'pyq_chemistry_ch5.json', subject: 'Chemistry', ch: 5, expected: 33 },
    { file: 'pyq_chemistry_ch6.json', subject: 'Chemistry', ch: 6, expected: 49 },
    { file: 'pyq_chemistry_ch7.json', subject: 'Chemistry', ch: 7, expected: 16 },
    { file: 'pyq_chemistry_ch8.json', subject: 'Chemistry', ch: 8, expected: 40 },
    { file: 'pyq_chemistry_ch9.json', subject: 'Chemistry', ch: 9, expected: 38 },
    { file: 'pyq_chemistry_ch10.json', subject: 'Chemistry', ch: 10, expected: 48 },
    { file: 'pyq_chemistry_ch11.json', subject: 'Chemistry', ch: 11, expected: 47 },
    { file: 'pyq_chemistry_ch12.json', subject: 'Chemistry', ch: 12, expected: 50 },
    { file: 'pyq_chemistry_ch13.json', subject: 'Chemistry', ch: 13, expected: 55 },
    { file: 'pyq_chemistry_ch14.json', subject: 'Chemistry', ch: 14, expected: 49 },
    { file: 'pyq_chemistry_ch15.json', subject: 'Chemistry', ch: 15, expected: 46 },
    { file: 'pyq_chemistry_ch16.json', subject: 'Chemistry', ch: 16, expected: 48 },
    { file: 'pyq_chemistry_ch17.json', subject: 'Chemistry', ch: 17, expected: 65 },
    { file: 'pyq_chemistry_ch18.json', subject: 'Chemistry', ch: 18, expected: 40 },
    { file: 'pyq_chemistry_ch19.json', subject: 'Chemistry', ch: 19, expected: 47 },
    { file: 'pyq_maths_ch2.json', subject: 'Mathematics', ch: 2, expected: 55 },
    { file: 'pyq_maths_ch3.json', subject: 'Mathematics', ch: 3, expected: 66 },
    { file: 'pyq_maths_ch4.json', subject: 'Mathematics', ch: 4, expected: 20 },
    { file: 'pyq_maths_ch6.json', subject: 'Mathematics', ch: 6, expected: 13 },
    { file: 'pyq_maths_ch7.json', subject: 'Mathematics', ch: 7, expected: 19 },
    { file: 'pyq_maths_ch8.json', subject: 'Mathematics', ch: 8, expected: 8 },
    { file: 'pyq_maths_ch9.json', subject: 'Mathematics', ch: 9, expected: 24 },
    { file: 'pyq_maths_ch10.json', subject: 'Mathematics', ch: 10, expected: 35 },
    { file: 'pyq_maths_ch11.json', subject: 'Mathematics', ch: 11, expected: 7 },
    { file: 'pyq_maths_ch12.json', subject: 'Mathematics', ch: 12, expected: 32 },
    { file: 'pyq_maths_ch13.json', subject: 'Mathematics', ch: 13, expected: 106 },
    { file: 'pyq_maths_ch14.json', subject: 'Mathematics', ch: 14, expected: 29 },
    { file: 'pyq_maths_ch15.json', subject: 'Mathematics', ch: 15, expected: 101 },
    { file: 'pyq_maths_ch16.json', subject: 'Mathematics', ch: 16, expected: 47 },
    { file: 'pyq_maths_ch17.json', subject: 'Mathematics', ch: 17, expected: 100 },
    { file: 'pyq_maths_ch18.json', subject: 'Mathematics', ch: 18, expected: 39 },
    { file: 'pyq_maths_ch19.json', subject: 'Mathematics', ch: 19, expected: 57 }
  ];

  for (const t of targets) {
    const d = JSON.parse(fs.readFileSync('src/data/' + t.file, 'utf8'));
    const ok = d.length === t.expected ? '✅ MATCH' : '❌ MISMATCH';
    console.log(`Local ${t.file.padEnd(25)}: ${d.length} questions (Expected: ${t.expected}) ${ok}`);
  }

  console.log('\n=== Checking Live Supabase Database ===');
  for (const t of targets) {
    const { count, error } = await supabase
      .from('pyq_questions')
      .select('*', { count: 'exact', head: true })
      .eq('subject', t.subject)
      .eq('chapter_number', t.ch);
    
    if (error) {
      console.error(`Error checking ${t.subject} Ch ${t.ch}:`, error);
      continue;
    }
    const ok = count === t.expected ? '✅ MATCH' : '❌ MISMATCH';
    const key = `${t.subject} Ch ${t.ch}`;
    console.log(`Supabase ${key.padEnd(22)}: ${count} questions (Expected: ${t.expected}) ${ok}`);
  }
}

verifyAll();
