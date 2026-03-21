/**
 * Full OCR extraction pipeline for KCET PYQ PDF
 * Renders each PDF page to image using pdfjs embedded images, then OCRs with Tesseract.js
 * Outputs raw text per page to a JSON file and text file
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

async function extractPageImages(doc, pageNum, pdfjsLib) {
  const page = await doc.getPage(pageNum);
  const ops = await page.getOperatorList();

  const images = [];
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (
      ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject ||
      ops.fnArray[i] === pdfjsLib.OPS.paintJpegXObject
    ) {
      const imgName = ops.argsArray[i][0];
      try {
        const img = await page.objs.get(imgName);
        if (img && img.data) {
          if (img.width < 10 || img.height < 10) {
            // Skip tiny noise images
            // console.log(`Skipping tiny image ${img.width}x${img.height}`);
            continue;
          }

          images.push({
            name: imgName,
            width: img.width,
            height: img.height,
            data: img.data,
            kind: img.kind,
          });
        }
      } catch (e) {
        // skip
      }
    }
  }
  return images;
}

function rawToPngBuffer(imgData) {
  const { data, width, height, kind } = imgData;
  let ppmData;
  if (kind === 1) {
    const header = `P5\n${width} ${height}\n255\n`;
    const headerBuf = Buffer.from(header, 'ascii');
    const pixelBuf = Buffer.from(data);
    ppmData = Buffer.concat([headerBuf, pixelBuf]);
  } else if (kind === 2) {
    const header = `P6\n${width} ${height}\n255\n`;
    const headerBuf = Buffer.from(header, 'ascii');
    const pixelBuf = Buffer.from(data);
    ppmData = Buffer.concat([headerBuf, pixelBuf]);
  } else if (kind === 3) {
    const header = `P6\n${width} ${height}\n255\n`;
    const headerBuf = Buffer.from(header, 'ascii');
    const rgbData = Buffer.alloc(width * height * 3);
    for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
      rgbData[j] = data[i];
      rgbData[j + 1] = data[i + 1];
      rgbData[j + 2] = data[i + 2];
    }
    ppmData = Buffer.concat([headerBuf, rgbData]);
  } else {
    return null;
  }
  return ppmData;
}

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const pdfPath = join(rootDir, 'KCET Chapterwise PYQ 2006-24(latest).pdf');
  const outputDir = join(rootDir, 'scripts', 'pyq_ocr_output');
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  console.log('Loading PDF...');
  const data = new Uint8Array(readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const totalPages = doc.numPages;
  console.log(`Total pages: ${totalPages}`);

  console.log('Initializing Tesseract OCR worker...');
  const worker = await Tesseract.createWorker('eng', 1, {
    logger: () => {} 
  });

  const allPages = {};
  
  // Start the extraction loop
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    process.stdout.write(`\rProcessing page ${pageNum}/${totalPages}...`);
    try {
      const pageImages = await extractPageImages(doc, pageNum, pdfjsLib);
      let pageText = '';
      let avgConfidence = 0;
      let imgCount = 0;

      for (const img of pageImages) {
        const ppmBuf = rawToPngBuffer(img);
        if (ppmBuf) {
          const { data: ocrData } = await worker.recognize(ppmBuf);
          pageText += ocrData.text + '\n';
          avgConfidence += ocrData.confidence;
          imgCount++;
        }
      }
      
      allPages[pageNum] = {
        pageNumber: pageNum,
        text: pageText,
        confidence: imgCount > 0 ? avgConfidence / imgCount : 0,
        imagesFound: imgCount
      };

      // Periodic save
      if (pageNum % 20 === 0) {
        writeFileSync(join(outputDir, 'all_pages_raw.json'), JSON.stringify(allPages, null, 2), 'utf-8');
      }
      
      // Stop and restart worker periodically to prevent memory leaks in Tesseract WASM
      if (pageNum % 50 === 0) {
         await worker.terminate();
         await new Promise(r => setTimeout(r, 1000));
         await worker.initialize('eng');
      }

    } catch (err) {
      console.error(`\nError on page ${pageNum}: ${err.message}`);
      allPages[pageNum] = { pageNumber: pageNum, text: '', confidence: 0, error: err.message };
    }
  }

  // Final saves
  writeFileSync(join(outputDir, 'all_pages_raw.json'), JSON.stringify(allPages, null, 2), 'utf-8');

  let plainText = '';
  for (let p = 1; p <= totalPages; p++) {
    const pageData = allPages[p];
    if (pageData) {
      plainText += `\n${'='.repeat(80)}\n`;
      plainText += `PAGE ${p} (confidence: ${pageData.confidence?.toFixed(1)}%, images: ${pageData.imagesFound})\n`;
      plainText += `${'='.repeat(80)}\n`;
      plainText += pageData.text || '(empty)\n';
    }
  }
  writeFileSync(join(outputDir, 'all_pages_plain.txt'), plainText, 'utf-8');

  await worker.terminate();
  console.log(`\n\nDone! Output saved to ${outputDir}`);
}

main().catch(console.error);
