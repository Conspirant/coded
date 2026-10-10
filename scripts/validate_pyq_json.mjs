import fs from 'fs';
import katex from 'katex';

const questions = JSON.parse(fs.readFileSync('src/data/pyq_physics_ch1_ch2.json', 'utf-8'));

let fixedCount = 0;

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  
  // Check dollar signs count in explanation, question, options
  const fields = ['question', 'explanation'];
  fields.forEach(f => {
    if (q[f]) {
      const dollarCount = (q[f].match(/\$/g) || []).length;
      if (dollarCount % 2 !== 0) {
        console.warn(`[Odd dollars] Q${i+1} (${q.year}) ${f}: "${q[f]}"`);
      }
    }
  });

  q.options.forEach((opt, oIdx) => {
    const dollarCount = (opt.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      console.warn(`[Odd dollars in Option ${oIdx}] Q${i+1} (${q.year}): "${opt}"`);
    }
  });
}

console.log(`Validated ${questions.length} questions.`);
