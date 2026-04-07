import { readFileSync, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load environment variables (.env) manually
const envFile = readFileSync('.env', 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) process.env[key.trim()] = value.join('=').trim();
});

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const NVIDIA_KEY = process.env.NVIDIA_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !NVIDIA_KEY) {
  console.error("Missing environment variables. Make sure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and NVIDIA_API_KEY are set in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Nvidia's highly capable Nemotron model
const MODEL = "meta/llama-3.1-405b-instruct"; 

/**
 * Sends a block of text to Nvidia NIM and asks for a strict JSON array of questions back.
 */
async function extractQuestionsWithAI(textChunk, subject, chapterNumber, chapterName) {
  const prompt = `
You are an expert exam parser. I am giving you raw OCR text from a KCET Previous Year Question paper.
Parse the text and extract all the multiple-choice questions you can find.

Include the year if it is mentioned (e.g. "(2015)"). If not found, use 2024.
Ensure every option is extracted cleanly. Use this exact JSON format:
[
  {
    "question": "The physical quantity having...",
    "options": ["resistance", "resistivity", "electrical conductivity", "electromotive force"],
    "correct_answer": 0, // 0-3 index if known, otherwise 0
    "year": 2006,
    "explanation": "",
    "needs_image": false // set to true if the question refers to a diagram or graph
  }
]

Return ONLY valid JSON. No markdown backticks, no extra text.

Raw Text:
${textChunk}
`;

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NVIDIA_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const rawRes = await response.json();
  let content = rawRes.choices?.[0]?.message?.content || "[]";
  
  // Clean up markdown code blocks if the LLM accidentally added them
  content = content.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();

  try {
    const parsed = JSON.parse(content);
    return parsed.map(q => ({
      ...q,
      subject,
      chapter_number: chapterNumber,
      chapter: chapterName
    }));
  } catch (err) {
    console.error("Failed to parse LLM response into JSON. Response was:\n", content);
    return [];
  }
}

async function main() {
  // 1. You would load your raw OCR text here. 
  // Let's assume you have a file with the raw text for a specific chapter.
  // For demonstration, you would replace this with actual text chunking logic.
  
  // const rawOcrData = JSON.parse(readFileSync('scripts/pyq_ocr_output/all_pages_raw.json', 'utf8'));
  // let entireText = "";
  // for (let page in rawOcrData) entireText += rawOcrData[page].text + "\n";
  
  // Here is a manual mock text chunk just to test the script:
  const textChunk = `
1. The physical quantity having the dimensions [M-1L-3T3A2] is
(a) resistance
(c) electrical conductivity (d) electromotive force.
(b) resistivity
(2006)
  `;

  console.log("Sending text to LLM for extraction...");
  const questionsToInsert = await extractQuestionsWithAI(textChunk, "Physics", 1, "Units and Measurements");

  if (questionsToInsert.length === 0) {
    console.log("No questions extracted.");
    return;
  }

  console.log(`Extracted ${questionsToInsert.length} questions! Inserting into Supabase...`);
  
  const { data, error } = await supabase.from('pyq_questions').insert(questionsToInsert).select();
  
  if (error) {
    console.error("Error inserting to Supabase:", error.message);
  } else {
    console.log("Successfully inserted questions!", data.map(d => d.id));
  }
}

main();
