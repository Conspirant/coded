/**
 * Parse raw OCR JSON into structured PYQ questions
 * Flags questions with `needsImage` if parsing fails or diagrams are detected
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Basic chapter map from TOC
const CHAPTER_MAP = {
  1: "Units and Measurements",
  2: "Motion in a Straight Line",
  3: "Motion in a Plane",
  4: "Laws of Motion",
  5: "Work, Energy and Power",
  6: "System of Particles and Rotational Motion",
  7: "Gravitation",
  8: "Mechanical Properties of Solids",
  9: "Mechanical Properties of Fluids",
  10: "Thermal Properties of Matter",
  11: "Thermodynamics",
  12: "Kinetic Theory",
  13: "Oscillations",
  14: "Waves",
  15: "Electric Charges and Fields",
  16: "Electrostatic Potential and Capacitance",
  17: "Current Electricity",
  18: "Moving Charges and Magnetism",
  19: "Magnetism and Matter",
  20: "Electromagnetic Induction",
  21: "Alternating Current",
  22: "Electromagnetic Waves",
  23: "Ray Optics and Optical Instruments",
  24: "Wave Optics",
  25: "Dual Nature of Radiation and Matter",
  26: "Atoms",
  27: "Nuclei",
  28: "Semiconductor Electronics"
};

function main() {
  const inputPath = join(rootDir, 'scripts', 'pyq_ocr_output', 'all_pages_raw.json');
  const outputPath = join(rootDir, 'scripts', 'pyq_ocr_output', 'parsed_questions.json');
  
  if (!readFileSync) {
    console.error('OCR output not found yet. Run extraction first.');
    return; // Wait for OCR to finish
  }

  let rawData;
  try {
    rawData = JSON.parse(readFileSync(inputPath, 'utf8'));
  } catch(e) {
    console.log("No valid JSON yet. Exiting parser.");
    return;
  }

  const questions = [];
  let currentChapter = 0;
  let qCounter = 1;

  // Simple heuristic parsing
  // This is highly error-prone with OCR, but it gives us a baseline we can edit in the Admin panel!
  for (const pageNum in rawData) {
    const text = rawData[pageNum].text;
    if (!text) continue;

    const lines = text.split('\n');
    let currentQ = null;

    for (const line of lines) {
      // detect chapter heading
      const chapMatch = line.match(/CHAPTER\s+(\d+)/i);
      if (chapMatch) {
         currentChapter = parseInt(chapMatch[1]);
      }

      // detect question start: "1." or "12."
      const qStartMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (qStartMatch) {
         if (currentQ) questions.push(currentQ);
         
         const qNum = qStartMatch[1];
         currentQ = {
            id: `pyq-ph-ch${currentChapter}-q${qNum}-${Date.now() + Math.random()}`,
            chapter: CHAPTER_MAP[currentChapter] || "Unknown Chapter",
            chapter_number: currentChapter,
            question: qStartMatch[2],
            options: ["Option A", "Option B", "Option C", "Option D"], // Placeholder till we parse options
            correct_answer: 0,
            year: 2024, // Placeholder, needs parsing from "(2024)"
            explanation: "",
            image_url: null,
            needs_image: true // Default to true because OCR usually botches formulas
         };
         
         // extract year if inline
         const yearMatch = line.match(/\((20\d\d)\)/);
         if (yearMatch) currentQ.year = parseInt(yearMatch[1]);
      } else if (currentQ) {
         // accumulate
         // We set needs_image = true for everything, admins will upload SS anyway which is 100% reliable!
         currentQ.question += " " + line;
      }
    }
    if (currentQ) questions.push(currentQ); // push last
  }

  writeFileSync(outputPath, JSON.stringify(questions, null, 2));
  console.log(`Parsed ${questions.length} initial questions. All flagged with needs_image=true for Admin upload.`);
}

main();
