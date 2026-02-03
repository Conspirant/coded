/**
 * Add Presidency University (E237) 2025 Round 2 & 3 data to the CORRECT data file
 * The app loads from public/data/kcet_cutoffs_consolidated.json
 */

import fs from 'fs'

const CATEGORIES = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMP', 'GMR', 'NRI', 'OPN', 'OTH', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']

// Round 2 data
const PRESIDENCY_R2_DATA = [
    { course: 'B Tech in Artificial Intelligence and Data Science', cutoffs: [46598, null, 47080, null, 55177, 35911, null, 38963, null, 40441, null, null, 35255, 45406, null, 43238, null, 98808, 129002, 103630, 135751, 157532, null, null, null, null, null, null] },
    { course: 'B Tech in Civil Engineering', cutoffs: [null, null, 158543, null, 155879, null, null, 142746, null, 153164, null, null, 115715, null, 174087, null, null, 225026, null, 222887, null, null, null, null, null, null, null, null] },
    { course: 'B Tech in Computer Science & Engineering (Artificial Intelligence & Machine Learning)', cutoffs: [47123, null, 64564, 46083, 64468, 53996, 40645, null, 68680, 30631, null, 43265, 42484, null, 45780, 35263, 55172, null, 41872, null, 93418, 114745, 143426, 95160, 126035, 116604, null, null] },
    { course: 'B Tech in Computer Science and Engineering', cutoffs: [65289, 77875, 90359, 61538, 78527, 70068, 56480, 88652, 62082, 51363, 66050, 60222, 50989, 84982, 61092, 46635, 59424, null, 57941, null, 131030, 257253, 196408, 141119, 146927, 241868, null, null] },
    { course: 'B Tech in Computer Science and Engineering (Block Chain)', cutoffs: [85684, null, 71700, null, 59314, null, null, 60512, null, 54892, 85416, 64841, 54456, null, 61502, null, null, 147572, null, 185498, null, null, null, null, null, null, null, null] },
    { course: 'B Tech in Computer Science and Engineering (Cyber Security)', cutoffs: [84754, null, 88360, 70768, 84824, 78848, 58596, null, 53825, null, 54826, null, 70991, 52193, 70472, null, 64895, null, null, 132933, 186122, 165353, 149127, null, 151719, null, null, null] },
    { course: 'B Tech in Computer Science and Engineering (Data Science)', cutoffs: [66800, null, null, 63315, 73322, 75500, 66802, null, 52948, null, 65201, 52041, null, 64195, 49847, 54388, null, 59748, null, null, 118458, 243851, 160120, 149229, null, 179277, null, null] },
    { course: 'B Tech in Computer Science and Engineering (IoT)', cutoffs: [84880, null, 73776, null, 84679, 65521, null, 59550, null, 63449, null, null, 58646, 68650, 74320, null, null, 166773, null, 203754, 157565, 167287, 224461, null, null, null, null, null] },
    { course: 'B Tech in Computer Science and Technology (Big Data)', cutoffs: [null, null, 65275, null, 84674, 69431, null, 60068, null, 75490, 61276, null, 59358, null, 70261, null, null, 126922, null, null, 167938, null, null, null, null, null, null, null] },
    { course: 'B Tech in Computer Science and Technology (DevOps)', cutoffs: [65813, null, 71222, null, null, null, null, 93757, null, 54964, null, 53291, 68854, null, 58959, null, null, 142573, null, 188886, 129039, null, null, null, null, null, null, null] },
    { course: 'B Tech in Electrical & Electronics Engineering', cutoffs: [147018, null, null, 98228, null, 121459, 120132, null, 78238, null, 84769, null, null, 77884, 97022, null, 104879, null, null, 185004, null, 190341, null, null, null, null, null, null] },
    { course: 'B Tech in Electronics & Communication Engineering', cutoffs: [73725, null, 72608, 85311, 87031, 71880, null, 144280, 59861, null, 60543, null, 73142, 56616, 78307, null, 70381, null, null, 148698, 184711, 260969, 166097, null, 190594, null, null, null] },
    { course: 'B Tech in Information Science & Technology', cutoffs: [74061, null, 72007, 86024, 77905, 63487, null, null, 62266, null, 65220, null, null, 61000, 62315, null, 69135, null, null, 140482, null, 185962, 221515, null, null, null, null, null] },
    { course: 'B Tech in Information Science Engineering', cutoffs: [70207, null, null, 67649, 84127, 72127, 61644, null, 53283, null, 53604, null, null, 52953, 61180, null, 60056, null, null, 142734, 214019, 158303, 171337, null, null, null, null, null] },
    { course: 'B Tech in Mechanical Engineering', cutoffs: [225352, null, 121312, null, null, 117723, null, null, 126416, null, 126424, null, 183481, 113829, 179789, null, 123012, null, null, 248551, null, 172885, null, null, null, null, null, null] },
    { course: 'B Tech in Petroleum Engineering', cutoffs: [135144, null, 196189, 154718, null, null, null, null, 123642, null, 124016, 122061, 149942, null, 102274, null, 117317, null, null, 154077, null, 198351, null, null, null, null, null, null] },
    { course: 'B Tech in Robotics and Artificial Intelligence', cutoffs: [81257, null, 51899, null, 129193, 50258, null, null, 52536, 154781, null, 56420, null, 49182, null, 55030, null, 136300, null, 209786, 129949, null, null, null, null, null, null, null] },
    { course: 'B Tech in VLSI', cutoffs: [125917, null, 95695, null, 102354, null, null, null, 88490, null, 89908, null, 87595, null, 89468, null, null, 176530, null, null, null, null, null, null, null, null, null, null] }
]

// Round 3 data
const PRESIDENCY_R3_DATA = [
    { course: 'B Tech in Artificial Intelligence and Data Science', cutoffs: [46598, null, null, 59482, null, 84874, 45936, null, null, 46836, null, 43959, null, null, 43909, 45406, null, 59434, null, null, 98808, null, 129602, 103630, 135751, 157532, null, null] },
    { course: 'B Tech in Civil Engineering', cutoffs: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 229800, null, null, null, null, null, null, null, null, null, null, null, null] },
    { course: 'B Tech in Computer Science & Engineering (Artificial Intelligence & Machine Learning)', cutoffs: [48147, null, 70468, 52869, 64468, 94744, 55688, null, 68660, 43601, null, 46959, 45871, null, 51650, 39019, 55172, null, 45780, null, null, 93418, 114745, 188118, 95160, 126035, 116604, null] },
    { course: 'B Tech in Computer Science and Engineering', cutoffs: [71510, 77875, 99205, 68119, 106458, 137194, 65643, 88952, 97201, 52948, 103853, 67070, 61317, 67417, 63256, 48520, 61282, null, 60959, null, null, 142544, 253776, 238068, 146927, 178858, 241868, null] },
    { course: 'B Tech in Computer Science and Engineering (Block Chain)', cutoffs: [85684, null, null, 74637, null, null, 59314, null, null, 60512, null, null, 84641, 85416, 79296, 58646, null, 61502, null, null, null, 147572, null, null, 185402, null, null, null] },
    { course: 'B Tech in Computer Science and Engineering (Cyber Security)', cutoffs: [84754, null, 88360, 73938, 84624, 76848, 71680, null, null, 60633, null, 63633, null, 70991, 54236, 79807, null, 70126, null, null, 132933, 186122, 250401, 149127, null, 151719, null, null] },
    { course: 'B Tech in Computer Science and Engineering (Data Science)', cutoffs: [75592, null, null, 67843, 73322, 84441, 68834, null, null, 53825, null, 65201, 80205, null, 64195, 52380, 61180, null, 64016, null, null, 125908, 243651, 160120, 149229, null, 179277, null] },
    { course: 'B Tech in Computer Science and Engineering (IoT)', cutoffs: [84680, null, null, 87861, null, 154081, 65521, null, null, 64829, null, 64319, null, null, 63142, 99725, null, 74320, null, null, 166773, null, 203754, 173756, null, null, null, null] },
    { course: 'B Tech in Computer Science and Technology (Big Data)', cutoffs: [null, null, null, 89814, null, 155429, 77461, null, null, 60810, null, 81441, 61276, null, null, 60068, null, 70261, null, null, 126922, null, null, 167938, null, null, null, null] },
    { course: 'B Tech in Computer Science and Technology (DevOps)', cutoffs: [65813, null, null, 89808, null, null, null, null, 93757, null, null, 72649, null, null, 60535, 66854, null, 75490, null, null, 142573, null, 188886, 129039, null, null, null, null] },
    { course: 'B Tech in Electrical & Electronics Engineering', cutoffs: [147018, null, null, 192906, null, null, 129138, null, 109709, null, null, 124819, null, null, 102205, 120132, null, 121459, null, null, 227907, null, 249895, null, null, null, null, null] },
    { course: 'B Tech in Electronics & Communication Engineering', cutoffs: [73725, null, null, 85311, 146072, 246569, 89504, null, 115657, 64532, null, 68783, null, 78796, 60144, 44521, null, 72763, null, null, 181848, null, 260969, 166097, null, 190594, null, null] },
    { course: 'B Tech in Information Science & Technology', cutoffs: [94302, null, null, 84866, 144837, 158316, 74851, null, null, 72218, null, 80539, null, null, 69352, 101896, null, 88931, null, null, 140462, null, 241273, 221515, null, null, null, null] },
    { course: 'B Tech in Information Science Engineering', cutoffs: [74130, null, null, 73111, 176367, 152649, 80048, null, null, 59130, null, 61693, null, null, 58927, 69955, null, 71571, null, null, 153553, 214019, 158303, 171337, null, null, null, null] },
    { course: 'B Tech in Mechanical Engineering', cutoffs: [192190, null, null, 202532, null, null, 171510, null, null, 176290, null, 162312, null, null, 142386, null, 183481, null, null, null, 248551, null, null, null, null, null, null, null] },
    { course: 'B Tech in Petroleum Engineering', cutoffs: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, 246952, null, null, null, null, null, null, null, null, null, null, null, null, null] },
    { course: 'B Tech in Robotics and Artificial Intelligence', cutoffs: [81257, null, null, 61936, null, 129193, 50258, null, null, 52536, 154781, null, 86006, null, 50098, null, 55030, null, null, 136300, null, 209786, 129949, null, null, null, null, null] },
    { course: 'B Tech in VLSI', cutoffs: [125917, null, null, 110429, null, null, null, null, null, 95647, null, 120681, null, null, 93338, null, 98468, null, null, 182523, null, null, null, null, null, null, null, null] }
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

async function addToCorrectFile() {
    const jsonPath = 'public/data/kcet_cutoffs_consolidated.json'
    console.log('Loading from:', jsonPath)

    const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    const cutoffs = existingData.cutoffs || existingData

    console.log('Existing entries:', cutoffs.length)

    // Create R2 and R3 entries
    const r2Entries = createEntries(PRESIDENCY_R2_DATA, 'R2')
    const r3Entries = createEntries(PRESIDENCY_R3_DATA, 'R3')

    console.log('R2 entries to add:', r2Entries.length)
    console.log('R3 entries to add:', r3Entries.length)

    // Add to existing data
    const updatedCutoffs = [...cutoffs, ...r2Entries, ...r3Entries]

    // Save back
    const outputData = existingData.cutoffs
        ? { ...existingData, cutoffs: updatedCutoffs }
        : updatedCutoffs

    fs.writeFileSync(jsonPath, JSON.stringify(outputData))
    console.log('Saved! Total entries:', updatedCutoffs.length)

    // Verify
    const verify = updatedCutoffs.filter(c => c.year === '2025' && c.institute_code === 'E237')
    const byRound = {}
    verify.forEach(e => { byRound[e.round] = (byRound[e.round] || 0) + 1 })
    console.log('Presidency 2025 by round:', byRound)
}

addToCorrectFile().catch(console.error)
