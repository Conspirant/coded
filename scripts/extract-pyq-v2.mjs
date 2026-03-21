/**
 * Attempt text extraction using pdf-parse library
 */
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

async function main() {
  const pdfPath = join(rootDir, 'KCET Chapterwise PYQ 2006-24(latest).pdf');
  console.log('Loading PDF...');
  const dataBuffer = readFileSync(pdfPath);

  // Only parse first 15 pages to test
  const options = {
    max: 15, // max pages to parse
  };

  const data = await pdf(dataBuffer, options);
  console.log(`Pages parsed: ${data.numpages}`);
  console.log(`Text length: ${data.text.length}`);
  console.log('\n--- First 5000 chars ---\n');
  console.log(data.text.substring(0, 5000));

  writeFileSync(join(rootDir, 'scripts', 'pyq_pdfparse_test.txt'), data.text, 'utf-8');
  console.log('\nFull text saved to pyq_pdfparse_test.txt');
}

main().catch(console.error);
