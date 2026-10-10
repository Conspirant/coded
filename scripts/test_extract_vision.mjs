import fs from 'fs';

// Read .env
const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
for (const line of envText.split('\n')) {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
}

const key = env.NVIDIA_API_KEY;

async function extractQuestionsFromImage(imagePath) {
  const base64Img = fs.readFileSync(imagePath).toString('base64');

  const prompt = `You are an expert exam digitizer.
Analyze this page of KCET Physics PYQs carefully.
Extract ALL questions on this page.
Also look at the ANSWER KEY at the bottom of the page and match each question's correct answer index (0 for (a), 1 for (b), 2 for (c), 3 for (d)).

Return ONLY a JSON array of objects with this schema:
[
  {
    "question_number": 1,
    "question": "The physical quantity having the dimensions [M^{-1}L^{-2}T^3A^2] is",
    "options": ["resistance", "resistivity", "electrical conductivity", "electromotive force."],
    "correct_answer": 2,
    "year": 2006,
    "needs_image": false
  }
]
Format mathematical formulas cleanly using standard LaTeX or unicode (e.g. [M^{-1}L^{-2}T^3A^2], 4.8000 \\times 10^4).
Return ONLY the raw JSON array. Do not wrap in markdown or backticks.`;

  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta/llama-3.2-11b-vision-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: 'data:image/png;base64,' + base64Img } }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1
    })
  });

  const data = await res.json();
  const rawContent = data.choices?.[0]?.message?.content || '';
  return rawContent;
}

async function main() {
  console.log('Running 90B Vision extraction on Chapter 1 (page_3_right.png)...');
  const result = await extractQuestionsFromImage('scratch/pages/page_3_right.png');
  fs.writeFileSync('scratch/ch1_extracted.txt', result, 'utf-8');
  console.log('Result written to scratch/ch1_extracted.txt!');
  console.log('Preview:', result.slice(0, 500));
}

main().catch(console.error);
