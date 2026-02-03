/**
 * Course Normalizer - Handles variations in course names across years (2023, 2024, 2025)
 * 
 * Problem: Same branch is written differently across years:
 * - "Computer Science And Engineering" (2023)
 * - "COMPUTER SCIENCE AND ENGINEERING" (2024)
 * - "CS Computer Science And Engineering" (2025)
 * 
 * Solution: Pattern-based normalization that groups all variations to canonical names
 */

// Canonical course names - the "official" display name for each branch
export const CANONICAL_COURSES = {
    // Core Engineering
    CSE: 'Computer Science and Engineering',
    ECE: 'Electronics and Communication Engineering',
    EEE: 'Electrical and Electronics Engineering',
    ME: 'Mechanical Engineering',
    CE: 'Civil Engineering',
    CH: 'Chemical Engineering',

    // Computer Science Specializations
    CSE_AI: 'Computer Science (Artificial Intelligence)',
    CSE_ML: 'Computer Science (Machine Learning)',
    CSE_AIML: 'Computer Science (AI & ML)',
    CSE_DS: 'Computer Science (Data Science)',
    CSE_CYBER: 'Computer Science (Cyber Security)',
    CSE_IOT: 'Computer Science (IoT)',
    CSE_BLOCKCHAIN: 'Computer Science (Blockchain)',
    CSE_CLOUD: 'Computer Science (Cloud Computing)',

    // Information Science
    ISE: 'Information Science and Engineering',
    IT: 'Information Technology',

    // Allied Engineering
    BT: 'Biotechnology',
    BME: 'Biomedical Engineering',
    AE: 'Aeronautical Engineering',
    ASE: 'Aerospace Engineering',
    AUTO: 'Automobile Engineering',
    MECH: 'Mechatronics',
    ROBOTICS: 'Robotics and Automation',

    // Others
    ARCH: 'Architecture',
    PLAN: 'Planning',
} as const;

// Patterns to match course variations - uses regex for flexibility
const COURSE_PATTERNS: Array<{ pattern: RegExp; canonical: string }> = [
    // Computer Science and Engineering (all variations)
    {
        pattern: /^(CS\s+)?COMPUTER\s+SCIENCE\s+(AND|&)?\s*ENGINEERING$/i,
        canonical: CANONICAL_COURSES.CSE
    },
    {
        pattern: /^(CS\s+)?COMPUTER\s+SCIENCE\s+AND\s+ENGG?$/i,
        canonical: CANONICAL_COURSES.CSE
    },

    // CSE with AI/ML specialization
    {
        pattern: /COMPUTER\s+SCIENCE.*(AI|ARTIFICIAL\s+INTELLIGENCE).*(ML|MACHINE\s+LEARNING)/i,
        canonical: CANONICAL_COURSES.CSE_AIML
    },
    {
        pattern: /ARTIFICIAL\s+INTELLIGENCE\s+(AND|&)\s+MACHINE\s+LEARNING/i,
        canonical: CANONICAL_COURSES.CSE_AIML
    },
    {
        pattern: /^(AI|AD)\s+.*ARTIFICIAL\s+INTELLIGENCE/i,
        canonical: CANONICAL_COURSES.CSE_AIML
    },

    // CSE with Data Science
    {
        pattern: /COMPUTER\s+SCIENCE.*DATA\s+SCIENCE/i,
        canonical: CANONICAL_COURSES.CSE_DS
    },
    {
        pattern: /^(DS|DC)\s+.*DATA\s+SCIENCE/i,
        canonical: CANONICAL_COURSES.CSE_DS
    },
    {
        pattern: /^DATA\s+SCIENCE/i,
        canonical: CANONICAL_COURSES.CSE_DS
    },

    // CSE with Cyber Security
    {
        pattern: /COMPUTER\s+SCIENCE.*CYBER\s+SECURITY/i,
        canonical: CANONICAL_COURSES.CSE_CYBER
    },
    {
        pattern: /^(CY)\s+.*CYBER/i,
        canonical: CANONICAL_COURSES.CSE_CYBER
    },
    {
        pattern: /^CYBER\s+SECURITY$/i,
        canonical: CANONICAL_COURSES.CSE_CYBER
    },

    // CSE with IoT
    {
        pattern: /COMPUTER\s+SCIENCE.*(IOT|INTERNET\s+OF\s+THINGS)/i,
        canonical: CANONICAL_COURSES.CSE_IOT
    },
    {
        pattern: /^(IO|IC)\s+.*IOT|INTERNET/i,
        canonical: CANONICAL_COURSES.CSE_IOT
    },

    // CSE with Blockchain
    {
        pattern: /COMPUTER\s+SCIENCE.*BLOCK\s*CHAIN/i,
        canonical: CANONICAL_COURSES.CSE_BLOCKCHAIN
    },

    // Electronics and Communication Engineering
    {
        pattern: /^(EC\s+)?ELECTRONICS\s+(AND|&)?\s*COMMUNICATION\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.ECE
    },
    {
        pattern: /^(EC\s+)?ELECTRONICS\s+(AND|&)\s+COMM/i,
        canonical: CANONICAL_COURSES.ECE
    },

    // Electrical and Electronics Engineering
    {
        pattern: /^(EE\s+)?ELECTRICAL\s+(AND|&)?\s*ELECTRONICS\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.EEE
    },

    // Mechanical Engineering
    {
        pattern: /^(ME\s+)?MECHANICAL\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.ME
    },

    // Civil Engineering
    {
        pattern: /^(CE\s+)?CIVIL\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.CE
    },

    // Information Science and Engineering
    {
        pattern: /^(IS|IE)\s+.*INFORMATION\s+SCIENCE/i,
        canonical: CANONICAL_COURSES.ISE
    },
    {
        pattern: /^INFORMATION\s+SCIENCE\s+(AND|&)?\s*ENGINEERING$/i,
        canonical: CANONICAL_COURSES.ISE
    },

    // Information Technology
    {
        pattern: /^(IT|IG)\s+.*INFORMATION\s+TECHNOLOGY/i,
        canonical: CANONICAL_COURSES.IT
    },
    {
        pattern: /^INFORMATION\s+TECHNOLOGY$/i,
        canonical: CANONICAL_COURSES.IT
    },

    // Biotechnology
    {
        pattern: /^(BT\s+)?BIO[\s-]?TECHNOLOGY$/i,
        canonical: CANONICAL_COURSES.BT
    },

    // Biomedical Engineering
    {
        pattern: /^(BM\s+)?BIO[\s-]?MEDICAL\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.BME
    },

    // Aeronautical Engineering
    {
        pattern: /^(AE\s+)?AERONAUTICAL\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.AE
    },

    // Aerospace Engineering
    {
        pattern: /^(SE\s+)?AEROSPACE\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.ASE
    },

    // Automobile Engineering
    {
        pattern: /^(AU|AT)\s+.*AUTOMOBILE|AUTOMOTIVE/i,
        canonical: CANONICAL_COURSES.AUTO
    },
    {
        pattern: /^AUTOMOBILE\s+(ENGINEERING|ENGG?)?$/i,
        canonical: CANONICAL_COURSES.AUTO
    },

    // Mechatronics
    {
        pattern: /^(MT\s+)?MECHATRONICS$/i,
        canonical: CANONICAL_COURSES.MECH
    },

    // Robotics
    {
        pattern: /ROBOTICS\s+(AND|&)\s+(AUTOMATION|AI)/i,
        canonical: CANONICAL_COURSES.ROBOTICS
    },
    {
        pattern: /^(RA|RO|RI)\s+.*ROBOTICS/i,
        canonical: CANONICAL_COURSES.ROBOTICS
    },

    // Architecture
    {
        pattern: /^(AR\s+)?ARCHITECTURE$/i,
        canonical: CANONICAL_COURSES.ARCH
    },

    // Planning
    {
        pattern: /^(UP|UR|LA)\s+.*PLANNING|B\.?\s*PLAN$/i,
        canonical: CANONICAL_COURSES.PLAN
    },
];

/**
 * Normalize a course name to its canonical form
 * @param rawCourse - The raw course name from the data (may vary by year)
 * @returns The canonical course name
 */
export function normalizeCourse(rawCourse: string): string {
    if (!rawCourse) return rawCourse;

    // Step 1: Clean the input - remove newlines, collapse spaces, trim
    const cleaned = rawCourse
        .replace(/[\r\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleaned) return rawCourse;

    // Step 2: Try pattern matching
    for (const { pattern, canonical } of COURSE_PATTERNS) {
        if (pattern.test(cleaned)) {
            return canonical;
        }
    }

    // Step 3: Extract 2-letter code and try to match
    const codeMatch = cleaned.match(/^([A-Z]{2})\s+/);
    if (codeMatch) {
        const code = codeMatch[1];
        const nameWithoutCode = cleaned.substring(code.length).trim();

        // Try matching just the name part
        for (const { pattern, canonical } of COURSE_PATTERNS) {
            if (pattern.test(nameWithoutCode)) {
                return canonical;
            }
        }
    }

    // Step 4: Fallback - Title case the cleaned text
    return cleaned
        .split(' ')
        .map(word => {
            // Keep small words lowercase unless at start
            const lowerWord = word.toLowerCase();
            if (['and', 'of', 'in', 'the', '&'].includes(lowerWord)) {
                return lowerWord;
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}

/**
 * Get canonical course name for filtering/grouping
 * This is more aggressive normalization for comparison purposes
 */
export function getCanonicalCourseKey(courseName: string): string {
    const normalized = normalizeCourse(courseName);

    // Create a simple key by removing special chars and lowercasing
    return normalized
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

/**
 * Check if two course names refer to the same branch
 */
export function isSameCourse(course1: string, course2: string): boolean {
    return getCanonicalCourseKey(course1) === getCanonicalCourseKey(course2);
}

/**
 * Get all unique canonical course names from a list of raw names
 */
export function getUniqueCourses(rawCourses: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const raw of rawCourses) {
        const canonical = normalizeCourse(raw);
        const key = getCanonicalCourseKey(canonical);

        if (!seen.has(key)) {
            seen.add(key);
            result.push(canonical);
        }
    }

    return result.sort();
}
