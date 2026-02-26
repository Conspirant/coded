/**
 * Real placement data for Karnataka engineering colleges.
 * Sources: Shiksha, Careers360, CollegeDunia, official college websites
 * Data year: 2024 placement season (latest available verified data)
 * 
 * Note: "fees" is approximate annual tuition for CET quota in lakhs.
 * Placement figures are overall college averages unless branch is specified.
 */

export interface CollegePlacement {
    code: string          // KCET institute code
    name: string          // Short display name
    branch: string        // Branch or "Overall"
    avgPackage: number    // Average package in LPA
    maxPackage: number    // Highest package in LPA
    fees: number          // Approximate annual fees in lakhs
    source: string        // Data source for transparency
}

export const PLACEMENT_DATA: CollegePlacement[] = [
    // ═══ Tier 1 — Top Colleges ═══
    {
        code: "E005",
        name: "RV College of Engineering",
        branch: "Overall",
        avgPackage: 17.2,
        maxPackage: 62,
        fees: 10,
        source: "rvce.edu.in"
    },
    {
        code: "E009",
        name: "PES University (Ring Road)",
        branch: "Overall",
        avgPackage: 12,
        maxPackage: 65,
        fees: 16,
        source: "pes.edu"
    },
    {
        code: "E003",
        name: "BMS College of Engineering",
        branch: "Overall",
        avgPackage: 11.4,
        maxPackage: 50,
        fees: 10,
        source: "careers360.com"
    },
    {
        code: "E001",
        name: "UVCE",
        branch: "Overall",
        avgPackage: 10.5,
        maxPackage: 58,
        fees: 0.04,
        source: "uvce.ac.in"
    },
    {
        code: "E016",
        name: "Siddaganga Institute of Technology",
        branch: "Overall",
        avgPackage: 9,
        maxPackage: 35,
        fees: 5,
        source: "shiksha.com"
    },

    // ═══ Tier 2 — Very Good Colleges ═══
    {
        code: "E006",
        name: "MS Ramaiah Institute of Technology",
        branch: "Overall",
        avgPackage: 7.66,
        maxPackage: 50,
        fees: 10,
        source: "collegedekho.com"
    },
    {
        code: "E022",
        name: "NIE Mysore",
        branch: "Overall",
        avgPackage: 8,
        maxPackage: 40,
        fees: 6,
        source: "shiksha.com"
    },
    {
        code: "E021",
        name: "SJCE Mysore (JSS S&T University)",
        branch: "Overall",
        avgPackage: 7.5,
        maxPackage: 42,
        fees: 8,
        source: "shiksha.com"
    },
    {
        code: "E126",
        name: "BMSIT&M",
        branch: "Overall",
        avgPackage: 7.9,
        maxPackage: 26.4,
        fees: 10,
        source: "shiksha.com"
    },

    // ═══ Hidden Gems — High ROI ═══
    {
        code: "E118",
        name: "RNS Institute of Technology",
        branch: "Overall",
        avgPackage: 8,
        maxPackage: 56,
        fees: 9,
        source: "rnsit.ac.in"
    },
    {
        code: "E099",
        name: "New Horizon College of Engineering",
        branch: "Overall",
        avgPackage: 8,
        maxPackage: 45,
        fees: 12,
        source: "shiksha.com"
    },
    {
        code: "E007",
        name: "Dayananda Sagar College of Engg.",
        branch: "CSE",
        avgPackage: 7.5,
        maxPackage: 56,
        fees: 7,
        source: "shiksha.com"
    },
    {
        code: "E082",
        name: "JSS Academy of Technical Education",
        branch: "Overall",
        avgPackage: 6.5,
        maxPackage: 43,
        fees: 9,
        source: "careers360.com"
    },
    {
        code: "E008",
        name: "Bangalore Institute of Technology",
        branch: "Overall",
        avgPackage: 6,
        maxPackage: 25,
        fees: 1.2,
        source: "shiksha.com"
    },
    {
        code: "E024",
        name: "Malnad College of Engineering",
        branch: "Overall",
        avgPackage: 6.5,
        maxPackage: 30,
        fees: 4,
        source: "shiksha.com"
    },
    {
        code: "E107",
        name: "BNM Institute of Technology",
        branch: "Overall",
        avgPackage: 6.8,
        maxPackage: 28,
        fees: 8,
        source: "collegedunia.com"
    },
    {
        code: "E062",
        name: "Bapuji Institute of Technology",
        branch: "Overall",
        avgPackage: 5.5,
        maxPackage: 22,
        fees: 4,
        source: "shiksha.com"
    },

    // ═══ Super Gems — Top College Non-CS Branches ═══
    {
        code: "E001",
        name: "UVCE",
        branch: "Civil Engineering",
        avgPackage: 6,
        maxPackage: 12,
        fees: 0.04,
        source: "uvce.ac.in"
    },
    {
        code: "E006",
        name: "MSRIT",
        branch: "Medical Electronics",
        avgPackage: 7,
        maxPackage: 20,
        fees: 10,
        source: "msrit.edu"
    },
    {
        code: "E003",
        name: "BMSCE",
        branch: "Chemical Engineering",
        avgPackage: 6.5,
        maxPackage: 15,
        fees: 10,
        source: "bmsce.ac.in"
    },
    {
        code: "E005",
        name: "RVCE",
        branch: "Biotechnology",
        avgPackage: 8,
        maxPackage: 18,
        fees: 10,
        source: "rvce.edu.in"
    },

    // ═══ Value Picks — Lower Fees, Decent Packages ═══
    {
        code: "E002",
        name: "SKSJTI (Govt. Institute)",
        branch: "Overall",
        avgPackage: 5.5,
        maxPackage: 20,
        fees: 0.2,
        source: "shiksha.com"
    },
    {
        code: "E004",
        name: "Dr. Ambedkar Institute of Technology",
        branch: "Overall",
        avgPackage: 5,
        maxPackage: 18,
        fees: 1.5,
        source: "collegedunia.com"
    },
    {
        code: "E023",
        name: "PES College of Engineering, Mandya",
        branch: "Overall",
        avgPackage: 4.5,
        maxPackage: 15,
        fees: 2,
        source: "shiksha.com"
    },
    {
        code: "E091",
        name: "KS Institute of Technology",
        branch: "Overall",
        avgPackage: 5.5,
        maxPackage: 18,
        fees: 7,
        source: "collegedunia.com"
    },
    {
        code: "E103",
        name: "Global Academy of Technology",
        branch: "Overall",
        avgPackage: 5.8,
        maxPackage: 22,
        fees: 8,
        source: "collegedunia.com"
    }
]
