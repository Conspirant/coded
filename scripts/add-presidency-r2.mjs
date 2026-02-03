/**
 * Add Presidency University (E237) 2025 Round 2 data
 * Extracted from PDF page 86
 */

import fs from 'fs'

// Categories in order from the PDF
const CATEGORIES = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMP', 'GMR', 'NRI', 'OPN', 'OTH', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']

// Presidency University E237 - 2025 Round 2 data from page 86
const PRESIDENCY_R2_DATA = [
    {
        course: 'B Tech in Artificial Intelligence and Data Science',
        cutoffs: [46598, null, 47080, null, 55177, 35911, null, 38963, null, 40441, null, null, 35255, 45406, null, 43238, null, 98808, 129002, 103630, 135751, 157532, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Civil Engineering',
        cutoffs: [null, null, 158543, null, 155879, null, null, 142746, null, 153164, null, null, 115715, null, 174087, null, null, 225026, null, 222887, null, null, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Computer Science & Engineering (Artificial Intelligence & Machine Learning)',
        cutoffs: [47123, null, 64564, 46083, 64468, 53996, 40645, null, 68680, 30631, null, 43265, 42484, null, 45780, 35263, 55172, null, 41872, null, 93418, 114745, 143426, 95160, 126035, 116604, null, null]
    },
    {
        course: 'B Tech in Computer Science and Engineering',
        cutoffs: [65289, 77875, 90359, 61538, 78527, 70068, 56480, 88652, 62082, 51363, 66050, 60222, 50989, 84982, 61092, 46635, 59424, null, 57941, null, 131030, 257253, 196408, 141119, 146927, 241868, null, null]
    },
    {
        course: 'B Tech in Computer Science and Engineering (Block Chain)',
        cutoffs: [85684, null, 71700, null, 59314, null, null, 60512, null, 54892, 85416, 64841, 54456, null, 61502, null, null, 147572, null, 185498, null, null, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Computer Science and Engineering (Cyber Security)',
        cutoffs: [84754, null, 88360, 70768, 84824, 78848, 58596, null, 53825, null, 54826, null, 70991, 52193, 70472, null, 64895, null, null, 132933, 186122, 165353, 149127, null, 151719, null, null, null]
    },
    {
        course: 'B Tech in Computer Science and Engineering (Data Science)',
        cutoffs: [66800, null, null, 63315, 73322, 75500, 66802, null, 52948, null, 65201, 52041, null, 64195, 49847, 54388, null, 59748, null, null, 118458, 243851, 160120, 149229, null, 179277, null, null]
    },
    {
        course: 'B Tech in Computer Science and Engineering (IoT)',
        cutoffs: [84880, null, 73776, null, 84679, 65521, null, 59550, null, 63449, null, null, 58646, 68650, 74320, null, null, 166773, null, 203754, 157565, 167287, 224461, null, null, null, null, null]
    },
    {
        course: 'B Tech in Computer Science and Technology (Big Data)',
        cutoffs: [null, null, 65275, null, 84674, 69431, null, 60068, null, 75490, 61276, null, 59358, null, 70261, null, null, 126922, null, null, 167938, null, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Computer Science and Technology (DevOps)',
        cutoffs: [65813, null, 71222, null, null, null, null, 93757, null, 54964, null, 53291, 68854, null, 58959, null, null, 142573, null, 188886, 129039, null, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Electrical & Electronics Engineering',
        cutoffs: [147018, null, null, 98228, null, 121459, 120132, null, 78238, null, 84769, null, null, 77884, 97022, null, 104879, null, null, 185004, null, 190341, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Electronics & Communication Engineering',
        cutoffs: [73725, null, 72608, 85311, 87031, 71880, null, 144280, 59861, null, 60543, null, 73142, 56616, 78307, null, 70381, null, null, 148698, 184711, 260969, 166097, null, 190594, null, null, null]
    },
    {
        course: 'B Tech in Information Science & Technology',
        cutoffs: [74061, null, 72007, 86024, 77905, 63487, null, null, 62266, null, 65220, null, null, 61000, 62315, null, 69135, null, null, 140482, null, 185962, 221515, null, null, null, null, null]
    },
    {
        course: 'B Tech in Information Science Engineering',
        cutoffs: [70207, null, null, 67649, 84127, 72127, 61644, null, 53283, null, 53604, null, null, 52953, 61180, null, 60056, null, null, 142734, 214019, 158303, 171337, null, null, null, null, null]
    },
    {
        course: 'B Tech in Mechanical Engineering',
        cutoffs: [225352, null, 121312, null, null, 117723, null, null, 126416, null, 126424, null, 183481, 113829, 179789, null, 123012, null, null, 248551, null, 172885, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Petroleum Engineering',
        cutoffs: [135144, null, 196189, 154718, null, null, null, null, 123642, null, 124016, 122061, 149942, null, 102274, null, 117317, null, null, 154077, null, 198351, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in Robotics and Artificial Intelligence',
        cutoffs: [81257, null, 51899, null, 129193, 50258, null, null, 52536, 154781, null, 56420, null, 49182, null, 55030, null, 136300, null, 209786, 129949, null, null, null, null, null, null, null]
    },
    {
        course: 'B Tech in VLSI',
        cutoffs: [125917, null, 95695, null, 102354, null, null, null, 88490, null, 89908, null, 87595, null, 89468, null, null, 176530, null, null, null, null, null, null, null, null, null, null]
    }
]

async function addPresidencyData() {
    // Load existing consolidated JSON
    const jsonPath = 'public/kcet_cutoffs_consolidated.json'
    console.log('Loading existing data from:', jsonPath)

    const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    const cutoffs = existingData.cutoffs || existingData

    console.log('Existing entries:', cutoffs.length)

    // Check how many Presidency 2025 R2 entries already exist
    const existingPresidencyR2 = cutoffs.filter(c =>
        c.year === '2025' &&
        c.round === 'R2' &&
        (c.institute?.toLowerCase().includes('presidency') || c.institute_code === 'E237')
    )
    console.log('Existing Presidency 2025 R2 entries:', existingPresidencyR2.length)

    // Create new entries
    const newEntries = []

    for (const courseData of PRESIDENCY_R2_DATA) {
        for (let i = 0; i < CATEGORIES.length; i++) {
            const cutoff = courseData.cutoffs[i]
            if (cutoff !== null && cutoff !== undefined) {
                newEntries.push({
                    institute: 'PRESIDENCY UNIVERSITY',
                    institute_code: 'E237',
                    course: courseData.course,
                    category: CATEGORIES[i],
                    cutoff_rank: cutoff,
                    year: '2025',
                    round: 'R2'
                })
            }
        }
    }

    console.log('New entries to add:', newEntries.length)

    // Add to existing data
    const updatedCutoffs = [...cutoffs, ...newEntries]

    // Save back
    const outputData = existingData.cutoffs
        ? { ...existingData, cutoffs: updatedCutoffs }
        : updatedCutoffs

    fs.writeFileSync(jsonPath, JSON.stringify(outputData, null, 2))
    console.log('Saved to:', jsonPath)
    console.log('Total entries now:', updatedCutoffs.length)

    // Verify
    const verify = updatedCutoffs.filter(c =>
        c.year === '2025' &&
        c.round === 'R2' &&
        c.institute_code === 'E237'
    )
    console.log('Presidency 2025 R2 entries after update:', verify.length)
}

addPresidencyData().catch(console.error)
