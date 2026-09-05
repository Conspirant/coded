import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileText,
  CreditCard,
  Building,
  RefreshCw,
  XCircle,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ChoiceSimulator() {
  const [selectedChoice, setSelectedChoice] = useState<1 | 2 | 3 | 4>(2);
  const [activeScenario, setActiveScenario] = useState<string>("upgrade");

  // Interactive Quiz State
  const [quizState, setQuizState] = useState({
    satisfiedWithCollege: "partial", // 'yes' | 'partial' | 'no'
    wantRound2: "yes", // 'yes' | 'no'
    canPayFeesNow: "yes", // 'yes' | 'no'
    haveBackupInAIQ: "no", // 'yes' | 'no'
  });

  const getRecommendedChoice = (): { choice: 1 | 2 | 3 | 4; title: string; rationale: string; riskLevel: "low" | "medium" | "high" } => {
    if (quizState.satisfiedWithCollege === "yes" && quizState.wantRound2 === "no") {
      return {
        choice: 1,
        title: "Choice 1: Accept & Freeze",
        rationale: "You are 100% satisfied with your allotted seat. Pay the prescribed fees to KEA, download the admission order, and report to the college. You exit counseling with your confirmed seat.",
        riskLevel: "low",
      };
    }
    if (quizState.satisfiedWithCollege === "partial" || (quizState.wantRound2 === "yes" && quizState.canPayFeesNow === "yes")) {
      return {
        choice: 2,
        title: "Choice 2: Accept & Upgrade (Safest)",
        rationale: "You HOLD your current seat safely while participating in Round 2 for higher priority options. If higher seat is allotted, current seat is automatically vacated. If no higher seat allotted, your current seat remains intact!",
        riskLevel: "low",
      };
    }
    if (quizState.satisfiedWithCollege === "no" && quizState.canPayFeesNow === "no") {
      return {
        choice: 3,
        title: "Choice 3: Reject & Upgrade (Risky)",
        rationale: "You SURRENDER your allotted seat without paying fees and enter Round 2. CAUTION: You will NEVER get this seat back! If you don't get a higher option in Round 2, you are left with no seat.",
        riskLevel: "high",
      };
    }
    return {
      choice: 4,
      title: "Choice 4: Reject & Exit",
      rationale: "You reject the allotted seat and exit KEA counseling completely (e.g. if you joined MCC AIQ / Deemed university / other state counseling).",
      riskLevel: "medium",
    };
  };

  const recommended = getRecommendedChoice();

  const choiceDetails = {
    1: {
      number: 1,
      title: "Choice 1 — Satisfied & Confirmed",
      subtitle: "Accept seat, pay fee, join college, exit further rounds.",
      statusColor: "emerald",
      badge: "Final Admission",
      steps: [
        "1. Select Choice 1 on KEA Portal before the declared deadline.",
        "2. Download Challan / E-Payment portal & pay full prescribed tuition fees to KEA.",
        "3. Download official KEA Admission Order.",
        "4. Carry original documents + Admission Order and physically report to the allotted college before the last reporting date.",
        "5. Failure to report in time leads to cancellation of seat & forfeiture of fees!",
      ],
      pros: ["Guaranteed admission", "Zero risk of losing seat", "Settled without Round 2 anxiety"],
      cons: ["Permanently ineligible for Round 2 upgrade in KEA"],
    },
    2: {
      number: 2,
      title: "Choice 2 — Hold Seat & Upgrade (Recommended)",
      subtitle: "Satisfied with seat but want to explore higher options in Round 2.",
      statusColor: "amber",
      badge: "Safe Upgrade Option",
      steps: [
        "1. Select Choice 2 on KEA Portal.",
        "2. Must pay full seat fees to KEA to hold the allotted seat.",
        "3. All options below the allotted seat are deleted automatically.",
        "4. You can modify / delete options ABOVE the allotted seat for Round 2.",
        "5. Scenario A: If higher option allotted in Round 2 -> New seat confirmed, old seat goes to another candidate automatically.",
        "6. Scenario B: If NO higher option allotted -> Your Round 1 seat remains 100% reserved for you!",
      ],
      pros: ["Zero downside risk (seat is reserved)", "Opportunity to get a higher college in Round 2", "Fee automatically adjusted if upgraded"],
      cons: ["Must pay fee upfront to KEA during Round 1 itself"],
    },
    3: {
      number: 3,
      title: "Choice 3 — Surrender Seat & Try Round 2",
      subtitle: "Not satisfied with allotted seat, surrender it, try higher options in Round 2.",
      statusColor: "rose",
      badge: "High Risk Option",
      steps: [
        "1. Select Choice 3 on KEA Portal.",
        "2. No fee payment required in Round 1.",
        "3. Your allotted seat is instantly released back to the counseling pool.",
        "4. You participate in Round 2 ONLY for higher options.",
        "5. WARNING: If no college is allotted in Round 2, you end up with NO SEAT!",
      ],
      pros: ["No need to arrange immediate fee payment", "Participate in Round 2"],
      cons: ["Your Round 1 seat is permanently lost", "Very high risk of getting zero seats if cutoffs don't drop"],
    },
    4: {
      number: 4,
      title: "Choice 4 — Reject & Exit Counseling",
      subtitle: "Not interested in any KEA seat. Quit KEA admissions completely.",
      statusColor: "purple",
      badge: "Exit Counseling",
      steps: [
        "1. Select Choice 4 on KEA Portal.",
        "2. Your allotted seat is cancelled.",
        "3. You are permanently removed from subsequent KEA medical/dental counseling rounds.",
        "4. Suitable only if you already secured an MCC AIQ / AIIMS / JIPMER / Deemed seat.",
      ],
      pros: ["Clears seat for next deserving student in queue", "Clean exit"],
      cons: ["Cannot re-enter KEA UG-NEET counseling for the current academic year"],
    },
  };

  const active = choiceDetails[selectedChoice];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              KEA Post-Allotment Choice Simulator (Choice 1, 2, 3, 4)
            </h2>
            <p className="text-xs text-muted-foreground">
              Understand the exact legal and financial consequences of every KEA choice before pressing submit.
            </p>
          </div>
        </div>

        {/* Choice Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {([1, 2, 3, 4] as const).map((num) => {
            const isSelected = selectedChoice === num;
            return (
              <button
                key={num}
                onClick={() => setSelectedChoice(num)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? num === 1
                      ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-sm"
                      : num === 2
                      ? "border-amber-500 bg-amber-950/20 text-amber-300 shadow-sm"
                      : num === 3
                      ? "border-rose-500 bg-rose-950/20 text-rose-300 shadow-sm"
                      : "border-purple-500 bg-purple-950/20 text-purple-300 shadow-sm"
                    : "border-border/50 bg-card/40 hover:bg-card/70 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">Choice {num}</span>
                  {num === 2 && (
                    <Badge className="text-[8px] bg-amber-500/20 text-amber-300 border-amber-500/30">
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-semibold text-foreground mt-1 truncate">
                  {num === 1 ? "Accept & Freeze" : num === 2 ? "Hold & Upgrade" : num === 3 ? "Reject & Upgrade" : "Reject & Exit"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Choice Detail Card */}
      <div className="p-5 rounded-2xl border border-border/60 bg-card/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                className={`text-[10px] ${
                  active.number === 1
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : active.number === 2
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    : active.number === 3
                    ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                }`}
              >
                {active.badge}
              </Badge>
              <h3 className="text-sm font-bold text-foreground">{active.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{active.subtitle}</p>
          </div>
        </div>

        {/* Step by step procedure */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-semibold text-muted-foreground block">
            Official KEA Workflow:
          </span>
          <div className="space-y-1.5">
            {active.steps.map((st, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-foreground/90 p-2.5 rounded-lg bg-background/50 border border-border/30">
                <span className="font-mono text-rose-400 font-bold shrink-0">{i + 1}.</span>
                <span className="leading-relaxed">{st.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-500/20 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Advantages
            </span>
            <ul className="text-xs text-muted-foreground space-y-1">
              {active.pros.map((p, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-emerald-400">•</span> {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/15 border border-rose-500/20 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-rose-300 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Risks & Limitations
            </span>
            <ul className="text-xs text-muted-foreground space-y-1">
              {active.cons.map((c, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-rose-400">•</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decision Advisor Wizard */}
      <div className="p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-card to-card space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-rose-400" />
          <h3 className="text-sm font-bold text-foreground">Interactive Decision Advisor</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Answer these 3 quick questions to get the exact recommended choice for your situation:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5 p-3 rounded-xl bg-background/60 border border-border/40">
            <label className="text-[11px] font-semibold text-foreground block">
              1. Are you happy with your allotted college?
            </label>
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={quizState.satisfiedWithCollege === "yes" ? "default" : "outline"}
                onClick={() => setQuizState((prev) => ({ ...prev, satisfiedWithCollege: "yes", wantRound2: "no" }))}
                className="text-[10px] h-7 px-2.5 flex-1"
              >
                100% Happy
              </Button>
              <Button
                type="button"
                size="sm"
                variant={quizState.satisfiedWithCollege === "partial" ? "default" : "outline"}
                onClick={() => setQuizState((prev) => ({ ...prev, satisfiedWithCollege: "partial", wantRound2: "yes" }))}
                className="text-[10px] h-7 px-2.5 flex-1"
              >
                Want Higher
              </Button>
              <Button
                type="button"
                size="sm"
                variant={quizState.satisfiedWithCollege === "no" ? "default" : "outline"}
                onClick={() => setQuizState((prev) => ({ ...prev, satisfiedWithCollege: "no" }))}
                className="text-[10px] h-7 px-2.5 flex-1"
              >
                Dislike It
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-background/60 border border-border/40">
            <label className="text-[11px] font-semibold text-foreground block">
              2. Can you arrange full seat fee right now?
            </label>
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={quizState.canPayFeesNow === "yes" ? "default" : "outline"}
                onClick={() => setQuizState((prev) => ({ ...prev, canPayFeesNow: "yes" }))}
                className="text-[10px] h-7 px-2.5 flex-1"
              >
                Yes, can pay
              </Button>
              <Button
                type="button"
                size="sm"
                variant={quizState.canPayFeesNow === "no" ? "default" : "outline"}
                onClick={() => setQuizState((prev) => ({ ...prev, canPayFeesNow: "no" }))}
                className="text-[10px] h-7 px-2.5 flex-1"
              >
                No / Difficult
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-background/60 border border-border/40">
            <label className="text-[11px] font-semibold text-foreground block">
              3. Do you have an MCC AIQ / AIIMS seat?
            </label>
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={quizState.haveBackupInAIQ === "yes" ? "default" : "outline"}
                onClick={() => setQuizState((prev) => ({ ...prev, haveBackupInAIQ: "yes", satisfiedWithCollege: "no" }))}
                className="text-[10px] h-7 px-2.5 flex-1"
              >
                Yes, joined AIQ
              </Button>
              <Button
                type="button"
                size="sm"
                variant={quizState.haveBackupInAIQ === "no" ? "default" : "outline"}
                onClick={() => setQuizState((prev) => ({ ...prev, haveBackupInAIQ: "no" }))}
                className="text-[10px] h-7 px-2.5 flex-1"
              >
                No, relying on KEA
              </Button>
            </div>
          </div>
        </div>

        {/* Output recommendation */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-background/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-xs">
                Recommended Action
              </Badge>
              <span className="font-bold text-sm text-foreground">{recommended.title}</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              {recommended.rationale}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setSelectedChoice(recommended.choice)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-8 shrink-0"
          >
            Inspect Choice {recommended.choice} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
