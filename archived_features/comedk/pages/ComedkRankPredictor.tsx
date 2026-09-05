import { SEO } from "@/components/SEO";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calculator, ExternalLink, Sparkles, TrendingUp } from "lucide-react";
import {
  COMEDK_REDDIT_SOURCE_URL,
  COMEDK_2025_COMMUNITY_POINTS,
  getComedkKeyEstimates,
  predictComedkRankFromMarks,
  getShiftAnalytics,
  ComedkShift,
  COMEDK_SHIFTS,
} from "@/lib/comedk-rank-predictor";

const SHIFT_LABELS: Record<ComedkShift, string> = {
  "10s1": "10th May - Shift 1",
  "10s2": "10th May - Shift 2",
  "10s3": "10th May - Shift 3",
  "25may": "25th May",
  "unknown": "I Don't Know / Blend All",
};

const clampMarks = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(180, Math.round(value)));
};

const ComedkRankPredictor = () => {
  const [marks, setMarks] = useState(90);
  const [shift, setShift] = useState<ComedkShift>("unknown");

  const prediction = useMemo(() => predictComedkRankFromMarks(marks, shift), [marks, shift]);
  const keyEstimates = useMemo(() => getComedkKeyEstimates(shift), [shift]);
  const analytics = useMemo(() => getShiftAnalytics(marks), [marks]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <SEO
        title="COMEDK 2025 Rank Predictor - Community Based"
        description="Predict COMEDK rank from marks using community-reported 2025 marks-vs-rank data from r/comedk post and comments."
        url="https://kcetcoded.dev/rank-predictor"
        keywords="COMEDK rank predictor, COMEDK marks vs rank 2025, COMEDK expected rank, r/comedk marks rank"
      />

      <div className="text-center space-y-3 py-4">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
          <Calculator className="h-7 w-7 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">COMEDK 2025 Rank Predictor</h1>
        <p className="text-muted-foreground">Built from community-submitted marks vs rank points from post + comments.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-amber-300/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Predict Your Rank
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="comedk-marks">COMEDK Marks (out of 180)</Label>
                <Badge variant="outline">{marks}/180</Badge>
              </div>
              <Input
                id="comedk-marks"
                type="range"
                min={0}
                max={180}
                step={1}
                value={marks}
                onChange={(event) => setMarks(clampMarks(Number(event.target.value)))}
              />
              <Input
                type="number"
                min={0}
                max={180}
                value={marks}
                onChange={(event) => setMarks(clampMarks(Number(event.target.value)))}
              />
              
              <div className="space-y-3 pt-4 border-t">
                <Label>Select your exam shift</Label>
                <div className="flex flex-wrap gap-2">
                  {COMEDK_SHIFTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setShift(s)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors border ${
                        shift === s 
                          ? "bg-amber-500 text-white border-amber-600 font-medium" 
                          : "bg-transparent text-muted-foreground hover:bg-amber-50 dark:hover:bg-amber-950"
                      }`}
                    >
                      {SHIFT_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border bg-card p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Expected Rank</div>
                <div className="mt-1 text-3xl font-bold text-amber-500">{prediction.expectedRank.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Likely Best</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-500">{prediction.optimisticRank.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Likely Worst</div>
                <div className="mt-1 text-2xl font-semibold text-rose-500">{prediction.pessimisticRank.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-500/15 text-amber-200 border-amber-500/40">Confidence: {prediction.confidence}</Badge>
              <Badge variant="outline">Estimated Percentile: {prediction.percentile}</Badge>
              <Badge variant="outline">Nearby Samples Used: {prediction.nearbySampleCount}</Badge>
            </div>

            {shift !== "unknown" && (
              <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-50/50 p-4 dark:bg-amber-950/20 text-sm">
                <div className="flex items-start gap-2">
                  <TrendingUp className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-semibold text-amber-900 dark:text-amber-200">Shift Insight: </span>
                    <span className="text-muted-foreground">
                      {shift === analytics.hardest 
                        ? "You took the hardest shift! Your rank gets a massive boost relative to the average." 
                        : shift === analytics.easiest 
                          ? "You took the easiest shift. The rank competition is slightly higher for the same marks." 
                          : "Your shift was moderately difficult, sitting near the general average curve."
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {keyEstimates.map((item) => (
              <div key={item.marks} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                <div className="font-medium">{item.marks} marks</div>
                <div className="text-right">
                  <div className="font-semibold">{item.expectedRank.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{item.range}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-300/40 bg-amber-50/80 dark:bg-amber-950/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5" />
            Source & Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-amber-900 dark:text-amber-100">
          <p>
            This model blends <strong>{COMEDK_2025_COMMUNITY_POINTS.length}</strong> deduplicated community points (same Reddit thread: post table +
            comments) with published marks-vs-rank band midpoints for the tails. Quantiles and monotonic smoothing reduce noisy outliers; treat the
            result as a planning range, not an official rank.
          </p>
          <p>Shift-wise variation in COMEDK is real; use this alongside your own scorecard and counselling data.</p>
          <a
            href={COMEDK_REDDIT_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-amber-800 underline-offset-4 hover:underline dark:text-amber-300"
          >
            Open source post and comments <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComedkRankPredictor;

