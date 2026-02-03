#!/usr/bin/env node
/**
 * PDF Page Index Generator
 * 
 * Parses KCET cutoff PDFs to create a mapping of:
 * - Year + Round + Institute Code → Page Number
 * 
 * This index is used by the frontend to open PDFs at the exact page.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdf from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * PDF files to process with their metadata
 */
const PDF_FILES = [
    { file: 'kcet-2023-round1-cutoffs.pdf', year: '2023', round: 'R1' },
    { file: 'kcet-2023-round2-cutoffs.pdf', year: '2023', round: 'R2' },
    { file: 'kcet-2023-round3(extended)-cutoffs.pdf', year: '2023', round: 'EXT' },
    { file: 'kcet-2024-mock-round1-cutoffs.pdf', year: '2024', round: 'MOCK' },
    { file: 'kcet-2024-round1-cutoffs.pdf', year: '2024', round: 'R1' },
    { file: 'kcet-2024-round2-cutoffs.pdf', year: '2024', round: 'R2' },
    { file: 'kcet-2024-round3(extended)-cutoffs.pdf', year: '2024', round: 'EXT' },
    { file: 'kcet-2025-mock-round1-cutoffs.pdf', year: '2025', round: 'MOCK' },
    { file: 'kcet-2025-round1-cutoffs.pdf', year: '2025', round: 'R1' },
    { file: 'kcet-2025-round2-cutoffs.pdf', year: '2025', round: 'R2' },
    { file: 'kcet-2025-round3-cutoffs.pdf', year: '2025', round: 'R3' },
];

/**
 * Find institute codes in page text (E001-E999 pattern)
 */
function findInstituteCodes(text) {
    const matches = text.match(/\bE\d{3}\b/g);
    if (!matches) return [];
    // Return unique codes
    return [...new Set(matches)];
}

/**
 * Custom page render function to extract page-by-page text
 */
function renderPage(pageData) {
    return pageData.getTextContent().then(function (textContent) {
        let text = '';
        for (let item of textContent.items) {
            text += item.str + ' ';
        }
        return text;
    });
}

/**
 * Process a single PDF file using page-by-page extraction
 */
async function processPdfFile(pdfPath, year, round) {
    const filename = path.basename(pdfPath);
    console.log(`\n📄 Processing: ${filename}`);

    const pageIndex = {};

    try {
        const dataBuffer = fs.readFileSync(pdfPath);

        // Custom options to get page-level data
        const options = {
            pagerender: renderPage
        };

        const data = await pdf(dataBuffer, options);

        console.log(`   📑 Total pages: ${data.numpages}`);

        // pdf-parse joins pages with form feed, split them
        const pages = data.text.split('\n\n');
        let processedCodes = 0;

        // Also search full text with page estimation
        // Each page is roughly similar in length, so we can estimate
        const fullText = data.text;
        const avgPageLength = fullText.length / data.numpages;

        // Find all E-codes and their approximate positions
        const codeRegex = /E\d{3}/g;
        let match;
        while ((match = codeRegex.exec(fullText)) !== null) {
            const code = match[0];
            const position = match.index;
            const estimatedPage = Math.floor(position / avgPageLength) + 1;

            if (!pageIndex[code]) {
                pageIndex[code] = Math.min(estimatedPage, data.numpages);
                processedCodes++;
            }
        }

        console.log(`   ✅ Found ${Object.keys(pageIndex).length} unique institute codes`);

        return pageIndex;

    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return {};
    }
}

/**
 * Main function
 */
async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║           PDF PAGE INDEX GENERATOR                               ║');
    console.log('║     Creates institute-to-page mapping for all cutoff PDFs        ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log();

    const fullIndex = {};
    let totalMappings = 0;

    for (const pdfInfo of PDF_FILES) {
        const pdfPath = path.join(rootDir, pdfInfo.file);

        if (!fs.existsSync(pdfPath)) {
            console.log(`\n⚠️ Skipping (not found): ${pdfInfo.file}`);
            continue;
        }

        const pageIndex = await processPdfFile(pdfPath, pdfInfo.year, pdfInfo.round);

        // Create unique key for this PDF
        const pdfKey = `${pdfInfo.year}-${pdfInfo.round}`;
        fullIndex[pdfKey] = pageIndex;
        totalMappings += Object.keys(pageIndex).length;
    }

    // Save the index
    const outputPath = path.join(rootDir, 'public', 'data', 'pdf-page-index.json');

    // Ensure directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputData = {
        metadata: {
            generated_at: new Date().toISOString(),
            description: 'Institute code to PDF page number mapping',
            total_mappings: totalMappings
        },
        index: fullIndex
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                    INDEX GENERATION COMPLETE                     ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log();
    console.log(`📊 Total mappings: ${totalMappings}`);
    console.log(`💾 Saved to: ${outputPath}`);
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
