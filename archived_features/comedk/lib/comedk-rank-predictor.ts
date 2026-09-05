export type ComedkShift = "10s1" | "10s2" | "10s3" | "25may" | "unknown";
export const COMEDK_SHIFTS: ComedkShift[] = ["10s1", "10s2", "10s3", "25may", "unknown"];

export interface ComedkRawPoint {
  marks: number;
  rank: number;
  source: "post" | "comment" | "trend";
  shift: ComedkShift;
}

export interface ComedkPrediction {
  marks: number;
  expectedRank: number;
  optimisticRank: number;
  pessimisticRank: number;
  confidence: "Low" | "Medium" | "High";
  percentile: string;
  nearbySampleCount: number;
  shiftUsed: ComedkShift;
}

interface CurvePoint {
  marks: number;
  expected: number;
  q25: number;
  q75: number;
  samples: number;
}

export const COMEDK_REDDIT_SOURCE_URL = "https://www.reddit.com/r/comedk/comments/1l66im4/marks_vs_rank_2025/";

const COMEDK_2025_COMMUNITY_RAW: ComedkRawPoint[] = [
  // 10s1
  { marks: 125, rank: 254, shift: "10s1", source: "post" },
  { marks: 121, rank: 470, shift: "10s1", source: "post" },
  { marks: 117, rank: 799, shift: "10s1", source: "post" },
  { marks: 117, rank: 781, shift: "10s1", source: "post" },
  { marks: 113, rank: 1243, shift: "10s1", source: "post" },
  { marks: 112, rank: 1320, shift: "10s1", source: "post" },
  { marks: 109, rank: 1827, shift: "10s1", source: "post" },
  { marks: 108, rank: 2017, shift: "10s1", source: "post" },
  { marks: 106, rank: 2420, shift: "10s1", source: "post" },
  { marks: 105, rank: 2500, shift: "10s1", source: "post" },
  { marks: 103, rank: 3091, shift: "10s1", source: "post" },
  { marks: 103, rank: 3064, shift: "10s1", source: "post" },
  { marks: 103, rank: 3100, shift: "10s1", source: "post" },
  { marks: 101, rank: 3600, shift: "10s1", source: "post" },
  { marks: 100, rank: 4000, shift: "10s1", source: "post" },
  { marks: 99, rank: 4208, shift: "10s1", source: "post" },
  { marks: 98, rank: 4700, shift: "10s1", source: "post" },
  { marks: 96, rank: 5500, shift: "10s1", source: "post" },
  { marks: 95, rank: 5938, shift: "10s1", source: "post" },
  { marks: 93, rank: 6700, shift: "10s1", source: "post" },
  { marks: 92, rank: 7250, shift: "10s1", source: "post" },
  { marks: 90, rank: 8200, shift: "10s1", source: "post" },
  { marks: 89, rank: 8100, shift: "10s1", source: "post" },
  { marks: 88, rank: 9400, shift: "10s1", source: "post" },
  { marks: 88, rank: 8800, shift: "10s1", source: "post" },
  { marks: 84, rank: 12400, shift: "10s1", source: "post" },
  { marks: 83, rank: 13400, shift: "10s1", source: "post" },
  { marks: 82, rank: 14300, shift: "10s1", source: "post" },
  { marks: 80, rank: 16000, shift: "10s1", source: "post" },
  { marks: 79, rank: 16000, shift: "10s1", source: "post" },
  { marks: 79, rank: 16600, shift: "10s1", source: "post" },
  { marks: 78, rank: 19000, shift: "10s1", source: "post" },
  { marks: 77, rank: 19000, shift: "10s1", source: "post" },
  { marks: 76, rank: 20000, shift: "10s1", source: "post" },
  { marks: 72, rank: 25000, shift: "10s1", source: "post" },
  { marks: 71, rank: 26000, shift: "10s1", source: "post" },
  { marks: 71, rank: 26000, shift: "10s1", source: "post" },
  { marks: 71, rank: 26000, shift: "10s1", source: "post" },
  { marks: 67, rank: 32500, shift: "10s1", source: "post" },
  { marks: 64, rank: 38363, shift: "10s1", source: "post" },
  { marks: 63, rank: 39000, shift: "10s1", source: "post" },
  { marks: 60, rank: 43000, shift: "10s1", source: "post" },
  { marks: 59, rank: 48000, shift: "10s1", source: "post" },
  { marks: 57, rank: 54000, shift: "10s1", source: "post" },
  { marks: 56, rank: 57000, shift: "10s1", source: "post" },
  { marks: 52, rank: 71661, shift: "10s1", source: "post" },

  // 10s2
  { marks: 126, rank: 597, shift: "10s2", source: "post" },
  { marks: 122, rank: 1300, shift: "10s2", source: "post" },
  { marks: 118, rank: 1390, shift: "10s2", source: "post" },
  { marks: 114, rank: 1950, shift: "10s2", source: "post" },
  { marks: 114, rank: 1930, shift: "10s2", source: "post" },
  { marks: 112, rank: 2270, shift: "10s2", source: "post" },
  { marks: 112, rank: 2311, shift: "10s2", source: "post" },
  { marks: 110, rank: 2754, shift: "10s2", source: "post" },
  { marks: 106, rank: 3800, shift: "10s2", source: "post" },
  { marks: 104, rank: 4500, shift: "10s2", source: "post" },
  { marks: 103, rank: 4869, shift: "10s2", source: "post" },
  { marks: 103, rank: 4900, shift: "10s2", source: "post" },
  { marks: 103, rank: 4913, shift: "10s2", source: "post" },
  { marks: 101, rank: 5700, shift: "10s2", source: "post" },
  { marks: 100, rank: 6000, shift: "10s2", source: "post" },
  { marks: 100, rank: 6210, shift: "10s2", source: "post" },
  { marks: 99, rank: 6600, shift: "10s2", source: "post" },
  { marks: 98, rank: 7000, shift: "10s2", source: "post" },
  { marks: 97, rank: 7450, shift: "10s2", source: "post" },
  { marks: 94, rank: 7400, shift: "10s2", source: "post" },
  { marks: 94, rank: 9770, shift: "10s2", source: "post" },
  { marks: 93, rank: 9700, shift: "10s2", source: "post" },
  { marks: 90, rank: 12000, shift: "10s2", source: "post" },
  { marks: 90, rank: 11000, shift: "10s2", source: "post" },
  { marks: 90, rank: 12000, shift: "10s2", source: "post" },
  { marks: 89, rank: 17022, shift: "10s2", source: "post" },
  { marks: 85, rank: 15300, shift: "10s2", source: "post" },
  { marks: 82, rank: 18100, shift: "10s2", source: "post" },
  { marks: 82, rank: 18000, shift: "10s2", source: "post" },
  { marks: 80, rank: 19997, shift: "10s2", source: "post" },
  { marks: 77, rank: 23000, shift: "10s2", source: "post" },
  { marks: 69, rank: 36388, shift: "10s2", source: "post" },
  { marks: 67, rank: 37261, shift: "10s2", source: "post" },
  { marks: 66, rank: 38000, shift: "10s2", source: "post" },
  { marks: 63, rank: 45000, shift: "10s2", source: "post" },
  { marks: 61, rank: 49800, shift: "10s2", source: "post" },
  { marks: 60, rank: 52000, shift: "10s2", source: "post" },
  { marks: 55, rank: 66000, shift: "10s2", source: "post" },
  { marks: 47, rank: 93976, shift: "10s2", source: "post" },

  // 10s3
  { marks: 146, rank: 59, shift: "10s3", source: "post" },
  { marks: 138, rank: 230, shift: "10s3", source: "post" },
  { marks: 132, rank: 398, shift: "10s3", source: "post" },
  { marks: 130, rank: 572, shift: "10s3", source: "post" },
  { marks: 122, rank: 1271, shift: "10s3", source: "post" },
  { marks: 120, rank: 1600, shift: "10s3", source: "post" },
  { marks: 120, rank: 1568, shift: "10s3", source: "post" },
  { marks: 119, rank: 1700, shift: "10s3", source: "post" },
  { marks: 117, rank: 2019, shift: "10s3", source: "post" },
  { marks: 114, rank: 2600, shift: "10s3", source: "post" },
  { marks: 113, rank: 2851, shift: "10s3", source: "post" },
  { marks: 112, rank: 3162, shift: "10s3", source: "post" },
  { marks: 112, rank: 3191, shift: "10s3", source: "post" },
  { marks: 110, rank: 3600, shift: "10s3", source: "post" },
  { marks: 110, rank: 3580, shift: "10s3", source: "post" },
  { marks: 110, rank: 3500, shift: "10s3", source: "post" },
  { marks: 107, rank: 4500, shift: "10s3", source: "post" },
  { marks: 106, rank: 4900, shift: "10s3", source: "post" },
  { marks: 105, rank: 5000, shift: "10s3", source: "post" },
  { marks: 103, rank: 6000, shift: "10s3", source: "post" },
  { marks: 95, rank: 9918, shift: "10s3", source: "post" },
  { marks: 94, rank: 10250, shift: "10s3", source: "post" },
  { marks: 90, rank: 12200, shift: "10s3", source: "post" },
  { marks: 87, rank: 15559, shift: "10s3", source: "post" },
  { marks: 84, rank: 18440, shift: "10s3", source: "post" },
  { marks: 84, rank: 18200, shift: "10s3", source: "post" },
  { marks: 83, rank: 19000, shift: "10s3", source: "post" },
  { marks: 82, rank: 19800, shift: "10s3", source: "post" },
  { marks: 82, rank: 19900, shift: "10s3", source: "post" },
  { marks: 79, rank: 21800, shift: "10s3", source: "post" },
  { marks: 74, rank: 28700, shift: "10s3", source: "post" },
  { marks: 69, rank: 22000, shift: "10s3", source: "post" },
  { marks: 69, rank: 36556, shift: "10s3", source: "post" },
  { marks: 67, rank: 39000, shift: "10s3", source: "post" },
  { marks: 67, rank: 40000, shift: "10s3", source: "post" },
  { marks: 63, rank: 47000, shift: "10s3", source: "post" },
  { marks: 62, rank: 49500, shift: "10s3", source: "post" },
  { marks: 61, rank: 50000, shift: "10s3", source: "post" },
  { marks: 53, rank: 77993, shift: "10s3", source: "post" },
  { marks: 53, rank: 73000, shift: "10s3", source: "post" },
  { marks: 50, rank: 84581, shift: "10s3", source: "post" },

  // 25may
  { marks: 140, rank: 109, shift: "25may", source: "post" },
  { marks: 134, rank: 386, shift: "25may", source: "post" },
  { marks: 130, rank: 648, shift: "25may", source: "post" },
  { marks: 124, rank: 2078, shift: "25may", source: "post" },
  { marks: 123, rank: 2459, shift: "25may", source: "post" },
  { marks: 103, rank: 11800, shift: "25may", source: "post" },
  { marks: 103, rank: 11800, shift: "25may", source: "post" },
  { marks: 101, rank: 13500, shift: "25may", source: "post" },
  { marks: 100, rank: 14361, shift: "25may", source: "post" },
  { marks: 99, rank: 15202, shift: "25may", source: "post" },
  { marks: 96, rank: 17566, shift: "25may", source: "post" },
  { marks: 93, rank: 20555, shift: "25may", source: "post" },
  { marks: 89, rank: 8777, shift: "25may", source: "post" },
  { marks: 85, rank: 31000, shift: "25may", source: "post" },
  { marks: 84, rank: 28200, shift: "25may", source: "post" },
  { marks: 84, rank: 32819, shift: "25may", source: "post" },
  { marks: 79, rank: 35000, shift: "25may", source: "post" },
  { marks: 77, rank: 43000, shift: "25may", source: "post" },
  { marks: 77, rank: 43612, shift: "25may", source: "post" },
  { marks: 74, rank: 50400, shift: "25may", source: "post" },
  { marks: 67, rank: 63000, shift: "25may", source: "post" },
  { marks: 65, rank: 63000, shift: "25may", source: "post" },

  // unknown
  { marks: 130, rank: 560, shift: "unknown", source: "post" },
  { marks: 102, rank: 5370, shift: "unknown", source: "post" },
  { marks: 86, rank: 10000, shift: "unknown", source: "post" },
  { marks: 86, rank: 10700, shift: "unknown", source: "post" },
  { marks: 85, rank: 11000, shift: "unknown", source: "post" },
  { marks: 83, rank: 13466, shift: "unknown", source: "post" },
  { marks: 74, rank: 18000, shift: "unknown", source: "post" },
  { marks: 64, rank: 38150, shift: "unknown", source: "post" },
  { marks: 63, rank: 45000, shift: "unknown", source: "post" },
  { marks: 57, rank: 51000, shift: "unknown", source: "post" },
  { marks: 147, rank: 5, shift: "unknown", source: "comment" },
  { marks: 143, rank: 68, shift: "unknown", source: "comment" },
  { marks: 116, rank: 1647, shift: "unknown", source: "comment" },
  { marks: 106, rank: 3800, shift: "unknown", source: "comment" },
  { marks: 105, rank: 5000, shift: "unknown", source: "comment" },
  { marks: 98, rank: 4700, shift: "unknown", source: "comment" },
  { marks: 92, rank: 7250, shift: "unknown", source: "comment" },
  { marks: 85, rank: 11000, shift: "unknown", source: "comment" },
  { marks: 82, rank: 13326, shift: "unknown", source: "comment" },
  { marks: 81, rank: 18800, shift: "unknown", source: "comment" },
  { marks: 81, rank: 37100, shift: "unknown", source: "comment" },
];

function dedupePoints(points: ComedkRawPoint[]): ComedkRawPoint[] {
  const seen = new Set<string>();
  const out: ComedkRawPoint[] = [];
  for (const p of points) {
    const key = `${p.marks}|${p.rank}|${p.shift}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

export const COMEDK_2025_COMMUNITY_POINTS: ComedkRawPoint[] = dedupePoints(COMEDK_2025_COMMUNITY_RAW);

const COMEDK_2025_TREND_ANCHORS: ComedkRawPoint[] = [
  { marks: 175, rank: 5, shift: "unknown", source: "trend" },
  { marks: 165, rank: 30, shift: "unknown", source: "trend" },
  { marks: 155, rank: 100, shift: "unknown", source: "trend" },
  { marks: 145, rank: 250, shift: "unknown", source: "trend" },
  { marks: 135, rank: 575, shift: "unknown", source: "trend" },
  { marks: 125, rank: 1250, shift: "unknown", source: "trend" },
  { marks: 115, rank: 2450, shift: "unknown", source: "trend" },
  { marks: 105, rank: 4350, shift: "unknown", source: "trend" },
  { marks: 95, rank: 7600, shift: "unknown", source: "trend" },
  { marks: 85, rank: 11850, shift: "unknown", source: "trend" },
  { marks: 75, rank: 18500, shift: "unknown", source: "trend" },
  { marks: 65, rank: 29500, shift: "unknown", source: "trend" },
  { marks: 55, rank: 40500, shift: "unknown", source: "trend" },
  { marks: 45, rank: 52000, shift: "unknown", source: "trend" },
];

function buildWeightedCurveInput(shiftContext: ComedkShift): ComedkRawPoint[] {
  const community = COMEDK_2025_COMMUNITY_POINTS;
  const trend = COMEDK_2025_TREND_ANCHORS;
  const weighted: ComedkRawPoint[] = [];
  
  if (shiftContext === "unknown") {
    // If unknown, we blend all points
    for (const p of community) weighted.push(p, p);
  } else {
    // Exact shift: weight shift-specific points heavily, but include others lightly to maintain curve shape
    for (const p of community) {
      if (p.shift === shiftContext) {
        weighted.push(p, p, p); // 3x weight for exact shift match
      } else {
        weighted.push(p); // 1x weight for out-of-shift bounds
      }
    }
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

// Pre-build curves for fast swapping
export const SHIFT_CURVES: Record<ComedkShift, CurvePoint[]> = {
  "10s1": buildCurve(buildWeightedCurveInput("10s1")),
  "10s2": buildCurve(buildWeightedCurveInput("10s2")),
  "10s3": buildCurve(buildWeightedCurveInput("10s3")),
  "25may": buildCurve(buildWeightedCurveInput("25may")),
  "unknown": buildCurve(buildWeightedCurveInput("unknown")),
};

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

function blendExpectedWithTrend(marks: number, curveExpected: number, curvePoints: CurvePoint[]): number {
  const trend = interpolateTrendOnly(marks);
  const minM = curvePoints[0].marks;
  const maxM = curvePoints[curvePoints.length - 1].marks;
  let w = 0;
  if (marks < minM + 5) {
    w = Math.min(1, (minM + 5 - marks) / 12);
  } else if (marks > maxM - 5) {
    w = Math.min(1, (marks - (maxM - 5)) / 12);
  }
  return curveExpected * (1 - w) + trend * w;
}

function nearbySamples(marks: number, shift: ComedkShift) {
  return COMEDK_2025_COMMUNITY_POINTS.filter((point) => {
      // If we ask for unknown, nearby samples is total nearby across all
      if (shift !== "unknown" && point.shift !== shift) return false;
      return Math.abs(point.marks - marks) <= 2;
  }).length;
}

export function predictComedkRankFromMarks(marks: number, shift: ComedkShift = "unknown"): ComedkPrediction {
  if (!Number.isFinite(marks) || marks < 0 || marks > 180) {
    throw new Error("Marks must be between 0 and 180.");
  }

  const curve = SHIFT_CURVES[shift];
  const expectedBase = interpolate(curve, marks, "expected");
  const q25Base = interpolate(curve, marks, "q25");
  const q75Base = interpolate(curve, marks, "q75");

  const expectedRaw = blendExpectedWithTrend(marks, expectedBase, curve);
  const scale = expectedBase > 0 ? expectedRaw / expectedBase : 1;
  const q25Raw = Math.max(1, q25Base * scale);
  const q75Raw = Math.max(1, q75Base * scale);
  const sampleCount = nearbySamples(marks, shift);

  // If specific shift is selected, confidence bounds are tighter
  const varianceMultiplier = shift === "unknown" ? 1.3 : 1.0;
  const spread = Math.max(800 * varianceMultiplier, Math.round(Math.abs(q75Raw - q25Raw) * 1.1 * varianceMultiplier));
  
  const expectedRank = Math.max(1, Math.round(expectedRaw));
  const optimisticRank = Math.max(1, Math.round(expectedRank - spread * 0.55));
  const pessimisticRank = Math.max(1, Math.round(expectedRank + spread * 0.8));

  let confidence: ComedkPrediction["confidence"] = "Low";
  if (shift === "unknown") {
      confidence = sampleCount >= 10 ? "High" : sampleCount >= 5 ? "Medium" : "Low";
  } else {
      confidence = sampleCount >= 4 ? "High" : sampleCount >= 2 ? "Medium" : "Low";
  }

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
    shiftUsed: shift
  };
}

export function getComedkCurveSnapshot(shift: ComedkShift = "unknown") {
  return SHIFT_CURVES[shift];
}

export function getComedkKeyEstimates(shift: ComedkShift = "unknown") {
  const checkpoints = [60, 70, 80, 90, 100, 110, 120, 130, 140];
  return checkpoints.map((marks) => {
    const p = predictComedkRankFromMarks(marks, shift);
    return {
      marks,
      expectedRank: p.expectedRank,
      range: `${p.optimisticRank.toLocaleString()} - ${p.pessimisticRank.toLocaleString()}`,
    };
  });
}

export function getShiftAnalytics(marks: number = 100) {
    const activeShifts: ComedkShift[] = ["10s1", "10s2", "10s3", "25may"];
    const results = activeShifts.map(shift => {
        return {
            shift,
            rank: predictComedkRankFromMarks(marks, shift).expectedRank
        };
    });
    
    // Sort by rank ascending
    // A lower numerical rank for the SAME marks means that shift was harder
    results.sort((a, b) => a.rank - b.rank);
    
    return {
        hardest: results[0].shift,
        easiest: results[results.length - 1].shift,
        estimates: results
    };
}
