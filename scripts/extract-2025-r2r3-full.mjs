/**
 * Comprehensive PDF Extractor for KCET 2025 Round 2 and Round 3
 * Extracts ALL colleges from the PDF files
 * 
 * PDF Structure (from user screenshot):
 * - Header row: Course Name, 1G, 1K, 1R, 2AG, 2AK, 2AR, 2BG, 2BK, 2BR, 3AG, 3AK, 3AR, 3BG, 3BK, 3BR, GM, GMK, GMP, GMR, NRI, OPN, OTH, SCG, SCK, SCR, STG, STK, STR
 * - Each college has a header like "College: E001 College Name..."
 * - Then course rows with cutoff values
 */

import fs from 'fs'
import pdf from 'pdf-parse'

// Categories in order from PDF header
const CATEGORIES = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMP', 'GMR', 'NRI', 'OPN', 'OTH', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']

// Course code prefixes
const COURSE_PREFIXES = ['AD', 'AE', 'AI', 'AR', 'AT', 'AU', 'BC', 'BD', 'BE', 'BI', 'BM', 'BR', 'BS', 'BT', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CK', 'CM', 'CO', 'CP', 'CR', 'CS', 'CT', 'CV', 'CY', 'DC', 'DG', 'DM', 'DS', 'EA', 'EB', 'EC', 'EE', 'EG', 'EI', 'EL', 'EN', 'EP', 'ER', 'ES', 'ET', 'EV', 'IB', 'IC', 'IE', 'IG', 'II', 'IM', 'IO', 'IP', 'IS', 'IT', 'IY', 'LA', 'LC', 'LJ', 'MC', 'MD', 'ME', 'MK', 'MM', 'MN', 'MR', 'MS', 'MT', 'NT', 'OP', 'OT', 'PE', 'PL', 'PM', 'PT', 'RA', 'RB', 'RI', 'RM', 'RO', 'SA', 'SE', 'SS', 'ST', 'TC', 'TE', 'TX', 'UP', 'UR', 'ZC', 'B TECH', 'B.TECH', 'B.ARCH', 'M.TECH', 'BTECH']

async function extractPDF(pdfPath, year, round) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Extracting: ${pdfPath}`)
    console.log(`Year: ${year}, Round: ${round}`)
    console.log(`${'='.repeat(60)}`)

    const pdfBuffer = fs.readFileSync(pdfPath)
    const data = await pdf(pdfBuffer)

    const text = data.text
    console.log(`PDF pages: ${data.numpages}`)
    console.log(`Text length: ${text.length} chars`)

    // Split into lines
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    console.log(`Total lines: ${lines.length}`)

    const cutoffs = []
    let currentCollege = null
    let currentCollegeCode = null
    let currentCourse = null
    let collegeCount = 0
    let courseCount = 0

    // Process line by line
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Detect college header: "College: E001 Name..."
        const collegeMatch = line.match(/College:\s*(E\d{3})\s+(.+?)(?:Course Name|$)/i)
        if (collegeMatch) {
            currentCollegeCode = collegeMatch[1]
            currentCollege = collegeMatch[2].trim()
            collegeCount++
            currentCourse = null
            continue
        }

        // Alternative college pattern
        const altCollegeMatch = line.match(/^(E\d{3})\s+(.+?)(?:Course Name|$)/i)
        if (altCollegeMatch && !currentCollege) {
            currentCollegeCode = altCollegeMatch[1]
            currentCollege = altCollegeMatch[2].trim()
            collegeCount++
            currentCourse = null
            continue
        }

        // Skip category headers
        if (CATEGORIES.includes(line) || line === 'Course Name') {
            continue
        }

        // Detect course name (starts with course prefix or "B TECH")
        const isCourse = COURSE_PREFIXES.some(prefix =>
            line.toUpperCase().startsWith(prefix) ||
            line.toUpperCase().includes('ENGINEERING') ||
            line.toUpperCase().includes('TECHNOLOGY') ||
            line.toUpperCase().includes('SCIENCE')
        )

        if (isCourse && currentCollege && line.length > 3) {
            // Clean up course name
            currentCourse = line
                .replace(/\s+/g, ' ')
                .trim()
            courseCount++
            continue
        }

        // Try to extract cutoff values
        if (currentCollege && currentCourse) {
            // Check if line contains numbers (cutoff ranks)
            const numbers = line.match(/\d+\.?\d*/g)
            if (numbers && numbers.length > 0) {
                // This line contains cutoff values
                // Look at surrounding lines to build the full row
                const values = []

                // Collect values from current and nearby lines
                for (let j = Math.max(0, i - 5); j <= Math.min(lines.length - 1, i + 30); j++) {
                    const l = lines[j]
                    if (l === '--' || l === '-') {
                        values.push(null)
                    } else if (/^\d+\.?\d*$/.test(l)) {
                        values.push(parseFloat(l))
                    }
                }

                // If we have enough values, create cutoff entries
                if (values.length >= 10) {
                    for (let k = 0; k < Math.min(values.length, CATEGORIES.length); k++) {
                        if (values[k] !== null) {
                            cutoffs.push({
                                institute: currentCollege,
                                institute_code: currentCollegeCode,
                                course: currentCourse,
                                category: CATEGORIES[k],
                                cutoff_rank: values[k],
                                year: year,
                                round: round
                            })
                        }
                    }
                    currentCourse = null // Reset after processing
                }
            }
        }
    }

    console.log(`\nExtraction Summary:`)
    console.log(`- Colleges found: ${collegeCount}`)
    console.log(`- Courses found: ${courseCount}`)
    console.log(`- Cutoff entries: ${cutoffs.length}`)

    return cutoffs
}

async function main() {
    const pdfs = [
        { path: 'kcet-2025-round2-cutoffs.pdf', year: '2025', round: 'R2' },
        { path: 'kcet-2025-round3-cutoffs.pdf', year: '2025', round: 'R3' }
    ]

    let allCutoffs = []

    for (const pdf of pdfs) {
        if (fs.existsSync(pdf.path)) {
            try {
                const cutoffs = await extractPDF(pdf.path, pdf.year, pdf.round)
                allCutoffs = allCutoffs.concat(cutoffs)
            } catch (error) {
                console.error(`Error with ${pdf.path}:`, error.message)
            }
        } else {
            console.log(`File not found: ${pdf.path}`)
        }
    }

    console.log(`\n${'='.repeat(60)}`)
    console.log(`TOTAL EXTRACTED: ${allCutoffs.length} entries`)
    console.log(`${'='.repeat(60)}`)

    if (allCutoffs.length > 0) {
        // Save extracted data
        const outputPath = 'backup/kcet_2025_r2r3_full_extracted.json'
        fs.mkdirSync('backup', { recursive: true })
        fs.writeFileSync(outputPath, JSON.stringify({
            metadata: {
                extracted_at: new Date().toISOString(),
                source: '2025 R2/R3 PDFs',
                total_entries: allCutoffs.length
            },
            cutoffs: allCutoffs
        }, null, 2))
        console.log(`Saved to: ${outputPath}`)

        // Show breakdown by round and college
        const byRound = {}
        const byCollege = {}
        allCutoffs.forEach(c => {
            byRound[c.round] = (byRound[c.round] || 0) + 1
            byCollege[c.institute_code] = (byCollege[c.institute_code] || 0) + 1
        })
        console.log('\nBy round:', byRound)
        console.log('Colleges extracted:', Object.keys(byCollege).length)
        console.log('Sample colleges:', Object.keys(byCollege).slice(0, 10))
    }
}

main().catch(console.error)
