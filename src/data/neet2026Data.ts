/**
 * NEET 2026 Real Extracted Data — Generated from KEA PDFs
 * Source: 4 allotment PDFs + 2 fee structure PDFs
 * 
 * This module loads the extracted JSON cutoff + fee data and provides
 * typed, indexed access for all NEET tools.
 */

// ===================== TYPES =====================

export interface NeetAllotmentRecord {
  sl_no: number;
  all_india_rank: number | null;
  course_code: string;
  college_code: string;
  college_name: string;
  course_name: string;
  course_type: string;
  seat_type: string;
  allotted_category: string;
  course_fees: number | null;
  status: string;
}

export interface NeetCutoffEntry {
  course_code: string;
  college_code: string;
  college_name: string;
  course_name: string;
  course_type: string;
  seat_type: string;
  allotted_category: string;
  course_fees: number | null;
  opening_rank: number;
  closing_rank: number;
  total_allotted: number;
}

export interface NeetFeeEntry {
  sl_no: number;
  college_code: string;
  college_name: string;
  college_type: string;
  govt_fees: number;
  private_fees: number;
  management_fees: number;
  nri_fees: number;
  course: string;
}

// ===================== RAW DATA IMPORTS =====================
// These JSON files are in the public folder, loaded at build time via vite

import medicalFinalCutoffs from './neet2026/cutoffs_medical_r1_final.json';
import medicalMockCutoffs from './neet2026/cutoffs_medical_r1_mock.json';
import dentalFinalCutoffs from './neet2026/cutoffs_dental_r1_final.json';
import dentalMockCutoffs from './neet2026/cutoffs_dental_r1_mock.json';
import feeStructureAll from './neet2026/fee_structure_all.json';

// ===================== TYPED EXPORTS =====================

export const MEDICAL_FINAL_CUTOFFS = medicalFinalCutoffs as NeetCutoffEntry[];
export const MEDICAL_MOCK_CUTOFFS = medicalMockCutoffs as NeetCutoffEntry[];
export const DENTAL_FINAL_CUTOFFS = dentalFinalCutoffs as NeetCutoffEntry[];
export const DENTAL_MOCK_CUTOFFS = dentalMockCutoffs as NeetCutoffEntry[];
export const FEE_STRUCTURE = feeStructureAll as NeetFeeEntry[];

// ===================== DERIVED LOOKUPS =====================

/** All unique college codes with names, across medical + dental */
export interface CollegeInfo {
  code: string;
  name: string;
  courseTypes: Set<string>;
  seatTypes: Set<string>;
  categories: Set<string>;
}

function buildCollegeLookup(cutoffs: NeetCutoffEntry[]): Map<string, CollegeInfo> {
  const map = new Map<string, CollegeInfo>();
  for (const c of cutoffs) {
    const existing = map.get(c.college_code);
    if (existing) {
      existing.courseTypes.add(c.course_type);
      existing.seatTypes.add(c.seat_type);
      existing.categories.add(c.allotted_category);
    } else {
      map.set(c.college_code, {
        code: c.college_code,
        name: c.college_name,
        courseTypes: new Set([c.course_type]),
        seatTypes: new Set([c.seat_type]),
        categories: new Set([c.allotted_category]),
      });
    }
  }
  return map;
}

export const MEDICAL_COLLEGES = buildCollegeLookup(MEDICAL_FINAL_CUTOFFS);
export const DENTAL_COLLEGES = buildCollegeLookup(DENTAL_FINAL_CUTOFFS);

/** All unique categories across the dataset */
export const ALL_CATEGORIES = Array.from(
  new Set([
    ...MEDICAL_FINAL_CUTOFFS.map(c => c.allotted_category),
    ...DENTAL_FINAL_CUTOFFS.map(c => c.allotted_category),
  ])
).sort();

/** Fee lookup by college code */
export const FEE_BY_CODE = new Map<string, NeetFeeEntry>();
for (const fee of FEE_STRUCTURE) {
  FEE_BY_CODE.set(fee.college_code, fee);
}

/** Top most common categories in KEA */
export const TOP_CATEGORIES = [
  "GM",
  "GMR",
  "GMH",
  "OPN",
  "GMP",
  "2AG",
  "2BG",
  "3AG",
  "3BG",
  "S1G",
  "S2G",
  "STG",
  "NRI",
  "1G",
  "PHM",
];

// ===================== CATEGORY LABELS =====================

export const CATEGORY_LABELS: Record<string, string> = {
  'GM': 'General Merit',
  'GMR': 'General Merit - Rural',
  'GMH': 'General Merit - HK (371J)',
  'GMK': 'General Merit - Kannada Medium',
  'GMP': 'General Merit - Private',
  'GMPH': 'GM Private - HK',
  'GMRH': 'GM Rural - HK',
  'OPN': 'Open (All-India)',
  '1G': 'Category 1',
  '2AG': 'Category 2A',
  '2AR': 'Cat 2A - Rural',
  '2AH': 'Cat 2A - HK',
  '2BG': 'Category 2B',
  '2BR': 'Cat 2B - Rural',
  '2BH': 'Cat 2B - HK',
  '3AG': 'Category 3A',
  '3AR': 'Cat 3A - Rural',
  '3AH': 'Cat 3A - HK',
  '3BG': 'Category 3B',
  '3BR': 'Cat 3B - Rural',
  '3BH': 'Cat 3B - HK',
  'S1G': 'SC (Sub-cat 1)',
  'S1R': 'SC1 - Rural',
  'S1H': 'SC1 - HK',
  'S2G': 'SC (Sub-cat 2)',
  'S2R': 'SC2 - Rural',
  'S2H': 'SC2 - HK',
  'S3G': 'SC (Sub-cat 3)',
  'S3R': 'SC3 - Rural',
  'STG': 'Scheduled Tribe',
  'STR': 'ST - Rural',
  'STH': 'ST - HK',
  'NRI': 'NRI Quota',
  'MA': 'Minority-A',
  'MU': 'Minority-Urdu',
  'MEH': 'Minority-HK',
  'PHM': 'Physically Handicapped',
};

export function getCategoryLabel(code: string): string {
  return CATEGORY_LABELS[code] || code;
}

// ===================== HELPER FUNCTIONS =====================

/** Get cutoffs for a specific college, optionally filtered */
export function getCollegeCutoffs(
  collegeCode: string,
  dataset: 'medical_final' | 'medical_mock' | 'dental_final' | 'dental_mock' = 'medical_final',
  category?: string,
  seatType?: string,
): NeetCutoffEntry[] {
  const source = {
    medical_final: MEDICAL_FINAL_CUTOFFS,
    medical_mock: MEDICAL_MOCK_CUTOFFS,
    dental_final: DENTAL_FINAL_CUTOFFS,
    dental_mock: DENTAL_MOCK_CUTOFFS,
  }[dataset];

  return source.filter(c => {
    if (c.college_code !== collegeCode) return false;
    if (category && c.allotted_category !== category) return false;
    if (seatType && c.seat_type !== seatType) return false;
    return true;
  });
}

/** Find all colleges a student with given rank can get into */
export function findEligibleColleges(
  rank: number,
  category: string,
  courseType: 'MBBS' | 'BDS' = 'MBBS',
  dataset: 'medical_final' | 'medical_mock' | 'dental_final' | 'dental_mock' = 'medical_final',
): NeetCutoffEntry[] {
  const source = {
    medical_final: MEDICAL_FINAL_CUTOFFS,
    medical_mock: MEDICAL_MOCK_CUTOFFS,
    dental_final: DENTAL_FINAL_CUTOFFS,
    dental_mock: DENTAL_MOCK_CUTOFFS,
  }[dataset];

  return source
    .filter(c => {
      if (c.allotted_category !== category) return false;
      if (courseType === 'MBBS' && c.course_type !== 'MBBS') return false;
      if (courseType === 'BDS' && c.course_type !== 'BDS') return false;
      return rank <= c.closing_rank;
    })
    .sort((a, b) => a.closing_rank - b.closing_rank);
}

/** Get mock vs final cutoff comparison for a college */
export function getMockVsFinal(
  collegeCode: string,
  category: string,
  type: 'medical' | 'dental' = 'medical',
): { mock: NeetCutoffEntry | null; final: NeetCutoffEntry | null; shift: number | null } {
  const mockSrc = type === 'medical' ? MEDICAL_MOCK_CUTOFFS : DENTAL_MOCK_CUTOFFS;
  const finalSrc = type === 'medical' ? MEDICAL_FINAL_CUTOFFS : DENTAL_FINAL_CUTOFFS;

  const mock = mockSrc.find(c => c.college_code === collegeCode && c.allotted_category === category && c.seat_type === 'Government') || null;
  const final = finalSrc.find(c => c.college_code === collegeCode && c.allotted_category === category && c.seat_type === 'Government') || null;

  const shift = mock && final ? final.closing_rank - mock.closing_rank : null;
  return { mock, final, shift };
}

/** Format fees in Indian locale */
export function formatFee(amount: number): string {
  if (amount === 0) return '—';
  return '₹' + amount.toLocaleString('en-IN');
}

/** Get total 5-year cost estimate */
export function get5YearCost(annualFee: number): number {
  return annualFee * 5; // MBBS is ~4.5 years + internship but fee is 4-5 years
}
