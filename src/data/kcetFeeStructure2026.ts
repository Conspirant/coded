/**
 * Official KEA (Karnataka Examinations Authority) Provisional Fee Structure 2026-27
 * Source: Provisional Fee Structure UGCET 2026-27 (Date: 01-07-2026)
 * & Provisional Fee Structure for Agriculture / Veterinary / Fisheries & Dairy Science 2026-27
 */

export interface EngineeringFeeItem {
  id: string
  name: string
  description: string
  category: "govt" | "aided" | "uvce" | "vtu_constituent" | "unaided_type1" | "unaided_type2" | "deemed" | "management"
  courseType: "engineering" | "architecture" | "both"
  // Fee for GM, 2A, 2B, 3A, 3B + SC/ST (>10L) + Cat-1 (>2.5L)
  generalFee: number
  // SNQ fee (null if not offered/applicable)
  snqFee: number | null
  // SC/ST annual income <= 10 Lakhs
  scStLowIncomeFee: number
  // Category-1 annual income <= 2.5 Lakhs
  cat1LowIncomeFee: number
  // Component breakdown
  universityFeeEngg: number
  universityFeeArch: number
  otherFees: number // 10590 for Govt/Aided, 20000 for Unaided/Pvt/Deemed
  notes?: string
}

export interface FarmScienceFeeItem {
  id: string
  courseName: string
  stream: "agriculture" | "veterinary" | "fisheries_dairy"
  collegeType: string
  frequency: "per_semester" | "annual"
  durationYears: number
  generalFee: number // GM, 2A, 2B, 3A, 3B, CAT-1
  scStLowIncomeFee: number // SC/ST < 2.50 Lakhs
  scStHighIncomeFee: number // SC/ST > 2.50 Lakhs
  description: string
}

export const ENGINEERING_FEE_STRUCTURE_2026: EngineeringFeeItem[] = [
  {
    id: "govt_general",
    name: "Government Colleges (General Branches)",
    description: "Government Engineering Colleges (CSE, ISE, ECE, AI/ML, Data Science, etc.)",
    category: "govt",
    courseType: "both",
    generalFee: 47100,
    snqFee: 22910,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 24150,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 10590,
    notes: "Includes ₹12,320 University Fee & ₹10,590 Other Fees."
  },
  {
    id: "govt_concession",
    name: "Government Colleges (Mechanical / Textile / Silk / Civil / Automobile)",
    description: "Subsidized core branches in Government Engineering Colleges",
    category: "govt",
    courseType: "engineering",
    generalFee: 29985,
    snqFee: 17910,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 12075,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 10590,
    notes: "Special subsidized fee for Mechanical, Textile, Silk Technology, Civil & Automobile."
  },
  {
    id: "aided_courses",
    name: "Aided Courses in Aided Colleges",
    description: "Government-Aided seats in colleges like RVCE, BMSCE, MSRIT, NIE, SJCE",
    category: "aided",
    courseType: "both",
    generalFee: 47100,
    snqFee: null,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 24150,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 10590,
    notes: "Aided seats only. SNQ not applicable on aided quota."
  },
  {
    id: "uvce",
    name: "UVCE (University Visvesvaraya College of Engineering)",
    description: "Autonomous State Engineering University (Bangalore)",
    category: "uvce",
    courseType: "both",
    generalFee: 56500,
    snqFee: null,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 33600,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 10590,
    notes: "Autonomous university fee structure under KEA."
  },
  {
    id: "vtu_constituent",
    name: "VTU Constituent Colleges (Higher Fees)",
    description: "VTU Constituent Colleges (e.g. UBDTCE Davangere Higher Fee Seats)",
    category: "vtu_constituent",
    courseType: "both",
    generalFee: 110910,
    snqFee: 22910,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 86760,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 10590,
    notes: "VTU constituent higher fee structure."
  },
  {
    id: "unaided_type1",
    name: "Type-1 Unaided Colleges & Unaided Courses in Aided Colleges",
    description: "Private engineering colleges & un-aided streams (Type-1 Band)",
    category: "unaided_type1",
    courseType: "both",
    generalFee: 120320,
    snqFee: 32320,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 96170,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 20000,
    notes: "Includes ₹12,320 University Fee & ₹20,000 Other Fees."
  },
  {
    id: "unaided_type2",
    name: "Type-2 Unaided Colleges & Unaided Courses in Aided Colleges",
    description: "Private engineering colleges (Standard Type-2 Band)",
    category: "unaided_type2",
    courseType: "both",
    generalFee: 130320,
    snqFee: 32320,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 106170,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 20000,
    notes: "Includes ₹12,320 University Fee & ₹20,000 Other Fees."
  },
  {
    id: "deemed_band1",
    name: "Deemed / Private Universities (Band 1)",
    description: "KCET quota in private deemed universities (Band 1)",
    category: "deemed",
    courseType: "both",
    generalFee: 120320,
    snqFee: null,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 96170,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 20000,
    notes: "Deemed/Private University KCET Quota Tier 1."
  },
  {
    id: "deemed_band2",
    name: "Deemed / Private Universities (Band 2)",
    description: "KCET quota in private deemed universities (e.g. PES, REVA, RUAS)",
    category: "deemed",
    courseType: "both",
    generalFee: 130320,
    snqFee: null,
    scStLowIncomeFee: 0,
    cat1LowIncomeFee: 106170,
    universityFeeEngg: 12320,
    universityFeeArch: 13070,
    otherFees: 20000,
    notes: "Deemed/Private University KCET Quota Tier 2."
  },
  {
    id: "management_quota",
    name: "Management / COMEDK Quota (Reference Estimate)",
    description: "Direct management or COMEDK admission (varies by college)",
    category: "management",
    courseType: "both",
    generalFee: 260000,
    snqFee: null,
    scStLowIncomeFee: 260000,
    cat1LowIncomeFee: 260000,
    universityFeeEngg: 15000,
    universityFeeArch: 15000,
    otherFees: 25000,
    notes: "Non-KEA quota for comparison purposes only."
  }
]

export const FARM_SCIENCE_FEE_STRUCTURE_2026: FarmScienceFeeItem[] = [
  {
    id: "agri_govt",
    courseName: "B.Sc. (Agriculture) / Horticulture / Forestry",
    stream: "agriculture",
    collegeType: "Government Colleges (UAS Bangalore, Dharwad, Bagalkot, Shivamogga)",
    frequency: "per_semester",
    durationYears: 4,
    generalFee: 43790,
    scStLowIncomeFee: 0,
    scStHighIncomeFee: 43790,
    description: "Government Farm Science colleges per semester fee"
  },
  {
    id: "agri_private",
    courseName: "B.Sc. (Agriculture) - Private Colleges",
    stream: "agriculture",
    collegeType: "Private Colleges (Except KLE)",
    frequency: "per_semester",
    durationYears: 4,
    generalFee: 66550,
    scStLowIncomeFee: 66550,
    scStHighIncomeFee: 66550,
    description: "Private Farm Science colleges per semester fee"
  },
  {
    id: "agri_kle",
    courseName: "B.Sc. (Agriculture) - KLE College",
    stream: "agriculture",
    collegeType: "KLE College of Agricultural Science",
    frequency: "per_semester",
    durationYears: 4,
    generalFee: 60500,
    scStLowIncomeFee: 60500,
    scStHighIncomeFee: 60500,
    description: "KLE College of Agricultural Science per semester fee"
  },
  {
    id: "veterinary_govt",
    courseName: "B.V.Sc & AH (Veterinary Science)",
    stream: "veterinary",
    collegeType: "Government Veterinary Colleges (KVAFSU Hebbal, Bidar, Hassan, Shimoga)",
    frequency: "annual",
    durationYears: 5,
    generalFee: 89880,
    scStLowIncomeFee: 20210,
    scStHighIncomeFee: 89880,
    description: "Government Veterinary colleges annual fee"
  },
  {
    id: "fisheries_dairy_govt",
    courseName: "B.F.Sc (Fisheries & Dairy Science)",
    stream: "fisheries_dairy",
    collegeType: "Government Fisheries & Dairy Colleges (Mangalore, Bangalore, Kalaburagi)",
    frequency: "per_semester",
    durationYears: 4,
    generalFee: 43455,
    scStLowIncomeFee: 12890,
    scStHighIncomeFee: 43455,
    description: "Government Fisheries & Dairy Science colleges per semester fee"
  }
]

export const KEA_FEE_METADATA_2026 = {
  academicYear: "2026-27",
  effectiveDate: "01-07-2026",
  architectureExtraFee: 750,
  engineeringUniversityFee: 12320,
  architectureUniversityFee: 13070,
  govtAidedOtherFee: 10590,
  unaidedPvtOtherFee: 20000,
  portalUrl: "https://cetonline.karnataka.gov.in/kea/",
  helpline: "080-23 460 460"
}
