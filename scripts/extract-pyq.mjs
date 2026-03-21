/**
 * Extract text from KCET PYQ PDF using pdfjs-dist
 * Test on first 10 pages to gauge extraction quality
 */
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Use dynamic import for pdfjs-dist
async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  
  const pdfPath = join(rootDir, 'KCET Chapterwise PYQ 2006-24(latest).pdf');
  const data = new Uint8Array(readFileSync(pdfPath));
  
  console.log('Loading PDF...');
  const doc = await pdfjsLib.getDocument({ data }).promise;
  console.log(`Total pages: ${doc.numPages}`);
  
  // Extract text from pages 3-12 (first few chapter pages based on screenshots)
  const output = [];
  const pagesToExtract = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  for (const pageNum of pagesToExtract) {
    if (pageNum > doc.numPages) break;
    
    console.log(`Extracting page ${pageNum}...`);
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Get text items sorted by position (top to bottom, left to right)
    const items = textContent.items
      .filter(item => item.str && item.str.trim())
      .map(item => ({
        text: item.str,
        x: Math.round(item.transform[4]),
        y: Math.round(item.transform[5]),
        width: item.width,
        height: item.height
      }));
    
    // Sort by y (descending for top-to-bottom), then x
    items.sort((a, b) => {
      const yDiff = b.y - a.y;
      if (Math.abs(yDiff) > 5) return yDiff;
      return a.x - b.x;
    });
    
    output.push(`\n${'='.repeat(80)}`);
    output.push(`PAGE ${pageNum}`);
    output.push(`${'='.repeat(80)}`);
    
    let lastY = null;
    let currentLine = '';
    
    for (const item of items) {
      if (lastY !== null && Math.abs(item.y - lastY) > 5) {
        if (currentLine.trim()) output.push(currentLine.trim());
        currentLine = item.text;
      } else {
        currentLine += ' ' + item.text;
      }
      lastY = item.y;
    }
    if (currentLine.trim()) output.push(currentLine.trim());
  }
  
  const outputPath = join(rootDir, 'scripts', 'pyq_extraction_test.txt');
  writeFileSync(outputPath, output.join('\n'), 'utf-8');
  console.log(`\nSaved to ${outputPath}`);
}

main().catch(console.error);
