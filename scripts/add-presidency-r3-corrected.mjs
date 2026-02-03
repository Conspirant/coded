/**
 * Add Corrected Presidency 2025 R3 data - DIRECTLY from PDF extraction
 * Verified against temp_presidency_r3.txt lines 69-594
 */

import fs from 'fs'

const CATEGORIES = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMP', 'GMR', 'NRI', 'OPN', 'OTH', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']

// R3 data directly from PDF lines 69-594
const PRESIDENCY_R3 = [
    // AI & DS (lines 69-97)
    { course: 'B Tech in Artificial Intelligence and Data Science', cutoffs: [46598, null, null, 59482.5, null, 84674, 45936.5, null, null, 46836, null, null, 43959, null, null, 43909, 45406, null, 59434, null, null, null, 98808.5, null, 129602, 103630, 135751, 157532] },
    // Civil (lines 98-126) - only GM has value
    { course: 'B Tech in Civil Engineering', cutoffs: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 229800, null, null, null, null, null, null, null, null, null, null, null, null] },
    // CSE AI&ML (lines 127-155)
    { course: 'B Tech in Computer Science & Engineering (Artificial Intelligence & Machine Learning)', cutoffs: [48147, null, 70468, 52869, 64468, 94744, 55688, null, 68660, 43601, null, 46959, 45871, null, 51650, 39019, 55172, null, 45780, null, null, null, 93418, 114745, 188118, 95160, 126035, 116604] },
    // CSE (lines 156-186)
    { course: 'B Tech in Computer Science and Engineering', cutoffs: [71510, 77875, 99205, 68119, 106458, 137194, 65643.5, 88952, 97201, 52948, 103853, 67070, 61317, 67417, 63256, 48520, 61282.5, null, 60959, null, null, null, 142544.5, 253776, 238068, 146927, 178858, 241866.5] },
    // CSE Blockchain (lines 187-215)
    { course: 'B Tech in Computer Science and Engineering (Block Chain)', cutoffs: [85684, null, null, 74637, null, null, 59314, null, null, 60512, null, null, 64641, 85416, 79296, 58646, null, null, 61502, null, null, null, 147572, null, null, 186402, null, null] },
    // CSE Cyber (lines 216-244)
    { course: 'B Tech in Computer Science and Engineering (Cyber Security)', cutoffs: [84754, null, 88360, 73938, 84624, 76848, 71680, null, null, 60633, null, null, 63633, null, 70991, 54236, 79807, null, 70126, null, null, null, 132933, 186122, 250401, 149127, null, 151719] },
    // CSE DS (lines 245-273)
    { course: 'B Tech in Computer Science and Engineering (Data Science)', cutoffs: [75592, null, null, 67843, 73322, 84441, 68834, null, null, 53825, null, 65201, 60205, null, 64195, 52380, 61180, null, 64016, null, null, null, 125908, 243651, 160120, 149229, null, 179277] },
    // CSE IoT (lines 274-303)
    { course: 'B Tech in Computer Science and Engineering (IoT)', cutoffs: [84680, null, null, 87861, null, 154081, 65521, null, null, 64629, null, null, 64319.75, null, null, 63142, 99725, null, 74320, null, null, null, 166773, null, 203754, 173756, null, null] },
    // CSE Big Data (lines 304-333)
    { course: 'B Tech in Computer Science and Technology (Big Data)', cutoffs: [null, null, null, 89814.25, null, 155429, 77461, null, null, 60810, null, 81441, 61276, null, null, 60068, null, null, 70261, null, null, null, 126922, null, null, 167936, null, null] },
    // CSE DevOps (lines 334-362)
    { course: 'B Tech in Computer Science and Technology (DevOps)', cutoffs: [65613, null, null, 89808, null, null, null, null, 93757, null, null, null, 72649, null, null, 60535, 66854, null, 75490, null, null, null, 142573, null, 188886, 129039, null, null] },
    // EEE (lines 363-391)
    { course: 'B Tech in Electrical & Electronics Engineering', cutoffs: [147018, null, null, 192906, null, null, 129138, null, null, 109709, null, null, 124819, null, null, 102205, 120132, null, 121459, null, null, null, 227907, null, null, 249895, null, null] },
    // ECE (lines 392-420)
    { course: 'B Tech in Electronics & Communication Engineering', cutoffs: [73725, null, null, 85311, 146072, 246569, 89504, null, 115657, 64532, null, null, 68783, null, 78796, 60144, 84521, null, 72763, null, null, null, 181848, null, 260969, 166097, null, 190594] },
    // IST (lines 421-449)
    { course: 'B Tech in Information Science & Technology', cutoffs: [94302, null, null, 84866, 144837, 158316, 74851, null, null, 72218, null, null, 80539, null, null, 69352, 101896, null, 88931, null, null, null, 140462, null, 241273, 221515, null, null] },
    // ISE (lines 450-478)
    { course: 'B Tech in Information Science Engineering', cutoffs: [74130, null, null, 73111, 176367, 152649, 80048, null, null, 59130, null, null, 61693, null, null, 58927, 69955, null, 71571.5, null, null, null, 153553, 214019, 158303, 171337, null, null] },
    // Mechanical (lines 479-507)
    { course: 'B Tech in Mechanical Engineering', cutoffs: [192190, null, null, 202532, null, null, 171510, null, null, 176290, null, null, 162312, null, null, 142386, null, null, 183481, null, null, null, 248551, null, null, null, null, null] },
    // Petroleum (lines 508-536) - only GM has value
    { course: 'B Tech in Petroleum Engineering', cutoffs: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 246952, null, null, null, null, null, null, null, null, null, null, null, null] },
    // Robotics (lines 537-565)
    { course: 'B Tech in Robotics and Artificial Intelligence', cutoffs: [81257, null, null, 61936.5, null, 129193, 50258, null, null, 52536, 154781, null, 86006, null, null, 50098, null, null, 55030, null, null, null, 136300, null, 209786, 129949, null, null] },
    // VLSI (lines 566-594)
    { course: 'B Tech in VLSI', cutoffs: [125917, null, null, 110429, null, null, null, null, null, 95647, null, null, 120681, null, null, 93338, null, null, 98468, null, null, null, 182523, null, null, null, null, null] }
]

function createEntries(courseData, round) {
    const entries = []
    for (const cd of courseData) {
        for (let i = 0; i < CATEGORIES.length; i++) {
            const cutoff = cd.cutoffs[i]
            if (cutoff !== null && cutoff !== undefined) {
                entries.push({
                    institute: 'PRESIDENCY UNIVERSITY',
                    institute_code: 'E237',
                    course: cd.course,
                    category: CATEGORIES[i],
                    cutoff_rank: cutoff,
                    year: '2025',
                    round: round
                })
            }
        }
    }
    return entries
}

async function addR3Data() {
    const jsonPath = 'public/data/kcet_cutoffs_consolidated.json'
    console.log('Loading:', jsonPath)

    const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    let cutoffs = existingData.cutoffs || existingData

    // Remove existing R3 entries only
    const before = cutoffs.length
    cutoffs = cutoffs.filter(c =>
        !(c.year === '2025' && c.institute_code === 'E237' && c.round === 'R3')
    )
    console.log(`Removed ${before - cutoffs.length} old R3 entries`)

    // Add corrected R3 entries
    const r3Entries = createEntries(PRESIDENCY_R3, 'R3')
    console.log('Corrected R3 entries:', r3Entries.length)

    cutoffs = [...cutoffs, ...r3Entries]

    // Save
    const outputData = existingData.cutoffs
        ? { ...existingData, cutoffs: cutoffs }
        : cutoffs

    fs.writeFileSync(jsonPath, JSON.stringify(outputData))
    console.log('Saved! Total entries:', cutoffs.length)

    // Verify
    const verify = cutoffs.filter(c => c.year === '2025' && c.institute_code === 'E237')
    const byRound = {}
    verify.forEach(e => { byRound[e.round] = (byRound[e.round] || 0) + 1 })
    console.log('Presidency 2025 by round:', byRound)
}

addR3Data().catch(console.error)
