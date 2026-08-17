import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SEO } from "@/components/SEO"
import {
  Calculator,
  Building2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  IndianRupee,
  Home,
  Bus,
  FileText,
  PieChart as PieIcon,
  HelpCircle,
  ArrowRight,
  TrendingDown
} from "lucide-react"
import { useExamMode } from "@/contexts/ExamModeContext"

interface FeeStructure {
  tuitionFee: number
  universityFee: number
  collegeMiscFee: number
  examFee: number
  description: string
}

const QUOTA_FEE_STRUCTURES: Record<string, FeeStructure> = {
  kcet_govt: {
    tuitionFee: 23200,
    universityFee: 10000,
    collegeMiscFee: 8900,
    examFee: 4000,
    description: "Government Engineering Colleges (e.g. UVCE, SKSJTI, Govt Engg Colleges)"
  },
  kcet_aided: {
    tuitionFee: 26500,
    universityFee: 11000,
    collegeMiscFee: 12500,
    examFee: 4000,
    description: "Aided Private Colleges (e.g. RVCE/BMSCE/MSRIT Aided Seats)"
  },
  kcet_private_vtu: {
    tuitionFee: 78500,
    universityFee: 11500,
    collegeMiscFee: 20000,
    examFee: 4500,
    description: "Unaided Private Colleges under VTU (Standard KCET Quota)"
  },
  kcet_private_univ: {
    tuitionFee: 110000,
    universityFee: 15000,
    collegeMiscFee: 25000,
    examFee: 5000,
    description: "Private Deemed / Unitary Universities (e.g. PESU, REVA, MS RUAS KCET Quota)"
  },
  comedk: {
    tuitionFee: 242156,
    universityFee: 15000,
    collegeMiscFee: 25000,
    examFee: 5000,
    description: "COMEDK UGET Allotment (Government Capped Maximum Tuition Fee)"
  },
  management: {
    tuitionFee: 450000,
    universityFee: 20000,
    collegeMiscFee: 40000,
    examFee: 5000,
    description: "Management Quota (Varies significantly by Tier 1 vs Tier 3 college)"
  }
}

export default function FeeCalculator() {
  const { examMode } = useExamMode()

  // State inputs
  const [quota, setQuota] = useState<string>(examMode === "COMEDK" ? "comedk" : "kcet_private_vtu")
  const [category, setCategory] = useState<string>("GM")
  const [isSNQ, setIsSNQ] = useState<boolean>(false)
  const [accommodation, setAccommodation] = useState<"hostel" | "pg" | "dayscholar">("dayscholar")
  const [customHostelRent, setCustomHostelRent] = useState<number>(95000)
  const [busTransport, setBusTransport] = useState<boolean>(false)
  const [customBusFee, setCustomBusFee] = useState<number>(24000)
  const [scholarshipEligible, setScholarshipEligible] = useState<boolean>(true)

  // Selected fee structure base
  const activeFee = QUOTA_FEE_STRUCTURES[quota] || QUOTA_FEE_STRUCTURES.kcet_private_vtu

  // Calculation logic
  const calculations = useMemo(() => {
    let tuition = activeFee.tuitionFee
    let uniFee = activeFee.universityFee
    let miscFee = activeFee.collegeMiscFee
    let examFee = activeFee.examFee

    let scholarshipDeduction = 0
    let snqDiscount = 0

    // SNQ (Supernumerary Quota) waives 100% of Tuition Fee in KCET
    if (isSNQ && quota.startsWith("kcet")) {
      snqDiscount = tuition
      tuition = 0
    }

    // Category Fee Concessions (SSP / Post-Matric Scholarship for SC/ST & Cat-1)
    if (scholarshipEligible && quota.startsWith("kcet") && !isSNQ) {
      if (category === "SCG" || category === "STG" || category === "SCR" || category === "STR" || category === "SCK" || category === "STK") {
        // SC/ST full or major tuition reimbursement under SSP (income < 2.5 LPA)
        scholarshipDeduction = Math.round(tuition * 0.9)
      } else if (category === "1G" || category === "1R" || category === "1K") {
        // Cat-1 ePASS reimbursement
        scholarshipDeduction = Math.min(tuition, 25000)
      } else if (["2AG", "2BG", "3AG", "3BG"].includes(category)) {
        // OBC ePASS fee waiver
        scholarshipDeduction = 15000
      }
    }

    const netTuition = Math.max(0, tuition - scholarshipDeduction)
    const annualAcademicTotal = netTuition + uniFee + miscFee + examFee

    let annualLiving = 0
    if (accommodation === "hostel" || accommodation === "pg") {
      annualLiving = customHostelRent
    }

    let annualTransport = 0
    if (busTransport && accommodation === "dayscholar") {
      annualTransport = customBusFee
    }

    const grandAnnualTotal = annualAcademicTotal + annualLiving + annualTransport
    const total4YearCost = grandAnnualTotal * 4

    return {
      baseTuition: activeFee.tuitionFee,
      snqDiscount,
      scholarshipDeduction,
      netTuition,
      uniFee,
      miscFee,
      examFee,
      annualAcademicTotal,
      annualLiving,
      annualTransport,
      grandAnnualTotal,
      total4YearCost
    }
  }, [quota, category, isSNQ, accommodation, customHostelRent, busTransport, customBusFee, scholarshipEligible, activeFee])

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-foreground font-sans animate-scale-in">
      <SEO
        title="KCET & COMEDK Fee Calculator 2026 – Tuition, Govt Fees & 4-Year Cost"
        description="Calculate exact tuition fees, college extra fees, SSP scholarships, hostel charges, and total 4-year engineering cost for KCET & COMEDK."
        url="https://kcetcoded.dev/fee-calculator"
      />

      {/* Header */}
      <header className="border-b border-border/40 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
            Updated for 2026 Academic Year
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Calculator className="h-7 w-7 text-primary" />
          KCET & COMEDK Fee Calculator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Estimate tuition fees, SSP/ePASS category scholarships, hostel/PG expenses, and total 4-year engineering cost.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                1. Seat Quota & College Type
              </CardTitle>
              <CardDescription className="text-xs">
                Select your admission pathway into Karnataka engineering colleges.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(QUOTA_FEE_STRUCTURES).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setQuota(key)
                      if (key === "comedk" || key === "management") setIsSNQ(false)
                    }}
                    className={`p-3 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                      quota === key
                        ? "border-primary bg-primary/10 font-bold text-foreground shadow-sm"
                        : "border-border/40 bg-background/40 hover:border-primary/40 text-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold text-foreground flex justify-between items-center">
                      <span>{key.replace("_", " ").toUpperCase()}</span>
                      <span className="font-mono text-primary font-bold">₹{item.tuitionFee.toLocaleString()}/yr</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category & Scholarship Card */}
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                2. Category & Government Scholarships
              </CardTitle>
              <CardDescription className="text-xs">
                SSP (State Scholarship Portal) fee concessions for Karnataka candidates.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Seat Category</Label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full h-9 rounded-md border border-border/50 bg-background/50 px-2.5 text-xs font-semibold text-foreground"
                  >
                    {["GM", "2AG", "2BG", "3AG", "3BG", "SCG", "STG", "1G", "GMK", "GMR"].map(c => (
                      <option key={c} value={c} className="bg-background text-foreground">{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">SNQ (Supernumerary Quota)</Label>
                  <button
                    type="button"
                    disabled={!quota.startsWith("kcet")}
                    onClick={() => setIsSNQ(!isSNQ)}
                    className={`w-full h-9 px-3 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                      isSNQ && quota.startsWith("kcet")
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-border/50 bg-background/50 text-muted-foreground"
                    }`}
                  >
                    {isSNQ && quota.startsWith("kcet") ? "✓ SNQ Active (Tuition Free)" : "Apply SNQ 100% Tuition Waiver"}
                  </button>
                </div>
              </div>

              {quota.startsWith("kcet") && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">SSP / Post-Matric Fee Reimbursement</p>
                    <p className="text-[10px] text-muted-foreground">Applies if family annual income is under standard government limits.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={scholarshipEligible}
                    onChange={e => setScholarshipEligible(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Living & Hostel Card */}
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                3. Accommodation & Living Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "dayscholar", label: "Day Scholar", desc: "Stay at home" },
                  { id: "hostel", label: "College Hostel", desc: "Mess + Room" },
                  { id: "pg", label: "Private PG", desc: "Nearby Stay" }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccommodation(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs cursor-pointer ${
                      accommodation === opt.id
                        ? "border-primary bg-primary/10 font-bold text-foreground"
                        : "border-border/40 bg-background/40 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <div className="font-semibold text-foreground">{opt.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>

              {(accommodation === "hostel" || accommodation === "pg") && (
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Annual Hostel/PG Rent + Food (₹)</Label>
                  <Input
                    type="number"
                    value={customHostelRent}
                    onChange={e => setCustomHostelRent(parseInt(e.target.value) || 0)}
                    className="bg-background/50 border-border/50 h-9 font-mono text-xs"
                  />
                </div>
              )}

              {accommodation === "dayscholar" && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">College Bus / Transit Pass</p>
                    <p className="text-[10px] text-muted-foreground">Annual transportation charges</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={busTransport}
                    onChange={e => setBusTransport(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                  />
                </div>
              )}

              {busTransport && accommodation === "dayscholar" && (
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Annual Bus Transport Fee (₹)</Label>
                  <Input
                    type="number"
                    value={customBusFee}
                    onChange={e => setCustomBusFee(parseInt(e.target.value) || 0)}
                    className="bg-background/50 border-border/50 h-9 font-mono text-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Output Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-primary/30 bg-card/80 shadow-md sticky top-6">
            <CardHeader className="pb-3 border-b border-border/40 bg-primary/5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-primary" />
                  Annual & 4-Year Cost Summary
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  Calculated
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* Grand Totals Header */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 text-center space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total 4-Year Cost (Degree)</span>
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-primary">
                  ₹{calculations.total4YearCost.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  (₹{calculations.grandAnnualTotal.toLocaleString()} per year × 4 years)
                </p>
              </div>

              {/* Itemized Annual Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Base Tuition Fee:</span>
                  <span className="font-mono font-semibold">₹{calculations.baseTuition.toLocaleString()}</span>
                </div>

                {calculations.snqDiscount > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-border/40 text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> SNQ Waiver (100%):</span>
                    <span className="font-mono">- ₹{calculations.snqDiscount.toLocaleString()}</span>
                  </div>
                )}

                {calculations.scholarshipDeduction > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-border/40 text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Category Scholarship (SSP):</span>
                    <span className="font-mono">- ₹{calculations.scholarshipDeduction.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Net Tuition Payable:</span>
                  <span className="font-mono font-bold text-foreground">₹{calculations.netTuition.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">VTU / University Regulatory Fee:</span>
                  <span className="font-mono">₹{calculations.uniFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">College Misc / Lab / Library Fee:</span>
                  <span className="font-mono">₹{calculations.miscFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Exam Fees:</span>
                  <span className="font-mono">₹{calculations.examFee.toLocaleString()}</span>
                </div>

                {calculations.annualLiving > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-border/40 text-amber-400">
                    <span>Hostel / PG Rent + Food:</span>
                    <span className="font-mono font-semibold">₹{calculations.annualLiving.toLocaleString()}</span>
                  </div>
                )}

                {calculations.annualTransport > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-border/40 text-cyan-400">
                    <span>Bus / Transport:</span>
                    <span className="font-mono font-semibold">₹{calculations.annualTransport.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Note / Disclaimer */}
              <div className="p-3 rounded-lg border border-border/40 bg-secondary/30 text-[11px] text-muted-foreground flex gap-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <p>
                  Official fee structures are mandated annually by KEA and the Karnataka Higher Education Department. Autonomous colleges may have minor lab/skill development add-on fees.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}