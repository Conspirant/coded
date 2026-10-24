export interface BlueprintRow {
  unitNumber?: number | string
  chapterNumber?: number | string
  name: string
  teachingHours: number
  marks: number
  partA_1m: number | "-"
  partB_2m?: number | "-"
  partC_3m?: number | "-"
  partD_5m?: number | "-"
  partE_6m?: number | "-"
  partE_4m?: number | "-"
}

export interface SubjectBlueprint {
  subjectCode: string
  subjectName: string
  academicCycle: string
  maxMarks: number
  totalTeachingHours: number
  totalPaperMarks: number
  pdfUrl: string
  pdfFileName: string
  partsInfo: {
    part: string
    marksPerQuestion: number
    questionsGiven: number
    questionsToAnswer: number
    totalMarks: number
  }[]
  chapters: BlueprintRow[]
}

export const pucBlueprintsData: Record<string, SubjectBlueprint> = {
  chemistry: {
    subjectCode: "34",
    subjectName: "Chemistry",
    academicCycle: "2026-27",
    maxMarks: 70,
    totalTeachingHours: 120,
    totalPaperMarks: 105,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Chemistry_2026-27_Official_Blueprint.pdf",
    pdfFileName: "KSEAB_2ndPUC_Chemistry_2026-27_Official_Blueprint.pdf",
    partsInfo: [
      { part: "Part - A", marksPerQuestion: 1, questionsGiven: 20, questionsToAnswer: 20, totalMarks: 20 },
      { part: "Part - B", marksPerQuestion: 2, questionsGiven: 5, questionsToAnswer: 3, totalMarks: 6 },
      { part: "Part - C/E", marksPerQuestion: 3, questionsGiven: 15, questionsToAnswer: 8, totalMarks: 24 },
      { part: "Part - D", marksPerQuestion: 5, questionsGiven: 6, questionsToAnswer: 4, totalMarks: 20 },
    ],
    chapters: [
      { unitNumber: 1, name: "Solutions", teachingHours: 14, marks: 12, partA_1m: 3, partB_2m: "-", partC_3m: 3, partD_5m: "-" },
      { unitNumber: 2, name: "Electrochemistry", teachingHours: 14, marks: 13, partA_1m: 1, partB_2m: "-", partC_3m: 4, partD_5m: "-" },
      { unitNumber: 3, name: "Chemical Kinetics", teachingHours: 14, marks: 12, partA_1m: 1, partB_2m: 1, partC_3m: 3, partD_5m: "-" },
      { unitNumber: 4, name: "The d & f Block Elements", teachingHours: 12, marks: 10, partA_1m: 2, partB_2m: 1, partC_3m: 2, partD_5m: "-" },
      { unitNumber: 5, name: "Coordination Compounds", teachingHours: 12, marks: 11, partA_1m: 2, partB_2m: "-", partC_3m: 3, partD_5m: "-" },
      { unitNumber: 6, name: "Haloalkanes & Haloarenes", teachingHours: 10, marks: 9, partA_1m: 2, partB_2m: 1, partC_3m: "-", partD_5m: 1 },
      { unitNumber: 7, name: "Alcohols, Phenols & Ethers", teachingHours: 12, marks: 10, partA_1m: 3, partB_2m: 1, partC_3m: "-", partD_5m: 1 },
      { unitNumber: 8, name: "Aldehydes, Ketones & Carboxylic Acids", teachingHours: 14, marks: 12, partA_1m: 2, partB_2m: "-", partC_3m: "-", partD_5m: 2 },
      { unitNumber: 9, name: "Amines", teachingHours: 8, marks: 7, partA_1m: 2, partB_2m: "-", partC_3m: "-", partD_5m: 1 },
      { unitNumber: 10, name: "Biomolecules", teachingHours: 10, marks: 9, partA_1m: 2, partB_2m: 1, partC_3m: "-", partD_5m: 1 },
    ]
  },

  mathematics: {
    subjectCode: "35",
    subjectName: "Mathematics",
    academicCycle: "2026-27",
    maxMarks: 80,
    totalTeachingHours: 140,
    totalPaperMarks: 120,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Mathematics_2026-27_Official_Blueprint.pdf",
    pdfFileName: "KSEAB_2ndPUC_Mathematics_2026-27_Official_Blueprint.pdf",
    partsInfo: [
      { part: "Part A", marksPerQuestion: 1, questionsGiven: 20, questionsToAnswer: 20, totalMarks: 20 },
      { part: "Part B", marksPerQuestion: 2, questionsGiven: 9, questionsToAnswer: 6, totalMarks: 12 },
      { part: "Part C", marksPerQuestion: 3, questionsGiven: 9, questionsToAnswer: 6, totalMarks: 18 },
      { part: "Part D", marksPerQuestion: 5, questionsGiven: 7, questionsToAnswer: 4, totalMarks: 20 },
      { part: "Part E (6M)", marksPerQuestion: 6, questionsGiven: 2, questionsToAnswer: 1, totalMarks: 6 },
      { part: "Part E (4M)", marksPerQuestion: 4, questionsGiven: 2, questionsToAnswer: 1, totalMarks: 4 },
    ],
    chapters: [
      { chapterNumber: 1, name: "Relations and Functions", teachingHours: 9, marks: 9, partA_1m: 1, partB_2m: "-", partC_3m: 1, partD_5m: 1, partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 2, name: "Inverse Trigonometric Functions", teachingHours: 6, marks: 6, partA_1m: 1, partB_2m: 1, partC_3m: 1, partD_5m: "-", partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 3, name: "Matrices", teachingHours: 9, marks: 9, partA_1m: 1, partB_2m: "-", partC_3m: 1, partD_5m: 1, partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 4, name: "Determinants", teachingHours: 12, marks: 12, partA_1m: 1, partB_2m: 1, partC_3m: "-", partD_5m: 1, partE_6m: "-", partE_4m: 1 },
      { chapterNumber: 5, name: "Continuity and Differentiability", teachingHours: 20, marks: 17, partA_1m: 3, partB_2m: 1, partC_3m: 1, partD_5m: 1, partE_6m: "-", partE_4m: 1 },
      { chapterNumber: 6, name: "Application of Derivatives", teachingHours: 10, marks: 8, partA_1m: 3, partB_2m: 1, partC_3m: 1, partD_5m: "-", partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 7, name: "Integrals", teachingHours: 22, marks: 18, partA_1m: 2, partB_2m: 1, partC_3m: 1, partD_5m: 1, partE_6m: 1, partE_4m: "-" },
      { chapterNumber: 8, name: "Application of Integrals", teachingHours: 5, marks: 5, partA_1m: "-", partB_2m: "-", partC_3m: "-", partD_5m: 1, partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 9, name: "Differential Equations", teachingHours: 10, marks: 8, partA_1m: 1, partB_2m: 1, partC_3m: "-", partD_5m: 1, partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 10, name: "Vector Algebra", teachingHours: 11, marks: 8, partA_1m: 3, partB_2m: 1, partC_3m: 1, partD_5m: "-", partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 11, name: "Three Dimensional Geometry", teachingHours: 8, marks: 6, partA_1m: 1, partB_2m: 1, partC_3m: 1, partD_5m: "-", partE_6m: "-", partE_4m: "-" },
      { chapterNumber: 12, name: "Linear Programming", teachingHours: 7, marks: 6, partA_1m: "-", partB_2m: "-", partC_3m: "-", partD_5m: "-", partE_6m: 1, partE_4m: "-" },
      { chapterNumber: 13, name: "Probability", teachingHours: 11, marks: 8, partA_1m: 3, partB_2m: 1, partC_3m: 1, partD_5m: "-", partE_6m: "-", partE_4m: "-" },
    ]
  },

  physics: {
    subjectCode: "33",
    subjectName: "Physics",
    academicCycle: "2026-27",
    maxMarks: 70,
    totalTeachingHours: 120,
    totalPaperMarks: 105,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Physics_2026-27_Official_Blueprint.pdf",
    pdfFileName: "KSEAB_2ndPUC_Physics_2026-27_Official_Blueprint.pdf",
    partsInfo: [
      { part: "Part - A", marksPerQuestion: 1, questionsGiven: 20, questionsToAnswer: 20, totalMarks: 20 },
      { part: "Part - B", marksPerQuestion: 2, questionsGiven: 8, questionsToAnswer: 5, totalMarks: 10 },
      { part: "Part - C", marksPerQuestion: 3, questionsGiven: 8, questionsToAnswer: 5, totalMarks: 15 },
      { part: "Part - D", marksPerQuestion: 5, questionsGiven: 9, questionsToAnswer: 5, totalMarks: 25 },
    ],
    chapters: [
      { unitNumber: "I", chapterNumber: 1, name: "Electric Charges & Fields", teachingHours: 12, marks: 11, partA_1m: 1, partB_2m: 1, partC_3m: 1, partD_5m: 1 },
      { unitNumber: "II", chapterNumber: 2, name: "Electrostatic Potential and Capacitance", teachingHours: 12, marks: 11, partA_1m: 1, partB_2m: 1, partC_3m: 1, partD_5m: 1 },
      { unitNumber: "III", chapterNumber: 3, name: "Current Electricity", teachingHours: 15, marks: 13, partA_1m: 1, partB_2m: 1, partC_3m: "-", partD_5m: 2 },
      { unitNumber: "IV", chapterNumber: 4, name: "Moving Charges and Magnetism", teachingHours: 13, marks: 11, partA_1m: 1, partB_2m: 1, partC_3m: 1, partD_5m: 1 },
      { unitNumber: "V", chapterNumber: 5, name: "Magnetism and Matter", teachingHours: 6, marks: 5, partA_1m: 2, partB_2m: "-", partC_3m: 1, partD_5m: "-" },
      { unitNumber: "V", chapterNumber: 6, name: "Electromagnetic Induction", teachingHours: 8, marks: 7, partA_1m: 2, partB_2m: 1, partC_3m: 1, partD_5m: "-" },
      { unitNumber: "VI", chapterNumber: 7, name: "Alternating Current", teachingHours: 8, marks: 7, partA_1m: 2, partB_2m: "-", partC_3m: "-", partD_5m: 1 },
      { unitNumber: "VI", chapterNumber: 8, name: "Electromagnetic Waves", teachingHours: 3, marks: 3, partA_1m: 1, partB_2m: 1, partC_3m: "-", partD_5m: "-" },
      { unitNumber: "VII", chapterNumber: 9, name: "Ray Optics and Optical Instruments", teachingHours: 11, marks: 10, partA_1m: 2, partB_2m: "-", partC_3m: 1, partD_5m: 1 },
      { unitNumber: "VIII", chapterNumber: 10, name: "Wave Optics", teachingHours: 8, marks: 7, partA_1m: 2, partB_2m: "-", partC_3m: "-", partD_5m: 1 },
      { unitNumber: "IX", chapterNumber: 11, name: "Dual Nature of Radiation and Matter", teachingHours: 6, marks: 5, partA_1m: 2, partB_2m: "-", partC_3m: 1, partD_5m: "-" },
      { unitNumber: "IX", chapterNumber: 12, name: "Atoms", teachingHours: 4, marks: 3, partA_1m: 1, partB_2m: 1, partC_3m: "-", partD_5m: "-" },
      { unitNumber: "X", chapterNumber: 13, name: "Nuclei", teachingHours: 5, marks: 4, partA_1m: 1, partB_2m: "-", partC_3m: 1, partD_5m: "-" },
      { unitNumber: "X", chapterNumber: 14, name: "Semiconductor Electronics", teachingHours: 9, marks: 8, partA_1m: 1, partB_2m: 1, partC_3m: "-", partD_5m: 1 },
    ]
  }
}
