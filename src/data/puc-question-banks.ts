export interface QuestionBankMeta {
  subjectCode: string
  subjectName: string
  academicCycle: string
  totalPages: number
  fileSizeMb: number
  pdfUrl: string
  pdfFileName: string
  features: string[]
  chapters: {
    unitNumber: number | string
    name: string
    marks: number
    startPage: number
  }[]
}

export const pucQuestionBanksData: Record<string, QuestionBankMeta> = {
  physics: {
    subjectCode: "33",
    subjectName: "Physics",
    academicCycle: "2025-26 / 2026-27",
    totalPages: 149,
    fileSizeMb: 2.4,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Physics_Question_Bank_2025-26.pdf",
    pdfFileName: "KSEAB_2ndPUC_Physics_Question_Bank_2025-26.pdf",
    features: [
      "Official KSEAB & DSE (Pre-University) State Question Bank",
      "Chapter-wise 1-Mark MCQs & Fill in the Blanks",
      "2-Mark Concept Questions & 3-Mark Analytical Questions",
      "5-Mark Standard Derivations & Numerical Problems",
      "Categorized by cognitive difficulty (Easy, Average, Difficult)"
    ],
    chapters: [
      { unitNumber: 1, name: "Electric Charges and Fields", marks: 11, startPage: 5 },
      { unitNumber: 2, name: "Electrostatic Potential and Capacitance", marks: 11, startPage: 14 },
      { unitNumber: 3, name: "Current Electricity", marks: 13, startPage: 25 },
      { unitNumber: 4, name: "Moving Charges and Magnetism", marks: 11, startPage: 35 },
      { unitNumber: 5, name: "Magnetism and Matter", marks: 5, startPage: 46 },
      { unitNumber: 6, name: "Electromagnetic Induction", marks: 7, startPage: 51 },
      { unitNumber: 7, name: "Alternating Current", marks: 7, startPage: 57 },
      { unitNumber: 8, name: "Electromagnetic Waves", marks: 3, startPage: 64 },
      { unitNumber: 9, name: "Ray Optics and Optical Instruments", marks: 10, startPage: 68 },
      { unitNumber: 10, name: "Wave Optics", marks: 7, startPage: 76 },
      { unitNumber: 11, name: "Dual Nature of Radiation and Matter", marks: 5, startPage: 81 },
      { unitNumber: 12, name: "Atoms", marks: 3, startPage: 87 },
      { unitNumber: 13, name: "Nuclei", marks: 4, startPage: 92 },
      { unitNumber: 14, name: "Semiconductor Electronics", marks: 8, startPage: 96 },
    ]
  },

  chemistry: {
    subjectCode: "34",
    subjectName: "Chemistry",
    academicCycle: "2025-26 / 2026-27",
    totalPages: 252,
    fileSizeMb: 6.7,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Chemistry_Question_Bank_2025-26.pdf",
    pdfFileName: "KSEAB_2ndPUC_Chemistry_Question_Bank_2025-26.pdf",
    features: [
      "Official KSEAB Comprehensive 252-Page State Bank",
      "Complete Physical Chemistry Numerical Problems with Working",
      "Inorganic Reaction Balancing, d & f Block Reasoning Questions",
      "Organic Named Reactions, Mechanisms, and Conversions",
      "Biomolecules Structure & Classification Questions"
    ],
    chapters: [
      { unitNumber: 1, name: "Solutions", marks: 12, startPage: 4 },
      { unitNumber: 2, name: "Electrochemistry", marks: 13, startPage: 27 },
      { unitNumber: 3, name: "Chemical Kinetics", marks: 12, startPage: 52 },
      { unitNumber: 4, name: "The d & f Block Elements", marks: 10, startPage: 79 },
      { unitNumber: 5, name: "Coordination Compounds", marks: 11, startPage: 96 },
      { unitNumber: 6, name: "Haloalkanes and Haloarenes", marks: 9, startPage: 115 },
      { unitNumber: 7, name: "Alcohols, Phenols and Ethers", marks: 10, startPage: 133 },
      { unitNumber: 8, name: "Aldehydes, Ketones and Carboxylic Acids", marks: 12, startPage: 158 },
      { unitNumber: 9, name: "Amines", marks: 7, startPage: 179 },
      { unitNumber: 10, name: "Biomolecules", marks: 9, startPage: 197 },
    ]
  },

  mathematics: {
    subjectCode: "35",
    subjectName: "Mathematics",
    academicCycle: "2025-26 / 2026-27",
    totalPages: 164,
    fileSizeMb: 2.3,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Mathematics_Question_Bank_2025-26.pdf",
    pdfFileName: "KSEAB_2ndPUC_Mathematics_Question_Bank_2025-26.pdf",
    features: [
      "Official KSEAB 164-Page Mathematics Question Repository",
      "1-Mark MCQs with options and Fill-in-the-blanks",
      "2-Mark & 3-Mark Standard Exercise Problems",
      "Part D (5-Marker) Long Problems & Integrals",
      "Part E (6-Mark & 4-Mark) Linear Programming, Determinants & Integration"
    ],
    chapters: [
      { unitNumber: 1, name: "Relations and Functions", marks: 9, startPage: 4 },
      { unitNumber: 2, name: "Inverse Trigonometric Functions", marks: 6, startPage: 12 },
      { unitNumber: 3, name: "Matrices", marks: 9, startPage: 20 },
      { unitNumber: 4, name: "Determinants", marks: 12, startPage: 31 },
      { unitNumber: 5, name: "Continuity and Differentiability", marks: 17, startPage: 37 },
      { unitNumber: 6, name: "Application of Derivatives", marks: 8, startPage: 51 },
      { unitNumber: 7, name: "Integrals", marks: 18, startPage: 63 },
      { unitNumber: 8, name: "Application of Integrals", marks: 5, startPage: 82 },
      { unitNumber: 9, name: "Differential Equations", marks: 8, startPage: 83 },
      { unitNumber: 10, name: "Vector Algebra", marks: 8, startPage: 91 },
      { unitNumber: 11, name: "Three Dimensional Geometry", marks: 6, startPage: 98 },
      { unitNumber: 12, name: "Linear Programming", marks: 6, startPage: 103 },
      { unitNumber: 13, name: "Probability", marks: 8, startPage: 106 },
    ]
  }
}
