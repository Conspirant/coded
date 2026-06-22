/**
 * ROI (Return on Investment) Score computation for KCET colleges.
 * 
 * The ROI score (0-100) helps CET aspirants understand value for money.
 * 
 * Formula weights:
 *  - avgPackage      → 35%  (primary indicator of placement quality)
 *  - placementRate   → 20%  (how many students get placed)
 *  - feeFactor       → 20%  (lower fees = higher ROI)
 *  - naacFactor      → 15%  (quality accreditation)
 *  - autonomyBonus   → 10%  (autonomous status = better curricula)
 */

import type { CollegeInfo } from "@/data/collegeDatabase";

// NAAC grade to numeric score (out of 10)
const NAAC_SCORES: Record<string, number> = {
  'A++': 10,
  'A+': 9,
  'A': 8,
  'B++': 7,
  'B+': 6,
  'B': 5,
};

// Normalization bounds (derived from actual KCET college landscape)
const BOUNDS = {
  avgPackage: { min: 2, max: 20 },    // LPA
  placementRate: { min: 20, max: 100 }, // %
  fee: { min: 0.04, max: 20 },         // Lakhs
  naac: { min: 0, max: 10 },
};

/** Clamp and normalize a value to [0, 1] */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export interface ROIResult {
  score: number;          // 0-100
  grade: 'Excellent' | 'Good' | 'Average' | 'Below Average';
  color: string;          // Tailwind color class
  breakdown: {
    packageScore: number;
    placementScore: number;
    feeScore: number;
    naacScore: number;
    autonomyScore: number;
  };
}

/**
 * Compute ROI score for a college.
 * Returns null if insufficient data.
 */
export function computeROI(college: CollegeInfo): ROIResult | null {
  // Must have at least avgPackage and fee to compute ROI
  if (college.avgPackage == null && college.feeCetQuota == null) return null;

  const avgPkg = college.avgPackage ?? 3; // conservative default
  const placementPct = college.placementRate ?? 50; // conservative default
  const fee = college.feeCetQuota ?? 5; // mid-range default
  const naacVal = college.naacGrade ? (NAAC_SCORES[college.naacGrade] ?? 5) : 4;
  const autonomy = college.autonomous ? 1 : 0;

  // Normalize each factor to [0, 1]
  const packageNorm = normalize(avgPkg, BOUNDS.avgPackage.min, BOUNDS.avgPackage.max);
  const placementNorm = normalize(placementPct, BOUNDS.placementRate.min, BOUNDS.placementRate.max);
  const feeNorm = 1 - normalize(fee, BOUNDS.fee.min, BOUNDS.fee.max); // invert: lower is better
  const naacNorm = normalize(naacVal, BOUNDS.naac.min, BOUNDS.naac.max);

  // Weighted sum
  const raw =
    packageNorm * 0.35 +
    placementNorm * 0.20 +
    feeNorm * 0.20 +
    naacNorm * 0.15 +
    autonomy * 0.10;

  // Scale to 0-100, apply slight exponential curve to spread mid-range
  const score = Math.round(Math.pow(raw, 0.85) * 100);
  const clampedScore = Math.max(0, Math.min(100, score));

  let grade: ROIResult['grade'];
  let color: string;

  if (clampedScore >= 80) {
    grade = 'Excellent';
    color = 'text-emerald-400';
  } else if (clampedScore >= 60) {
    grade = 'Good';
    color = 'text-blue-400';
  } else if (clampedScore >= 40) {
    grade = 'Average';
    color = 'text-amber-400';
  } else {
    grade = 'Below Average';
    color = 'text-red-400';
  }

  return {
    score: clampedScore,
    grade,
    color,
    breakdown: {
      packageScore: Math.round(packageNorm * 100),
      placementScore: Math.round(placementNorm * 100),
      feeScore: Math.round(feeNorm * 100),
      naacScore: Math.round(naacNorm * 100),
      autonomyScore: autonomy * 100,
    },
  };
}

/**
 * Get the SVG arc path for a circular gauge.
 * Used by the ROI meter component.
 */
export function getArcPath(percentage: number, radius: number, cx: number, cy: number): string {
  const angle = (percentage / 100) * 270; // 270° arc (not full circle)
  const startAngle = 135; // start at bottom-left
  const endAngle = startAngle + angle;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const largeArc = angle > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
}

/**
 * Get gradient stop colors for the ROI gauge.
 */
export function getROIGradientColor(score: number): { start: string; end: string } {
  if (score >= 80) return { start: '#10b981', end: '#34d399' }; // emerald
  if (score >= 60) return { start: '#3b82f6', end: '#60a5fa' }; // blue
  if (score >= 40) return { start: '#f59e0b', end: '#fbbf24' }; // amber
  return { start: '#ef4444', end: '#f87171' }; // red
}
