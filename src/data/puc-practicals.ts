export interface PracticalScheme {
  subjectCode: string
  subjectName: string
  academicCycle: string
  duration: string
  maxMarks: number
  pdfUrl: string
  pdfFileName: string
  overallWeightage: {
    slNo: number
    particulars: string
    marks: number
  }[]
  sections: {
    title: string
    marks: number
    description?: string
    breakdown: {
      step: string
      marks: number | string
      notes?: string
    }[]
  }[]
  curriculumList?: {
    expNo: number
    title: string
  }[]
  suggestedSaltsOrApparatus?: string[]
}

export const pucPracticalsData: Record<string, PracticalScheme> = {
  physics: {
    subjectCode: "33",
    subjectName: "Physics",
    academicCycle: "2025-26 / 2026-27",
    duration: "2 Hours",
    maxMarks: 30,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Physics_Practical_Scheme_2025-26.pdf",
    pdfFileName: "KSEAB_2ndPUC_Physics_Practical_Scheme_2025-26.pdf",
    overallWeightage: [
      { slNo: 1, particulars: "Performing Experiment (Lab Setup & Execution)", marks: 20 },
      { slNo: 2, particulars: "Class Attendance (Theory + Practical >= 75%)", marks: 5 },
      { slNo: 3, particulars: "Practical Record (Duly Completed & Certified)", marks: 5 },
    ],
    sections: [
      {
        title: "Distribution of Marks for Performing the Experiment",
        marks: 20,
        description: "Official step-wise breakdown evaluated during the 2-hour practical examination session.",
        breakdown: [
          { step: "Writing the Principle of the experiment", marks: 2, notes: "Underlying physical law / theorem" },
          { step: "Writing the Formula and explaining all terms", marks: 2, notes: "All variables defined with standard symbols" },
          { step: "Drawing Circuit Diagram / Ray Diagram / Figure", marks: 2, notes: "Neat diagram with labeling at least two parts" },
          { step: "Writing Tabular Column / Observation Pattern", marks: 2, notes: "Complete table header with units" },
          { step: "Constructing Experimental Setup / Circuit connection", marks: 3, notes: "Correct physical apparatus arrangement" },
          { step: "Performing experiment and recording observations", marks: 4, notes: "Systematic entry of trials into the table" },
          { step: "Substitution & Calculation / Plotting Graph", marks: 3, notes: "Proper scaling, slope, and arithmetic working" },
          { step: "Final Result with standard SI unit & acceptable accuracy", marks: 2, notes: "Reported value within board tolerance" },
        ]
      },
      {
        title: "Internal Assessment & Regularity Components",
        marks: 10,
        description: "Awarded based on term-long laboratory regularity and certified submission.",
        breakdown: [
          { step: "Class Attendance (Theory + Practical Classes >= 75%)", marks: 5, notes: "Institutional attendance audit" },
          { step: "Certified Laboratory Record Book", marks: 5, notes: "Completed lab manual with teacher sign-off" },
        ]
      }
    ]
  },

  chemistry: {
    subjectCode: "34",
    subjectName: "Chemistry",
    academicCycle: "2025-26 / 2026-27",
    duration: "2 Hours",
    maxMarks: 30,
    pdfUrl: "/puc-papers/KSEAB_2ndPUC_Chemistry_Practical_Scheme_2025-26.pdf",
    pdfFileName: "KSEAB_2ndPUC_Chemistry_Practical_Scheme_2025-26.pdf",
    overallWeightage: [
      { slNo: 1, particulars: "Question I: Salt Analysis (Inorganic Qualitative Analysis)", marks: 10 },
      { slNo: 2, particulars: "Question II: Titration (Volumetric Analysis - KMnO4 vs FAS)", marks: 10 },
      { slNo: 3, particulars: "Class Attendance (Theory + Practical >= 75%)", marks: 5 },
      { slNo: 4, particulars: "Certified Laboratory Record Book", marks: 5 },
    ],
    sections: [
      {
        title: "Question I: Salt Analysis (Inorganic Qualitative Analysis)",
        marks: 10,
        description: "Systematic identification of one Acid Radical (Anion) and one Basic Radical (Cation).",
        breakdown: [
          { step: "Preliminary Tests (Physical state, color, odor, solubility)", marks: 1, notes: "Any two correct observations" },
          { step: "Acid Radical - Correct Group Identification", marks: 1, notes: "Dilute H2SO4 / Conc. H2SO4 / Special group" },
          { step: "Acid Radical - Radical Identification", marks: 1, notes: "Observation on reagent addition" },
          { step: "Acid Radical - Confirmatory Test (CT)", marks: 2, notes: "Specific chemical test reaction" },
          { step: "Basic Radical - Correct Group Identification", marks: 1, notes: "Group separation sequence (0 to VI)" },
          { step: "Basic Radical - Radical Identification", marks: 1, notes: "Group reagent observation" },
          { step: "Basic Radical - Confirmatory Test (CT)", marks: 2, notes: "Specific precipitate / color reaction" },
          { step: "Systematic Procedure & Absence of Previous Groups", marks: 1, notes: "Writing zero group to confirmed group step-wise" },
        ]
      },
      {
        title: "Question II: Titration (Volumetric Analysis)",
        marks: 10,
        description: "Estimation of the Molarity of KMnO4 solution using given standard (0.1 M) FAS solution.",
        breakdown: [
          { step: "Performing the Titration Experiment", marks: 3, notes: "Burette handling, pipette use, indicator color change" },
          { step: "Recording Concordant Readings in Tabular Column", marks: 1, notes: "Initial, final, and titre volume in cm3" },
          { step: "Accuracy of Titre Value: Within ±0.3 cm³ error", marks: 3, notes: "±0.4 cm³ = 2M | ±0.5 cm³ = 1M | >=±0.6 cm³ = 0M" },
          { step: "Formula for Molarity Calculation", marks: 1, notes: "a1M1V1 = a2M2V2 or equivalent stoichiometry" },
          { step: "Numerical Substitution", marks: 1, notes: "Plugging in experimental titre volume and FAS molarity" },
          { step: "Final Molarity Result with Correct Unit (M or mol/dm³)", marks: 1, notes: "Rounded to appropriate decimal places" },
        ]
      },
      {
        title: "Regularity & Certification",
        marks: 10,
        description: "Institute verified attendance and signed practical log.",
        breakdown: [
          { step: "Attendance of both Theory and Practical classes >= 75%", marks: 5, notes: "Official board minimum requirement" },
          { step: "Submission of duly completed and certified record", marks: 5, notes: "Signed experiment index and complete write-ups" },
        ]
      }
    ],
    suggestedSaltsOrApparatus: [
      "NH4Br", "NH4Cl", "Al2(SO4)3", "MnSO4", "ZnSO4 / ZnCO3", 
      "BaCl2 / Ba(NO3)2", "Sr(NO3)2", "CaCO3", "MgSO4 / MgCO3"
    ],
    curriculumList: [
      { expNo: 1, title: "Molarity of KMnO4 by titrating against 0.1 M Ferrous Ammonium Sulphate (FAS)" },
      { expNo: 2, title: "Molarity of KMnO4 by titrating against 0.1 M Oxalic Acid solution" },
      { expNo: 3, title: "Systematic qualitative analysis of simple Inorganic Salt (General Procedure)" },
      { expNo: 4, title: "Qualitative analysis of simple inorganic salt 1 and 2" },
      { expNo: 5, title: "Qualitative analysis of simple inorganic salt 3 and 4" },
      { expNo: 6, title: "Qualitative analysis of simple inorganic salt 5 and 6" },
      { expNo: 7, title: "Qualitative analysis of simple inorganic salt 7 and 8" },
      { expNo: 8, title: "Qualitative analysis of simple inorganic salt 9 and 10" },
      { expNo: 9, title: "Tests for functional groups in organic compounds" },
      { expNo: 10, title: "Effect of concentration on reaction rate between sodium thiosulphate and HCl" },
      { expNo: 11, title: "Effect of temperature on reaction rate between sodium thiosulphate and HCl" },
      { expNo: 12, title: "Determination of enthalpy of solution of KNO3 or CuSO4" },
      { expNo: 13, title: "Determination of enthalpy of neutralization of HCl and NaOH" },
      { expNo: 14, title: "Determination of enthalpy change on mixing Chloroform and Acetone" },
      { expNo: 15, title: "Variation in cell potential of Zn | Zn2+ || Cu2+ | Cu with electrolyte concentration" },
      { expNo: 16, title: "Paper chromatography: separation of pigments in leaves and flowers & Rf values" },
      { expNo: 17, title: "Paper chromatography: separation of inorganic cations (Pb2+ and Cd2+)" },
      { expNo: 18, title: "Preparation of Ferrous Ammonium Sulphate crystals (Mohr's Salt)" },
      { expNo: 19, title: "Preparation of Potash Alum" },
      { expNo: 20, title: "Preparation of Dibenzal acetone (Dibenzylidene acetone)" },
      { expNo: 21, title: "Preparation of p-nitroacetanilide from acetanilide" },
      { expNo: 22, title: "Preparation of phenyl azo beta-naphthol (azo dye)" },
    ]
  }
}
