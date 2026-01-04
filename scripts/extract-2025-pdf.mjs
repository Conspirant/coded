/**
 * Extract 2025 Round 2 and Round 3 cutoffs from PDF files
 * Focuses on extracting ALL colleges including Presidency (E237)
 */

import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'

const CATEGORIES = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMR', 'SC', 'SCK', 'SCR', 'ST', 'STK', 'STR']

// Course code patterns
const COURSE_CODES = ['AD', 'AE', 'AI', 'AR', 'AT', 'AU', 'BC', 'BD', 'BE', 'BI', 'BM', 'BR', 'BS', 'BT', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CK', 'CM', 'CO', 'CP', 'CR', 'CS', 'CT', 'CV', 'CY', 'DC', 'DG', 'DM', 'DS', 'EA', 'EB', 'EC', 'EE', 'EG', 'EI', 'EL', 'EN', 'EP', 'ER', 'ES', 'ET', 'EV', 'IB', 'IC', 'IE', 'IG', 'II', 'IM', 'IO', 'IP', 'IS', 'IT', 'IY', 'LA', 'LC', 'LJ', 'MC', 'MD', 'ME', 'MK', 'MM', 'MN', 'MR', 'MS', 'MT', 'NT', 'OP', 'OT', 'PE', 'PL', 'PM', 'PT', 'RA', 'RB', 'RI', 'RM', 'RO', 'SA', 'SE', 'SS', 'ST', 'TC', 'TE', 'TX', 'UP', 'UR', 'ZC']

async function extractFromPDF(pdfPath, year, round) {
    console.log(`\nExtracting from: ${pdfPath}`)
    console.log(`Year: ${year}, Round: ${round}`)

    const pdfBuffer = fs.readFileSync(pdfPath)
    const data = await pdf(pdfBuffer)

    const text = data.text
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)

    console.log(`Total lines in PDF: ${lines.length}`)

    const cutoffs = []
    let currentInstitute = null
    let currentInstituteCode = null
    let currentCourse = null

    // Regex patterns
    const institutePattern = /^(E\d{3})\s+(.+)/
    const coursePattern = new RegExp(`^(${COURSE_CODES.join('|')})\\s+(.+)`, 'i')
    const rankPattern = /^\d{1,6}$/

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Check for institute code (E001, E002, etc.)
        const instMatch = line.match(institutePattern)
        if (instMatch) {
            currentInstituteCode = instMatch[1]
            currentInstitute = instMatch[2].trim()

            // Log Presidency specifically
            if (currentInstitute.toLowerCase().includes('presidency')) {
                console.log(`Found Presidency: ${currentInstituteCode} - ${currentInstitute}`)
            }
            continue
        }

        // Check for course code
        const courseMatch = line.match(coursePattern)
        if (courseMatch && currentInstitute) {
            currentCourse = courseMatch[1].toUpperCase() + ' ' + courseMatch[2].trim()
            continue
        }

        // Try to extract cutoff values
        // PDF format typically has ranks in sequence for each category
        if (currentInstitute && currentCourse) {
            // Look for numeric values that could be ranks
            const numbers = line.split(/\s+/).filter(n => /^\d{1,6}$/.test(n))

            if (numbers.length > 0) {
                // Each number is a cutoff for a category
                numbers.forEach((rank, idx) => {
                    if (idx < CATEGORIES.length) {
                        cutoffs.push({
                            institute: currentInstitute,
                            institute_code: currentInstituteCode,
                            course: currentCourse,
                            category: CATEGORIES[idx],
                            cutoff_rank: parseInt(rank),
                            year: year,
                            round: round
                        })
                    }
                })
            }
        }
    }

    console.log(`Extracted ${cutoffs.length} cutoff entries`)

    // Filter for Presidency specifically
    const presidencyCutoffs = cutoffs.filter(c =>
        c.institute?.toLowerCase().includes('presidency') ||
        c.institute_code === 'E237'
    )
    console.log(`Presidency entries found: ${presidencyCutoffs.length}`)

    return cutoffs
}

async function main() {
    const pdfFiles = [
        { path: 'kcet-2025-round2-cutoffs.pdf', year: '2025', round: 'R2' },
        { path: 'kcet-2025-round3-cutoffs.pdf', year: '2025', round: 'R3' },
    ]

    let allCutoffs = []

    for (const pdfFile of pdfFiles) {
        if (fs.existsSync(pdfFile.path)) {
            try {
                const cutoffs = await extractFromPDF(pdfFile.path, pdfFile.year, pdfFile.round)
                allCutoffs = allCutoffs.concat(cutoffs)
            } catch (error) {
                console.error(`Error processing ${pdfFile.path}:`, error.message)
            }
        } else {
            console.log(`File not found: ${pdfFile.path}`)
        }
    }

    console.log(`\nTotal extracted: ${allCutoffs.length} entries`)

    // Save to JSON
    const outputPath = 'backup/kcet_2025_r2r3_extracted.json'
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

    // Show summary
    const byRound = {}
    allCutoffs.forEach(c => {
        byRound[c.round] = (byRound[c.round] || 0) + 1
    })
    console.log('\nBy round:', byRound)

    // Show Presidency data
    const presidency = allCutoffs.filter(c =>
        c.institute?.toLowerCase().includes('presidency') ||
        c.institute_code === 'E237'
    )
    console.log('\nPresidency entries:', presidency.length)
    if (presidency.length > 0) {
        console.log('Sample:', presidency.slice(0, 5))
    }
}

main().catch(console.error)
