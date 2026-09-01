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
  TrendingDown,
  BookOpen,
  Wheat,
  Stethoscope,
  Fish,
  Share2,
  Copy,
  Check,
  Layers,
  TableProperties,
  Info,
  Calendar,
  PhoneCall
} from "lucide-react"
import {
  ENGINEERING_FEE_STRUCTURE_2026,
  FARM_SCIENCE_FEE_STRUCTURE_2026,
  KEA_FEE_METADATA_2026,
  type EngineeringFeeItem,
  type FarmScienceFeeItem
} from "@/data/kcetFeeStructure2026"
import { toast } from "sonner"

type StreamType = "engineering" | "architecture" | "agriculture" | "veterinary" | "fisheries_dairy"
type ViewMode = "calculator" | "official_tables"

export default function FeeCalculator() {
  // Navigation / View state
  const [stream, setStream] = useState<StreamType>("engineering")
  const [viewMode, setViewMode] = useState<ViewMode>("calculator")
  const [copied, setCopied] = useState(false)

  // Engineering & Architecture selections
  const [selectedEnggCollegeId, setSelectedEnggCollegeId] = useState<string>("unaided_type1")
  const [enggCategory, setEnggCategory] = useState<string>("GM")
  const [scStIncomeEngg, setScStIncomeEngg] = useState<"below_10l" | "above_10l">("below_10l")
  const [cat1IncomeEngg, setCat1IncomeEngg] = useState<"below_2_5l" | "above_2_5l">("below_2_5l")
  const [isSNQ, setIsSNQ] = useState<boolean>(false)

  // Farm Science / Veterinary / Fisheries selections
  const [selectedFarmCollegeId, setSelectedFarmCollegeId] = useState<string>("agri_govt")
  const [farmCategory, setFarmCategory] = useState<string>("GM")
  const [scStIncomeFarm, setScStIncomeFarm] = useState<"below_2_5l" | "above_2_5l">("below_2_5l")

  // Accommodation & Commute inputs
  const [accommodation, setAccommodation] = useState<"hostel" | "pg" | "dayscholar">("dayscholar")
  const [customHostelRent, setCustomHostelRent] = useState<number>(85000)
  const [busTransport, setBusTransport] = useState<boolean>(false)
  const [customBusFee, setCustomBusFee] = useState<number>(25000)

  // Selected Data Items
  const activeEnggItem = useMemo(() => {
    return (
      ENGINEERING_FEE_STRUCTURE_2026.find(item => item.id === selectedEnggCollegeId) ||
      ENGINEERING_FEE_STRUCTURE_2026[0]
    )
  }, [selectedEnggCollegeId])

  const activeFarmItem = useMemo(() => {
    return (
      FARM_SCIENCE_FEE_STRUCTURE_2026.find(item => item.id === selectedFarmCollegeId) ||
      FARM_SCIENCE_FEE_STRUCTURE_2026[0]
    )
  }, [selectedFarmCollegeId])

  // Calculation Engine
  const calculations = useMemo(() => {
    if (stream === "engineering" || stream === "architecture") {
      const isArch = stream === "architecture"
      const courseYears = isArch ? 5 : 4
      const universityFee = isArch ? activeEnggItem.universityFeeArch : activeEnggItem.universityFeeEngg
      const extraArchFee = isArch ? KEA_FEE_METADATA_2026.architectureExtraFee : 0
      const otherFees = activeEnggItem.otherFees

      let baseKeaFee = activeEnggItem.generalFee
      let feeCategoryLabel = "General / OBC Quota"
      let concessionApplied = 0
      let snqApplied = false

      // Check SNQ first
      if (isSNQ && activeEnggItem.snqFee !== null && !isArch) {
        snqApplied = true
        concessionApplied = baseKeaFee - activeEnggItem.snqFee
        baseKeaFee = activeEnggItem.snqFee
        feeCategoryLabel = "SNQ (Supernumerary Quota)"
      } else if (enggCategory === "SC" || enggCategory === "ST") {
        if (scStIncomeEngg === "below_10l") {
          concessionApplied = baseKeaFee - activeEnggItem.scStLowIncomeFee
          baseKeaFee = activeEnggItem.scStLowIncomeFee // ₹0
          feeCategoryLabel = "SC / ST (Annual Income ≤ ₹10 Lakhs - 100% KEA Exemption)"
        } else {
          feeCategoryLabel = "SC / ST (Annual Income > ₹10 Lakhs - Standard Fee)"
        }
      } else if (enggCategory === "1G" || enggCategory === "1R" || enggCategory === "1K" || enggCategory === "CAT-1") {
        if (cat1IncomeEngg === "below_2_5l") {
          concessionApplied = baseKeaFee - activeEnggItem.cat1LowIncomeFee
          baseKeaFee = activeEnggItem.cat1LowIncomeFee
          feeCategoryLabel = "Category-1 (Annual Income ≤ ₹2.5 Lakhs Concession)"
        } else {
          feeCategoryLabel = "Category-1 (Annual Income > ₹2.5 Lakhs - Standard Fee)"
        }
      } else {
        feeCategoryLabel = `${enggCategory} Category (Standard KEA Prescribed Fee)`
      }

      // If architecture, add Rs 750 extra fee per KEA official note
      const payableAnnualAcademic = baseKeaFee + extraArchFee

      // Estimated tuition portion vs regulatory fees
      const estimatedTuitionPortion = Math.max(0, payableAnnualAcademic - universityFee - otherFees)

      // Living & commute
      const annualLiving = accommodation === "dayscholar" ? 0 : customHostelRent
      const annualTransport = busTransport && accommodation === "dayscholar" ? customBusFee : 0

      const grandAnnualTotal = payableAnnualAcademic + annualLiving + annualTransport
      const totalDegreeCost = grandAnnualTotal * courseYears

      return {
        stream,
        courseYears,
        collegeName: activeEnggItem.name,
        feeCategoryLabel,
        baseGeneralFee: activeEnggItem.generalFee,
        concessionApplied,
        payableAnnualAcademic,
        universityFee,
        otherFees,
        extraArchFee,
        estimatedTuitionPortion,
        isSNQ: snqApplied,
        annualLiving,
        annualTransport,
        grandAnnualTotal,
        totalDegreeCost,
        frequency: "annual" as const
      }
    } else {
      // Farm Science / Agriculture / Veterinary / Fisheries
      const courseYears = activeFarmItem.durationYears
      const isPerSemester = activeFarmItem.frequency === "per_semester"
      let baseFee = activeFarmItem.generalFee
      let feeCategoryLabel = "GM / OBC / CAT-1 Prescribed Fee"
      let concessionApplied = 0

      if (farmCategory === "SC" || farmCategory === "ST") {
        if (scStIncomeFarm === "below_2_5l") {
          concessionApplied = baseFee - activeFarmItem.scStLowIncomeFee
          baseFee = activeFarmItem.scStLowIncomeFee
          feeCategoryLabel = "SC / ST (Annual Income < ₹2.50 Lakhs Concession)"
        } else {
          baseFee = activeFarmItem.scStHighIncomeFee
          feeCategoryLabel = "SC / ST (Annual Income > ₹2.50 Lakhs Standard Fee)"
        }
      }

      const payablePerPeriod = baseFee
      const payableAnnualAcademic = isPerSemester ? payablePerPeriod * 2 : payablePerPeriod

      const annualLiving = accommodation === "dayscholar" ? 0 : customHostelRent
      const annualTransport = busTransport && accommodation === "dayscholar" ? customBusFee : 0

      const grandAnnualTotal = payableAnnualAcademic + annualLiving + annualTransport
      const totalDegreeCost = grandAnnualTotal * courseYears

      return {
        stream,
        courseYears,
        collegeName: activeFarmItem.courseName,
        feeCategoryLabel,
        baseGeneralFee: activeFarmItem.generalFee,
        concessionApplied,
        payablePerPeriod,
        payableAnnualAcademic,
        isPerSemester,
        annualLiving,
        annualTransport,
        grandAnnualTotal,
        totalDegreeCost,
        frequency: activeFarmItem.frequency
      }
    }
  }, [
    stream,
    activeEnggItem,
    enggCategory,
    scStIncomeEngg,
    cat1IncomeEngg,
    isSNQ,
    activeFarmItem,
    farmCategory,
    scStIncomeFarm,
    accommodation,
    customHostelRent,
    busTransport,
    customBusFee
  ])

  // Copy share quote summary
  const copySummary = () => {
    const text = `KEA UGCET 2026-27 Fee Breakdown (${calculations.collegeName}):\n` +
      `• Stream: ${stream.toUpperCase()}\n` +
      `• Quota/Category: ${calculations.feeCategoryLabel}\n` +
      `• KEA Academic Fee: ₹${calculations.payableAnnualAcademic.toLocaleString('en-IN')}/year\n` +
      `• Annual Living/Commute: ₹${(calculations.annualLiving + calculations.annualTransport).toLocaleString('en-IN')}/year\n` +
      `• Total ${calculations.courseYears}-Year Degree Cost: ₹${calculations.totalDegreeCost.toLocaleString('en-IN')}\n` +
      `Calculated via KCET Coded (https://kcetcoded.dev/fee-calculator)`
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Fee breakdown copied to clipboard!")
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-foreground font-sans animate-scale-in">
      <SEO
        title="KCET Fee Calculator 2026–27 – Official KEA UGCET Provisional Fees Structure"
        description="Official 2026-27 KEA fee structure for Engineering, Architecture, B.Sc Agriculture, Veterinary, and Fisheries. Real-time SC/ST/Cat-1 concessions, SNQ quota fees, and total 4-year degree cost calculator."
        url="https://kcetcoded.dev/fee-calculator"
        keywords="KCET fee structure 2026, KEA provisional fees 2026-27, KCET engineering tuition fees, SNQ quota fees 2026, UVCE fees, private college fees KCET, B.Sc Agriculture KEA fees"
      />

      {/* Hero Header */}
      <header className="border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official KEA 2026-27 Gazette Notification
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
              Updated: {KEA_FEE_METADATA_2026.effectiveDate}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Calculator className="h-7 w-7 text-primary" />
            KCET & UGCET Fee Calculator 2026–27
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Official government prescribed fee schedule for Engineering, Architecture, Farm Science, Veterinary & Fisheries admissions with automatic category and SNQ waivers.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary/30 border border-border/50 rounded-xl shrink-0 self-start md:self-auto">
          <Button
            size="sm"
            variant={viewMode === "calculator" ? "default" : "ghost"}
            onClick={() => setViewMode("calculator")}
            className="text-xs font-semibold h-8 rounded-lg"
          >
            <Calculator className="h-3.5 w-3.5 mr-1.5" />
            Calculator
          </Button>
          <Button
            size="sm"
            variant={viewMode === "official_tables" ? "default" : "ghost"}
            onClick={() => setViewMode("official_tables")}
            className="text-xs font-semibold h-8 rounded-lg"
          >
            <TableProperties className="h-3.5 w-3.5 mr-1.5" />
            Official KEA Tables
          </Button>
        </div>
      </header>

      {/* Stream Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {[
          { id: "engineering", label: "Engineering (B.E./B.Tech)", icon: GraduationCap, badge: "4 Years" },
          { id: "architecture", label: "Architecture (B.Arch)", icon: Building2, badge: "5 Years" },
          { id: "agriculture", label: "Farm Science (B.Sc Agri)", icon: Wheat, badge: "Per Sem" },
          { id: "veterinary", label: "Veterinary (B.V.Sc & AH)", icon: Stethoscope, badge: "5 Years" },
          { id: "fisheries_dairy", label: "Fisheries & Dairy (B.F.Sc)", icon: Fish, badge: "Per Sem" }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = stream === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setStream(tab.id as StreamType)
                if (tab.id === "architecture" && activeEnggItem.id === "govt_concession") {
                  setSelectedEnggCollegeId("govt_general")
                }
                if (tab.id === "agriculture") setSelectedFarmCollegeId("agri_govt")
                if (tab.id === "veterinary") setSelectedFarmCollegeId("veterinary_govt")
                if (tab.id === "fisheries_dairy") setSelectedFarmCollegeId("fisheries_dairy_govt")
              }}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/15 text-primary shadow-sm ring-1 ring-primary/30"
                  : "border-border/40 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/60 font-mono text-muted-foreground">
                {tab.badge}
              </span>
            </button>
          )
        })}
      </div>

      {viewMode === "calculator" ? (
        /* ========================================================================= */
        /* CALCULATOR MODE                                                          */
        /* ========================================================================= */
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: College Type & Seat Quota */}
            <Card className="border-border/40 bg-card/60 shadow-sm backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    1. Select College Type & Quota
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {stream.toUpperCase()}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  {stream === "engineering" || stream === "architecture"
                    ? "Choose college management type (Government, Aided, UVCE, Unaided Type-1/2, or Deemed)."
                    : "Select government or private institution for farm/veterinary/fisheries science."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {stream === "engineering" || stream === "architecture" ? (
                  <div className="grid gap-2.5">
                    {ENGINEERING_FEE_STRUCTURE_2026.filter(item => {
                      if (stream === "architecture" && item.id === "govt_concession") return false
                      return true
                    }).map(item => {
                      const isSelected = selectedEnggCollegeId === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedEnggCollegeId(item.id)
                            if (item.snqFee === null) setIsSNQ(false)
                          }}
                          className={`p-3 rounded-xl border text-left transition-all text-xs cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? "border-primary bg-primary/10 font-bold text-foreground shadow-sm ring-1 ring-primary/40"
                              : "border-border/40 bg-background/40 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex justify-between items-start w-full gap-2">
                            <span className="font-semibold text-foreground text-xs leading-snug">
                              {item.name}
                            </span>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-primary font-bold text-sm">
                                ₹{(item.generalFee + (stream === "architecture" ? KEA_FEE_METADATA_2026.architectureExtraFee : 0)).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-muted-foreground block">/year</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-normal line-clamp-2">
                            {item.description}
                          </p>
                          {item.snqFee !== null && (
                            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-400 font-mono">
                              <Sparkles className="h-3 w-3" />
                              SNQ Quota Available: ₹{item.snqFee.toLocaleString('en-IN')}/yr
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    {FARM_SCIENCE_FEE_STRUCTURE_2026.filter(item => item.stream === stream).map(item => {
                      const isSelected = selectedFarmCollegeId === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedFarmCollegeId(item.id)}
                          className={`p-3 rounded-xl border text-left transition-all text-xs cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? "border-primary bg-primary/10 font-bold text-foreground shadow-sm ring-1 ring-primary/40"
                              : "border-border/40 bg-background/40 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex justify-between items-start w-full gap-2">
                            <span className="font-semibold text-foreground text-xs leading-snug">
                              {item.collegeType}
                            </span>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-primary font-bold text-sm">
                                ₹{item.generalFee.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-muted-foreground block">
                                /{item.frequency === "per_semester" ? "sem" : "year"}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-normal">
                            {item.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Category & Income Concession */}
            <Card className="border-border/40 bg-card/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    2. Reservation Category & Income Slabs
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    KEA Concession Engine
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Official KEA 2026-27 fee concessions automatically applied based on verified income certificates.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {stream === "engineering" || stream === "architecture" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Caste / Seat Category</Label>
                        <select
                          value={enggCategory}
                          onChange={e => {
                            const val = e.target.value
                            setEnggCategory(val)
                            if (val === "SC" || val === "ST" || val === "CAT-1") {
                              setIsSNQ(false)
                            }
                          }}
                          className="w-full h-9 rounded-md border border-border/50 bg-background/70 px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="GM">General Merit (GM / GMK / GMR)</option>
                          <option value="2A">Category 2A (2AG / 2AR / 2AK)</option>
                          <option value="2B">Category 2B (2BG / 2BR / 2BK)</option>
                          <option value="3A">Category 3A (3AG / 3AR / 3AK)</option>
                          <option value="3B">Category 3B (3BG / 3BR / 3BK)</option>
                          <option value="CAT-1">Category 1 (1G / 1R / 1K)</option>
                          <option value="SC">SC (Scheduled Caste)</option>
                          <option value="ST">ST (Scheduled Tribe)</option>
                        </select>
                      </div>

                      {/* SNQ Quota Toggle */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold flex items-center justify-between">
                          <span>SNQ Quota</span>
                          {activeEnggItem.snqFee === null && (
                            <span className="text-[10px] text-amber-400 font-normal">Not offered for this seat type</span>
                          )}
                        </Label>
                        <button
                          type="button"
                          disabled={activeEnggItem.snqFee === null || stream === "architecture"}
                          onClick={() => setIsSNQ(!isSNQ)}
                          className={`w-full h-9 px-3 rounded-md border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                            isSNQ && activeEnggItem.snqFee !== null
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                              : "border-border/50 bg-background/50 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        >
                          <span>{isSNQ ? "✓ SNQ Active (₹" + activeEnggItem.snqFee?.toLocaleString('en-IN') + "/yr)" : "Apply SNQ Quota"}</span>
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* SC / ST Income Bracket Selector */}
                    {(enggCategory === "SC" || enggCategory === "ST") && (
                      <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>SC / ST Government Annual Income Slabs (KEA 2026-27 Rules)</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Per KEA Table Column 4: Candidates with verified family income up to ₹10.00 Lakhs pay <strong>₹0/-</strong> at KEA portal (100% tuition & university fee waiver).
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setScStIncomeEngg("below_10l")}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                              scStIncomeEngg === "below_10l"
                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500"
                                : "border-border/40 bg-background/40 text-muted-foreground"
                            }`}
                          >
                            <div>Annual Income ≤ ₹10.00 Lakhs</div>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">₹0/- Fee (100% Waiver)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setScStIncomeEngg("above_10l")}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                              scStIncomeEngg === "above_10l"
                                ? "border-primary bg-primary/20 text-foreground ring-1 ring-primary"
                                : "border-border/40 bg-background/40 text-muted-foreground"
                            }`}
                          >
                            <div>Annual Income &gt; ₹10.00 Lakhs</div>
                            <span className="text-[10px] text-muted-foreground font-mono">Standard General Fee</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Category-1 Income Bracket Selector */}
                    {enggCategory === "CAT-1" && (
                      <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-blue-400">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>Category-1 Annual Income Slabs (KEA 2026-27 Rules)</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Per KEA Table Column 5: Category-1 candidates with income up to ₹2.50 Lakhs receive government fee subsidy.
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setCat1IncomeEngg("below_2_5l")}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                              cat1IncomeEngg === "below_2_5l"
                                ? "border-blue-500 bg-blue-500/20 text-blue-300 ring-1 ring-blue-500"
                                : "border-border/40 bg-background/40 text-muted-foreground"
                            }`}
                          >
                            <div>Income ≤ ₹2.50 Lakhs</div>
                            <span className="text-[10px] text-blue-300 font-mono font-bold">
                              ₹{activeEnggItem.cat1LowIncomeFee.toLocaleString('en-IN')}/yr
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCat1IncomeEngg("above_2_5l")}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                              cat1IncomeEngg === "above_2_5l"
                                ? "border-primary bg-primary/20 text-foreground ring-1 ring-primary"
                                : "border-border/40 bg-background/40 text-muted-foreground"
                            }`}
                          >
                            <div>Income &gt; ₹2.50 Lakhs</div>
                            <span className="text-[10px] text-muted-foreground font-mono">Standard General Fee</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Farm Science Category & Income Inputs */
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Seat Category</Label>
                      <select
                        value={farmCategory}
                        onChange={e => setFarmCategory(e.target.value)}
                        className="w-full h-9 rounded-md border border-border/50 bg-background/70 px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="GM">GM, 2A, 2B, 3A, 3B, CAT-1</option>
                        <option value="SC">SC (Scheduled Caste)</option>
                        <option value="ST">ST (Scheduled Tribe)</option>
                      </select>
                    </div>

                    {(farmCategory === "SC" || farmCategory === "ST") && (
                      <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>SC / ST Income Slab for Farm / Vet / Fisheries</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setScStIncomeFarm("below_2_5l")}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                              scStIncomeFarm === "below_2_5l"
                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500"
                                : "border-border/40 bg-background/40 text-muted-foreground"
                            }`}
                          >
                            <div>Income &lt; ₹2.50 Lakhs</div>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">
                              ₹{activeFarmItem.scStLowIncomeFee.toLocaleString('en-IN')}/{activeFarmItem.frequency === "per_semester" ? "sem" : "yr"}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setScStIncomeFarm("above_2_5l")}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                              scStIncomeFarm === "above_2_5l"
                                ? "border-primary bg-primary/20 text-foreground ring-1 ring-primary"
                                : "border-border/40 bg-background/40 text-muted-foreground"
                            }`}
                          >
                            <div>Income &gt; ₹2.50 Lakhs</div>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ₹{activeFarmItem.scStHighIncomeFee.toLocaleString('en-IN')}/{activeFarmItem.frequency === "per_semester" ? "sem" : "yr"}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Step 3: Living & Hostel Expenses (Optional) */}
            <Card className="border-border/40 bg-card/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  3. Accommodation & Commute Expenses (Optional)
                </CardTitle>
                <CardDescription className="text-xs">
                  Add estimated hostel, mess, PG rent, or college bus charges to calculate true total degree investment.
                </CardDescription>
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
                          ? "border-primary bg-primary/15 font-bold text-foreground ring-1 ring-primary/40"
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
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-semibold text-muted-foreground">Annual Hostel/PG Rent + Food (₹)</Label>
                      <span className="text-xs font-mono font-bold text-amber-400">₹{customHostelRent.toLocaleString('en-IN')}/yr</span>
                    </div>
                    <Input
                      type="number"
                      value={customHostelRent}
                      onChange={e => setCustomHostelRent(parseInt(e.target.value) || 0)}
                      className="bg-background/70 border-border/50 h-9 font-mono text-xs"
                    />
                    <div className="flex gap-2 pt-1">
                      {[65000, 85000, 110000, 140000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCustomHostelRent(amt)}
                          className="px-2 py-0.5 rounded text-[10px] font-mono border border-border/40 bg-secondary/30 text-muted-foreground hover:text-foreground"
                        >
                          ₹{(amt/1000)}k
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {accommodation === "dayscholar" && (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">College Bus / Daily Transit Pass</p>
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
                      className="bg-background/70 border-border/50 h-9 font-mono text-xs"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Output Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-primary/30 bg-card/85 shadow-md sticky top-6 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-border/40 bg-primary/5">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <PieIcon className="h-4 w-4 text-primary" />
                    Annual & {calculations.courseYears}-Year Cost Breakdown
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copySummary}
                    className="h-7 px-2 text-[11px] font-semibold border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied ? "Copied" : "Share"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Grand Totals Header */}
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Total {calculations.courseYears}-Year Degree Investment
                  </span>
                  <p className="text-3xl font-extrabold font-mono text-primary tracking-tight">
                    ₹{calculations.totalDegreeCost.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    (₹{calculations.grandAnnualTotal.toLocaleString('en-IN')}/year × {calculations.courseYears} years)
                  </p>
                </div>

                {/* Primary Fee Payable to KEA */}
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Payable to KEA ({calculations.frequency === "per_semester" ? "Per Semester" : "Annual"})
                    </span>
                    <span className="text-xs text-foreground font-semibold">
                      {calculations.feeCategoryLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold font-mono text-emerald-400">
                      ₹{(calculations.frequency === "per_semester" 
                        ? (calculations as any).payablePerPeriod 
                        : calculations.payableAnnualAcademic
                      ).toLocaleString('en-IN')}
                    </span>
                    {calculations.frequency === "per_semester" && (
                      <span className="text-[10px] text-muted-foreground block">
                        (₹{calculations.payableAnnualAcademic.toLocaleString('en-IN')}/yr)
                      </span>
                    )}
                  </div>
                </div>

                {/* Itemized Academic Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider pt-1">
                    Component Breakdown
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Base Prescribed Fee:</span>
                    <span className="font-mono font-semibold">₹{calculations.baseGeneralFee.toLocaleString('en-IN')}</span>
                  </div>

                  {calculations.concessionApplied > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-border/40 text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        Category / SNQ Fee Exemption:
                      </span>
                      <span className="font-mono">- ₹{calculations.concessionApplied.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {calculations.stream === "architecture" && (
                    <div className="flex justify-between py-1.5 border-b border-border/40 text-amber-400">
                      <span className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Architecture Special Add-on Fee:
                      </span>
                      <span className="font-mono font-semibold">+ ₹{KEA_FEE_METADATA_2026.architectureExtraFee}</span>
                    </div>
                  )}

                  {(calculations.stream === "engineering" || calculations.stream === "architecture") && (
                    <>
                      <div className="flex justify-between py-1.5 border-b border-border/40 text-muted-foreground">
                        <span className="pl-2">↳ University Regulatory Fee (Included):</span>
                        <span className="font-mono">₹{(calculations as any).universityFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border/40 text-muted-foreground">
                        <span className="pl-2">↳ College Misc/Lab Fee (Included):</span>
                        <span className="font-mono">₹{(calculations as any).otherFees.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}

                  {calculations.annualLiving > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-border/40 text-amber-400">
                      <span>Hostel / PG Rent + Mess (Annual):</span>
                      <span className="font-mono font-semibold">₹{calculations.annualLiving.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {calculations.annualTransport > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-border/40 text-cyan-400">
                      <span>Bus / Commute Transit Pass (Annual):</span>
                      <span className="font-mono font-semibold">₹{calculations.annualTransport.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Important KEA Rule Notice */}
                <div className="p-3 rounded-lg border border-border/40 bg-secondary/30 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    <span>KEA Official Notes & Guidelines</span>
                  </div>
                  <p>
                    • Fees include official University & Other components as notified by KEA on <strong>01-07-2026</strong>.
                  </p>
                  <p>
                    • Choice 1 and Choice 2 candidates in KCET counseling must pay the prescribed annual fee online or via bank challan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* OFFICIAL KEA TABLES VIEW                                                 */
        /* ========================================================================= */
        <div className="space-y-8">
          {/* Table 1: UGCET Engineering / Architecture */}
          <Card className="border-border/40 bg-card/60 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-secondary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                      TABLE 1
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-mono">Date: 01-07-2026</span>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-1">
                    PROVISIONAL FEES STRUCTURE UGCET - Engineering / Architecture Courses – 2026-27
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs shrink-0 self-start sm:self-auto">
                  KEA Official Gazette
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50 text-foreground">
                      <th className="p-3 font-bold border-r border-border/40 w-12 text-center">#</th>
                      <th className="p-3 font-bold border-r border-border/40 min-w-[220px]">COLLEGE TYPE / COURSE</th>
                      <th className="p-3 font-bold border-r border-border/40 text-right min-w-[130px]">
                        GM, 2A, 2B, 3A, 3B
                        <span className="block text-[10px] font-normal text-muted-foreground">SC/ST &gt; 10L | Cat-1 &gt; 2.5L</span>
                      </th>
                      <th className="p-3 font-bold border-r border-border/40 text-right min-w-[110px]">
                        SNQ Quota
                        <span className="block text-[10px] font-normal text-muted-foreground">Engg Courses</span>
                      </th>
                      <th className="p-3 font-bold border-r border-border/40 text-right min-w-[120px]">
                        SC / ST
                        <span className="block text-[10px] font-normal text-muted-foreground">Income ≤ 10 Lakhs</span>
                      </th>
                      <th className="p-3 font-bold text-right min-w-[120px]">
                        Category-1
                        <span className="block text-[10px] font-normal text-muted-foreground">Income ≤ 2.5 Lakhs</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">1</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Government Colleges (General Engineering Courses)
                        <span className="block text-[11px] font-normal text-muted-foreground">Other than subsidized core branches</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹47,100/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹22,910/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹24,150/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">2</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Government Colleges (Mechanical \ Textile \ Silk Technology \ Civil \ Automobile)
                        <span className="block text-[11px] font-normal text-muted-foreground">Special subsidized core branches</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹29,985/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹17,910/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹12,075/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">3</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        For Aided courses in Aided colleges
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹47,100/-</td>
                      <td className="p-3 text-right font-mono text-muted-foreground border-r border-border/40">—</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹24,150/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">4</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        UVCE (University Visvesvaraya College of Engineering)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹56,500/-</td>
                      <td className="p-3 text-right font-mono text-muted-foreground border-r border-border/40">—</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹33,600/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">5</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        VTU Constituent Colleges HIGHER FEES
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹1,10,910/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹22,910/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹86,760/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">6</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Type-1 – Un-aided colleges including Minority & Un-Aided courses in Aided colleges
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹1,20,320/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹32,320/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹96,170/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">7</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Type-2 – Un-aided colleges including Minority & Un-Aided courses in Aided colleges
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹1,30,320/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹32,320/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹1,06,170/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">8</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Deemed / Private Universities (Band 1)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹1,20,320/-</td>
                      <td className="p-3 text-right font-mono text-muted-foreground border-r border-border/40">—</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹96,170/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">9</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Deemed / Private Universities (Band 2)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹1,30,320/-</td>
                      <td className="p-3 text-right font-mono text-muted-foreground border-r border-border/40">—</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">₹1,06,170/-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table 1 Footnotes */}
              <div className="p-4 border-t border-border/40 bg-secondary/15 space-y-2 text-xs text-muted-foreground">
                <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-lg border border-border/40 bg-background/50 text-foreground">
                  <div>
                    <span className="font-semibold text-primary">University Fees (Engineering):</span>{" "}
                    <span className="font-mono font-bold">₹12,320/-</span> (Included in above table)
                  </div>
                  <div>
                    <span className="font-semibold text-primary">University Fees (Architecture):</span>{" "}
                    <span className="font-mono font-bold">₹13,070/-</span> (Included in above table)
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <p><strong>1.</strong> For Architecture course apart from the above fees <strong>₹750/- is extra</strong>.</p>
                  <p><strong>2.</strong> <strong>₹10,590/-</strong> as other fees is included in the above table, for Government and Aided engineering colleges.</p>
                  <p><strong>3.</strong> <strong>₹20,000/-</strong> as other fees is included in the above table, for Unaided and Private / Deemed Universities Engineering colleges.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table 2: Agriculture / Veterinary / Fisheries & Dairy Science */}
          <Card className="border-border/40 bg-card/60 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-secondary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                      TABLE 2
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-mono">Academic Year 2026 - 2027</span>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-1">
                    PROVISIONAL FEES STRUCTURE - For Agriculture / Veterinary / Fisheries & Dairy Science Courses – 2026-27
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs shrink-0 self-start sm:self-auto">
                  KEA Official Gazette
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50 text-foreground">
                      <th className="p-3 font-bold border-r border-border/40 w-12 text-center">#</th>
                      <th className="p-3 font-bold border-r border-border/40 min-w-[240px]">COURSE &amp; COLLEGE TYPE</th>
                      <th className="p-3 font-bold border-r border-border/40 text-right min-w-[130px]">
                        GM, 2A, 2B, 3A, 3B, CAT-1
                        <span className="block text-[10px] font-normal text-muted-foreground">(In ₹.)</span>
                      </th>
                      <th className="p-3 font-bold border-r border-border/40 text-right min-w-[140px]">
                        SC / ST (Annual Income &lt; 2.5L)
                        <span className="block text-[10px] font-normal text-muted-foreground">(In ₹.)</span>
                      </th>
                      <th className="p-3 font-bold text-right min-w-[140px]">
                        SC / ST (Annual Income &gt; 2.5L)
                        <span className="block text-[10px] font-normal text-muted-foreground">(In ₹.)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="bg-secondary/15 font-bold text-foreground">
                      <td colSpan={5} className="p-2.5 px-4 text-xs tracking-wide uppercase text-primary">
                        Farm Science Courses (Per Semester) — B.Sc. (Agriculture), Forestry, Horticulture etc.
                      </td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">1</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Government Colleges (UAS Bangalore / Dharwad / Bagalkot / Shivamogga)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹43,790/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹0/-</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">₹43,790/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">2</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Private Colleges (Except KLE)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹66,550/-</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹66,550/-</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">₹66,550/-</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">3</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        KLE College of Agricultural Science
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹60,500/-</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹60,500/-</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">₹60,500/-</td>
                    </tr>

                    <tr className="bg-secondary/15 font-bold text-foreground">
                      <td colSpan={5} className="p-2.5 px-4 text-xs tracking-wide uppercase text-primary">
                        B.V.Sc &amp; AH (Veterinary Science) Course — Annual (Per Year)
                      </td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">4</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Government Veterinary Colleges (KVAFSU Hebbal, Bidar, Shimoga, Hassan)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹89,880/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹20,210/-</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">₹89,880/-</td>
                    </tr>

                    <tr className="bg-secondary/15 font-bold text-foreground">
                      <td colSpan={5} className="p-2.5 px-4 text-xs tracking-wide uppercase text-primary">
                        B.F.Sc (Fisheries &amp; Dairy Science) Courses — Per Semester
                      </td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">5</td>
                      <td className="p-3 font-semibold text-foreground border-r border-border/40">
                        Government Fisheries &amp; Dairy Colleges (Mangalore, Bangalore, Kalaburagi)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground border-r border-border/40">₹43,455/-</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold border-r border-border/40">₹12,890/-</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">₹43,455/-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}