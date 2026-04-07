export interface ComedkRawPoint {
  marks: number;
  rank: number;
  source: "post" | "comment" | "trend";
}

export interface ComedkPrediction {
  marks: number;
  expectedRank: number;
  optimisticRank: number;
  pessimisticRank: number;
  confidence: "Low" | "Medium" | "High";
  percentile: string;
  nearbySampleCount: number;
}

interface CurvePoint {
  marks: number;
  expected: number;
  q25: number;
  q75: number;
  samples: number;
}

export const COMEDK_REDDIT_SOURCE_URL = "https://www.reddit.com/r/comedk/comments/1l66im4/marks_vs_rank_2025/";

// Community-sourced points from the post table and explicit comment updates in the same thread.
// Exact duplicate (marks, rank) pairs are removed when building the curve.
const COMEDK_2025_COMMUNITY_RAW: ComedkRawPoint[] = [
  { marks: 146, rank: 59, source: "post" },
  { marks: 140, rank: 109, source: "post" },
  { marks: 134, rank: 386, source: "post" },
  { marks: 132, rank: 398, source: "post" },
  { marks: 130, rank: 572, source: "post" },
  { marks: 130, rank: 648, source: "post" },
  { marks: 126, rank: 597, source: "post" },
  { marks: 124, rank: 2078, source: "post" },
  { marks: 123, rank: 2459, source: "post" },
  { marks: 122, rank: 1271, source: "post" },
  { marks: 120, rank: 1600, source: "post" },
  { marks: 120, rank: 1568, source: "post" },
  { marks: 117, rank: 799, source: "post" },
  { marks: 117, rank: 781, source: "post" },
  { marks: 117, rank: 2019, source: "post" },
  { marks: 114, rank: 1930, source: "post" },
  { marks: 113, rank: 1243, source: "post" },
  { marks: 113, rank: 2851, source: "post" },
  { marks: 112, rank: 3162, source: "post" },
  { marks: 112, rank: 2270, source: "post" },
  { marks: 112, rank: 2311, source: "post" },
  { marks: 112, rank: 1320, source: "post" },
  { marks: 112, rank: 3191, source: "post" },
  { marks: 110, rank: 2754, source: "post" },
  { marks: 110, rank: 3580, source: "post" },
  { marks: 109, rank: 1827, source: "post" },
  { marks: 108, rank: 2017, source: "post" },
  { marks: 103, rank: 4869, source: "post" },
  { marks: 103, rank: 3091, source: "post" },
  { marks: 103, rank: 3064, source: "post" },
  { marks: 103, rank: 4913, source: "post" },
  { marks: 103, rank: 11800, source: "post" },
  { marks: 101, rank: 13500, source: "post" },
  { marks: 100, rank: 14361, source: "post" },
  { marks: 99, rank: 4208, source: "post" },
  { marks: 99, rank: 15202, source: "post" },
  { marks: 97, rank: 7450, source: "post" },
  { marks: 96, rank: 17566, source: "post" },
  { marks: 95, rank: 5938, source: "post" },
  { marks: 95, rank: 9918, source: "post" },
  { marks: 94, rank: 10250, source: "post" },
  { marks: 93, rank: 20555, source: "post" },
  { marks: 90, rank: 8200, source: "post" },
  { marks: 89, rank: 8777, source: "post" },
  { marks: 89, rank: 12767, source: "post" },
  { marks: 89, rank: 17022, source: "post" },
  { marks: 87, rank: 15559, source: "post" },
  { marks: 85, rank: 15300, source: "post" },
  { marks: 85, rank: 31000, source: "post" },
  { marks: 84, rank: 18440, source: "post" },
  { marks: 84, rank: 32819, source: "post" },
  { marks: 83, rank: 13466, source: "post" },
  { marks: 82, rank: 18100, source: "post" },
  { marks: 82, rank: 19900, source: "post" },
  { marks: 80, rank: 19997, source: "post" },
  { marks: 79, rank: 21800, source: "post" },
  { marks: 77, rank: 23000, source: "post" },
  { marks: 77, rank: 43612, source: "post" },
  { marks: 72, rank: 25000, source: "post" },
  { marks: 69, rank: 36388, source: "post" },
  { marks: 69, rank: 36556, source: "post" },
  { marks: 67, rank: 37261, source: "post" },
  { marks: 67, rank: 63000, source: "post" },
  { marks: 64, rank: 38150, source: "post" },
  { marks: 63, rank: 45000, source: "post" },
  { marks: 62, rank: 49500, source: "post" },
  { marks: 61, rank: 50000, source: "post" },
  { marks: 60, rank: 52000, source: "post" },
  { marks: 59, rank: 48000, source: "post" },
  { marks: 56, rank: 57000, source: "post" },
  { marks: 55, rank: 66000, source: "post" },
  { marks: 53, rank: 77993, source: "post" },
  { marks: 52, rank: 71661, source: "post" },
  { marks: 50, rank: 84581, source: "post" },
  { marks: 47, rank: 93976, source: "post" },
  { marks: 147, rank: 5, source: "comment" },
  { marks: 143, rank: 68, source: "comment" },
  { marks: 116, rank: 1647, source: "comment" },
  { marks: 106, rank: 3800, source: "comment" },
  { marks: 105, rank: 5000, source: "comment" },
  { marks: 98, rank: 4700, source: "comment" },
  { marks: 92, rank: 7250, source: "comment" },
  { marks: 85, rank: 11000, source: "comment" },
  { marks: 82, rank: 13326, source: "comment" },
  { marks: 81, rank: 18800, source: "comment" },
  { marks: 81, rank: 37100, source: "comment" },
];

function dedupePoints(points: ComedkRawPoint[]): ComedkRawPoint[] {
  const seen = new Set<string>();
  const out: ComedkRawPoint[] = [];
  for (const p of points) {
    const key = `${p.marks}|${p.rank}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

// Midpoints of widely published 2025 marks-vs-rank band tables (used as soft anchors, not official COMEDK).
const COMEDK_2025_TREND_ANCHORS: ComedkRawPoint[] = [
  { marks: 175, rank: 5, source: "trend" },
  { marks: 165, rank: 30, source: "trend" },
  { marks: 155, rank: 100, source: "trend" },
  { marks: 145, rank: 250, source: "trend" },
  { marks: 135, rank: 575, source: "trend" },
  { marks: 125, rank: 1250, source: "trend" },
  { marks: 115, rank: 2450, source: "trend" },
  { marks: 105, rank: 4350, source: "trend" },
  { marks: 95, rank: 7600, source: "trend" },
  { marks: 85, rank: 11850, source: "trend" },
  { marks: 75, rank: 18500, source: "trend" },
  { marks: 65, rank: 29500, source: "trend" },
  { marks: 55, rank: 40500, source: "trend" },
  { marks: 45, rank: 52000, source: "trend" },
];

/** Deduplicated community points (exported for transparency). */
export const COMEDK_2025_COMMUNITY_POINTS: ComedkRawPoint[] = dedupePoints(COMEDK_2025_COMMUNITY_RAW);

function buildWeightedCurveInput(): ComedkRawPoint[] {
  const community = COMEDK_2025_COMMUNITY_POINTS;
  const trend = COMEDK_2025_TREND_ANCHORS;
  const weighted: ComedkRawPoint[] = [];
  for (const p of community) {
    weighted.push(p, p);
  }
  for (const p of trend) {
    weighted.push(p);
  }
  return weighted;
}

const ESTIMATED_TOTAL_CANDIDATES = 120000;

function quantile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function buildCurve(points: ComedkRawPoint[]): CurvePoint[] {
  const grouped = new Map<number, number[]>();
  for (const point of points) {
    if (!grouped.has(point.marks)) grouped.set(point.marks, []);
    grouped.get(point.marks)!.push(point.rank);
  }

  const marks = [...grouped.keys()].sort((a, b) => a - b);
  const curve = marks.map((mark) => {
    const ranks = grouped.get(mark)!;
    return {
      marks: mark,
      expected: Math.round(quantile(ranks, 0.5)),
      q25: Math.round(quantile(ranks, 0.25)),
      q75: Math.round(quantile(ranks, 0.75)),
      samples: ranks.length,
    };
  });

  const blocks = curve.map((point, index) => ({
    start: index,
    end: index,
    weight: Math.max(1, point.samples),
    value: -point.expected,
  }));

  for (let index = 0; index < blocks.length - 1; ) {
    if (blocks[index].value <= blocks[index + 1].value) {
      index += 1;
      continue;
    }

    const mergedWeight = blocks[index].weight + blocks[index + 1].weight;
    const mergedValue =
      (blocks[index].value * blocks[index].weight + blocks[index + 1].value * blocks[index + 1].weight) /
      mergedWeight;

    blocks[index] = {
      start: blocks[index].start,
      end: blocks[index + 1].end,
      weight: mergedWeight,
      value: mergedValue,
    };
    blocks.splice(index + 1, 1);
    if (index > 0) index -= 1;
  }

  const smoothed = Array.from({ length: curve.length }, () => 0);
  for (const block of blocks) {
    for (let idx = block.start; idx <= block.end; idx += 1) {
      smoothed[idx] = Math.round(-block.value);
    }
  }

  return curve.map((point, index) => ({
    ...point,
    expected: smoothed[index],
  }));
}

const COMEDK_CURVE = buildCurve(buildWeightedCurveInput());

/** Piecewise linear rank from trend anchors only (for extrapolation outside the fitted curve). */
function interpolateTrendOnly(marks: number): number {
  const pts = [...COMEDK_2025_TREND_ANCHORS].sort((a, b) => a.marks - b.marks);
  if (marks <= pts[0].marks) {
    return Math.min(120000, Math.round(pts[0].rank + (pts[0].marks - marks) * 1400));
  }
  if (marks >= pts[pts.length - 1].marks) {
    return Math.max(1, Math.round(pts[pts.length - 1].rank - (marks - pts[pts.length - 1].marks) * 1.2));
  }
  for (let i = 0; i < pts.length - 1; i += 1) {
    if (marks >= pts[i].marks && marks <= pts[i + 1].marks) {
      const t = (marks - pts[i].marks) / (pts[i + 1].marks - pts[i].marks);
      return Math.round(pts[i].rank + t * (pts[i + 1].rank - pts[i].rank));
    }
  }
  return pts[pts.length - 1].rank;
}

function interpolate(points: CurvePoint[], marks: number, key: keyof CurvePoint): number {
  const first = points[0];
  const last = points[points.length - 1];
  const firstValue = Number(first[key]);
  const lastValue = Number(last[key]);

  if (marks <= first.marks) return firstValue;
  if (marks >= last.marks) return lastValue;

  for (let index = 0; index < points.length - 1; index += 1) {
    const left = points[index];
    const right = points[index + 1];
    if (marks < left.marks || marks > right.marks) continue;
    if (left.marks === right.marks) return Number(left[key]);

    const t = (marks - left.marks) / (right.marks - left.marks);
    return Number(left[key]) + (Number(right[key]) - Number(left[key])) * t;
  }

  return lastValue;
}

function blendExpectedWithTrend(marks: number, curveExpected: number): number {
  const trend = interpolateTrendOnly(marks);
  const minM = COMEDK_CURVE[0].marks;
  const maxM = COMEDK_CURVE[COMEDK_CURVE.length - 1].marks;
  let w = 0;
  if (marks < minM + 5) {
    w = Math.min(1, (minM + 5 - marks) / 12);
  } else if (marks > maxM - 5) {
    w = Math.min(1, (marks - (maxM - 5)) / 12);
  }
  return curveExpected * (1 - w) + trend * w;
}

function nearbySamples(marks: number) {
  return COMEDK_2025_COMMUNITY_POINTS.filter((point) => Math.abs(point.marks - marks) <= 2).length;
}

export function predictComedkRankFromMarks(marks: number): ComedkPrediction {
  if (!Number.isFinite(marks) || marks < 0 || marks > 180) {
    throw new Error("Marks must be between 0 and 180.");
  }

  const expectedBase = interpolate(COMEDK_CURVE, marks, "expected");
  const q25Base = interpolate(COMEDK_CURVE, marks, "q25");
  const q75Base = interpolate(COMEDK_CURVE, marks, "q75");

  const expectedRaw = blendExpectedWithTrend(marks, expectedBase);
  const scale = expectedBase > 0 ? expectedRaw / expectedBase : 1;
  const q25Raw = Math.max(1, q25Base * scale);
  const q75Raw = Math.max(1, q75Base * scale);
  const sampleCount = nearbySamples(marks);

  const spread = Math.max(800, Math.round(Math.abs(q75Raw - q25Raw) * 1.1));
  const expectedRank = Math.max(1, Math.round(expectedRaw));
  const optimisticRank = Math.max(1, Math.round(expectedRank - spread * 0.55));
  const pessimisticRank = Math.max(1, Math.round(expectedRank + spread * 0.8));

  const confidence: ComedkPrediction["confidence"] =
    sampleCount >= 10 ? "High" : sampleCount >= 5 ? "Medium" : "Low";

  const percentile = (((ESTIMATED_TOTAL_CANDIDATES - expectedRank) / ESTIMATED_TOTAL_CANDIDATES) * 100)
    .toFixed(2)
    .concat("%");

  return {
    marks: Math.round(marks * 10) / 10,
    expectedRank,
    optimisticRank,
    pessimisticRank,
    confidence,
    percentile,
    nearbySampleCount: sampleCount,
  };
}

export function getComedkCurveSnapshot() {
  return COMEDK_CURVE;
}

export function getComedkKeyEstimates() {
  const checkpoints = [60, 70, 80, 90, 100, 110, 120, 130, 140];
  return checkpoints.map((marks) => {
    const p = predictComedkRankFromMarks(marks);
    return {
      marks,
      expectedRank: p.expectedRank,
      range: `${p.optimisticRank.toLocaleString()} - ${p.pessimisticRank.toLocaleString()}`,
    };
  });
}
