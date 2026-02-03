/**
 * Corrected Presidency 2025 R2/R3 data - DIRECTLY from PDF extraction
 * Verified against temp_presidency_r2.txt
 */

import fs from 'fs'

// Categories in exact order from PDF header (lines 41-68)
const CATEGORIES = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMP', 'GMR', 'NRI', 'OPN', 'OTH', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']

// Corrected R2 data - directly from PDF lines
const PRESIDENCY_R2 = [
    // B TECH IN AI & DS (lines 69-97)
    { course: 'B Tech in Artificial Intelligence and Data Science', cutoffs: [46598, null, null, 47080, null, 55177, 35911, null, null, 38963, null, null, 40441, null, null, 35255, 45406, null, 43238, null, null, null, 98808.5, null, 129602, 103630, 135751, 157532] },
    // B TECH IN CIVIL (lines 98-126)
    { course: 'B Tech in Civil Engineering', cutoffs: [null, null, null, 158543, null, null, 155879, null, null, 142746, null, null, 153164, null, null, 115715, null, null, 174687, null, null, null, 225026, null, null, 222887, null, null] },
    // B TECH IN CSE AI&ML (lines 127-155)
    { course: 'B Tech in Computer Science & Engineering (Artificial Intelligence & Machine Learning)', cutoffs: [47123, null, 64564, 46083, 64468, 53996, 40645, null, 68660, 36631, null, 43265, 42484, null, 45780, 35263, 55172, null, 41872, null, null, null, 93418, 114745, 143426, 95160, 126035, 116604] },
    // B TECH IN CSE (lines 156-185)
    { course: 'B Tech in Computer Science and Engineering', cutoffs: [65289, 77875, 90359, 61538, 78527, 70068, 56480, 88952, 82082, 51363, 66050, 60222, 50989, 64982, 61092, 46635, 59424, null, 57941, null, null, null, 131030, 257253, 196408, 141119, 146927, 241866.5] },
    // B TECH IN CSE BLOCKCHAIN (lines 186-214)
    { course: 'B Tech in Computer Science and Engineering (Block Chain)', cutoffs: [85684, null, null, 71700, null, null, 59314, null, null, 60512, null, null, 54892, 85416, 64641, 54456, null, null, 61502, null, null, null, 147572, null, null, 185498, null, null] },
    // B TECH IN CSE CYBER (lines 215-243)
    { course: 'B Tech in Computer Science and Engineering (Cyber Security)', cutoffs: [84754, null, 88360, 70768, 84624, 76848, 58596, null, null, 53825, null, null, 54626, null, 70991, 52193, 70472, null, 64895, null, null, null, 132933, 186122, 165353, 149127, null, 151719] },
    // B TECH IN CSE DS (lines 244-272)
    { course: 'B Tech in Computer Science and Engineering (Data Science)', cutoffs: [66600, null, null, 63315, 73322, 75500, 56602, null, null, 52948, null, 65201, 52041, null, 64195, 49847, 54388, null, 59748, null, null, null, 118458, 243651, 160120, 149229, null, 179277] },
    // B TECH IN CSE IOT (lines 273-301)
    { course: 'B Tech in Computer Science and Engineering (IoT)', cutoffs: [84680, null, null, 73776, null, 84679, 65521, null, null, 59550, null, null, 63449, null, null, 58646, 69650, null, 74320, null, null, null, 166773, null, 203754, 157565, 167287, 224461] },
    // B TECH IN CSE BIG DATA (lines 302-330)
    { course: 'B Tech in Computer Science and Technology (Big Data)', cutoffs: [null, null, null, 65275, null, 84674, 69431, null, null, 60068, null, 75490, 61276, null, null, 59358, null, null, 70261, null, null, null, 126922, null, null, 167936, null, null] },
    // B TECH IN CSE DEVOPS (lines 331-359)
    { course: 'B Tech in Computer Science and Technology (DevOps)', cutoffs: [65613, null, null, 71222, null, null, null, null, 93757, null, null, null, 54964, null, null, 53291, 66854, null, 58959, null, null, null, 142573, null, 188886, 129039, null, null] },
    // B TECH IN EEE (lines 360-388)
    { course: 'B Tech in Electrical & Electronics Engineering', cutoffs: [147018, null, null, 98228.5, null, 121459, 120132, null, null, 78238, null, null, 84769, null, null, 77884, 97022, null, 104879, null, null, null, 185004, null, null, 190341, null, null] },
    // B TECH IN ECE (lines 389-417)
    { course: 'B Tech in Electronics & Communication Engineering', cutoffs: [73725, null, null, 72608, 85311, 87031, 71680, null, 144280, 59861, null, null, 60543, null, 73142, 56616, 78307, null, 70381, null, null, null, 148698, 184711, 260969, 166097, null, 190594] },
    // B TECH IN IST (lines 418-446)
    { course: 'B Tech in Information Science & Technology', cutoffs: [74061, null, null, 72007, 86024, 77905, 63487, null, null, 62268, null, null, 65220, null, null, 61000, 62315, null, 69135, null, null, null, 140462, null, 185962, 221515, null, null] },
    // B TECH IN ISE (lines 447-475)
    { course: 'B Tech in Information Science Engineering', cutoffs: [70207, null, null, 67649, 84127, 72127, 61644, null, null, 53283, null, null, 53604, null, null, 52953, 61180, null, 66056, null, null, null, 142734, 214019, 158303, 171337, null, null] },
    // B TECH IN MECH (lines 476-505)
    { course: 'B Tech in Mechanical Engineering', cutoffs: [225352, null, null, 121312.5, null, null, 117723, null, null, 126416, null, null, 126424, null, 183481, 113828, 179789, null, 123012, null, null, null, 248551, null, null, 172885, null, null] },
    // B TECH IN PETROLEUM (lines 506-534)
    { course: 'B Tech in Petroleum Engineering', cutoffs: [135144, null, 196189, 154718, null, null, null, null, null, 123642, null, 124016, 122061, 148942, null, 102274, null, null, 117317, null, null, null, 154077, null, null, 198351, null, null] },
    // B TECH IN ROBOTICS (lines 535-563)
    { course: 'B Tech in Robotics and Artificial Intelligence', cutoffs: [81257, null, null, 51899, null, 129193, 50258, null, null, 52536, 154781, null, 56420, null, null, 49162, null, null, 55030, null, null, null, 136300, null, 209786, 129949, null, null] },
    // B.Tech in VLSI (lines 564-592)
    { course: 'B Tech in VLSI', cutoffs: [125917, null, null, 95695, null, 102354, null, null, null, 89490, null, null, 89908, null, null, 87595, null, null, 98468, null, null, null, 179530, null, null, null, null, null] }
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

async function updateData() {
    const jsonPath = 'public/data/kcet_cutoffs_consolidated.json'
    console.log('Loading:', jsonPath)

    const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    let cutoffs = existingData.cutoffs || existingData

    // Remove existing Presidency R2/R3 entries (we'll replace with corrected data)
    const before = cutoffs.length
    cutoffs = cutoffs.filter(c =>
        !(c.year === '2025' && c.institute_code === 'E237' && (c.round === 'R2' || c.round === 'R3'))
    )
    console.log(`Removed ${before - cutoffs.length} old Presidency R2/R3 entries`)

    // Add corrected R2 entries
    const r2Entries = createEntries(PRESIDENCY_R2, 'R2')
    console.log('Corrected R2 entries:', r2Entries.length)

    cutoffs = [...cutoffs, ...r2Entries]

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

updateData().catch(console.error)
