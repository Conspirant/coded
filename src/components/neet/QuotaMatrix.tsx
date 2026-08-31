import React, { useState } from "react";
import {
  ShieldCheck,
  BookOpen,
  Info,
  Building,
  GraduationCap,
  Scale,
  Award,
  AlertCircle,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS } from "@/data/neet2026Data";

export function QuotaMatrix() {
  const [activeSection, setActiveSection] = useState<"quotas" | "categories" | "bond" | "aiq">("quotas");

  const seatTypes = [
    {
      title: "Government Seat in Government College (G-Govt)",
      fee: "₹64,350 – ₹1,09,350 / yr",
      eligibility: "Karnataka Domicile Candidates only (KEA 85% Quota)",
      colleges: "24 Government Medical Colleges (BMCRI, MMCRI, KIMS, BIMS, VIMS, etc.)",
      bond: "Mandatory 1-Year Compulsory Rural Service Bond applicable",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
    {
      title: "Government Seat in Private / Minority Colleges (G-Pvt)",
      fee: "₹1,53,571 – ₹1,66,621 / yr",
      eligibility: "Karnataka Domicile Candidates only via KEA State Merit Rank",
      colleges: "40% Seats in Private Un-Aided & Minority Colleges (St. John's, Ramaiah, KIMS)",
      bond: "1-Year Rural Service Bond applies as per Karnataka Govt rules",
      badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    },
    {
      title: "Private Quota — General Merit Private (GMP)",
      fee: "₹12,00,117 – ₹25,15,000 / yr",
      eligibility: "Karnataka Domicile Candidates only",
      colleges: "Private Medical Colleges & Deemed Universities across Karnataka",
      bond: "Institutional / College-specific guidelines",
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    {
      title: "Open Quota (OPN)",
      fee: "₹12,00,117 – ₹25,15,000 / yr",
      eligibility: "All-India Non-Karnataka candidates eligible (No domicile requirement)",
      colleges: "Private Medical Colleges offering institutional Open quota",
      bond: "Standard institutional norms",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    },
    {
      title: "NRI & Management / Other Quota (N & Q Quota)",
      fee: "₹25,00,000 – ₹45,00,000 / yr",
      eligibility: "NRI / OCI / PIO / Institutional applicants",
      colleges: "Private and Deemed Medical Colleges",
      bond: "Exempt from state government service bond",
      badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    },
  ];

  const reservationCategories = [
    { code: "GM", name: "General Merit", pct: "50%", desc: "Open to all Karnataka candidates on pure merit without reservation." },
    { code: "2A", name: "Category 2A (OBC)", pct: "15%", desc: "Reserved for backward classes sub-category 2A." },
    { code: "2B", name: "Category 2B (Muslims)", pct: "4%", desc: "Reserved for Karnataka Muslim minority candidates." },
    { code: "3A", name: "Category 3A (Vokkaliga)", pct: "4%", desc: "Reserved for Vokkaligas and associated communities." },
    { code: "3B", name: "Category 3B (Lingayat)", pct: "5%", desc: "Reserved for Veerashaiva Lingayats and associated communities." },
    { code: "SC", name: "Scheduled Caste", pct: "15% + internal", desc: "Sub-divided into S1G, S2G, S3G for internal sub-classification." },
    { code: "ST", name: "Scheduled Tribe", pct: "3%", desc: "Reserved for Scheduled Tribe candidates of Karnataka." },
    { code: "1G", name: "Category 1", pct: "4%", desc: "Reserved for most backward classes in Category 1." },
    { code: "HK (371J)", name: "Hyderabad-Karnataka", pct: "8% Statewide / 70% Regional", desc: "For candidates from 6 Kalyan-Karnataka districts (Bidar, Kalaburagi, Yadgir, Raichur, Koppal, Ballari)." },
    { code: "GMR", name: "Rural Reservation", pct: "5% Horizontal", desc: "10 full academic years of study in Karnataka rural schools from Class 1 to 10." },
    { code: "GMK", name: "Kannada Medium", pct: "5% Horizontal", desc: "10 full academic years of study in Kannada medium schools." },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/50 overflow-x-auto">
        <button
          onClick={() => setActiveSection("quotas")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeSection === "quotas" ? "bg-rose-600 text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building className="h-3.5 w-3.5" /> Quota Types & Fees
        </button>
        <button
          onClick={() => setActiveSection("categories")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeSection === "categories" ? "bg-rose-600 text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="h-3.5 w-3.5" /> Reservation Categories
        </button>
        <button
          onClick={() => setActiveSection("bond")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeSection === "bond" ? "bg-rose-600 text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" /> Rural Service Bond
        </button>
        <button
          onClick={() => setActiveSection("aiq")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeSection === "aiq" ? "bg-rose-600 text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Scale className="h-3.5 w-3.5" /> KEA 85% vs MCC AIQ 15%
        </button>
      </div>

      {/* SECTION 1: QUOTAS */}
      {activeSection === "quotas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {seatTypes.map((q, idx) => (
            <Card key={idx} className="border-border/60 bg-card/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge className={`text-[10px] ${q.badgeColor}`}>{q.title.split("(")[0]}</Badge>
                  <span className="font-mono font-extrabold text-xs text-rose-400">{q.fee}</span>
                </div>
                <CardTitle className="text-xs font-bold mt-2 text-foreground">{q.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground pt-0">
                <p>
                  <strong className="text-foreground">Eligibility:</strong> {q.eligibility}
                </p>
                <p>
                  <strong className="text-foreground">Colleges:</strong> {q.colleges}
                </p>
                <p className="text-[11px] text-foreground/80 bg-background/50 p-2 rounded-lg border border-border/30">
                  {q.bond}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* SECTION 2: CATEGORIES */}
      {activeSection === "categories" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reservationCategories.map((c) => (
            <div key={c.code} className="p-3.5 rounded-xl border border-border/60 bg-card/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-rose-400">{c.code}</span>
                <Badge variant="outline" className="text-[9px] font-mono border-rose-500/30 text-rose-300">
                  {c.pct}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-foreground">{c.name}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: RURAL BOND */}
      {activeSection === "bond" && (
        <div className="p-5 rounded-2xl border border-border/60 bg-card/60 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Karnataka 1-Year Compulsory Rural Service Bond</h3>
            <p className="text-xs text-muted-foreground">
              Under the Karnataka Compulsory Training and Service by Candidates Completed Medical Courses Act.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-background/60 border border-border/40 space-y-1 text-center">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Service Duration</span>
              <p className="text-lg font-bold font-mono text-foreground">1 Year (12 Mos)</p>
              <p className="text-[10px] text-muted-foreground">in Govt PHC / CHC / District Hospitals</p>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border border-border/40 space-y-1 text-center">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Monthly Stipend</span>
              <p className="text-lg font-bold font-mono text-emerald-400">₹45,000 – ₹60,000</p>
              <p className="text-[10px] text-muted-foreground">Paid monthly as Junior Resident</p>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border border-border/40 space-y-1 text-center">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Bond Penalty</span>
              <p className="text-lg font-bold font-mono text-rose-400">₹15 – ₹30 Lakhs</p>
              <p className="text-[10px] text-muted-foreground">If candidate defaults on mandatory service</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 text-xs text-foreground/80 space-y-1.5">
            <p className="font-semibold text-foreground">Who is required to sign the bond?</p>
            <p className="text-muted-foreground leading-relaxed">
              All students admitted under Government Quota seats in both Government and Private Medical Colleges in Karnataka must execute a bond on ₹100 e-stamp paper during admission reporting. Permanent Medical Council Registration (KMC) is issued upon completion or verification of bond compliance.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 4: AIQ VS STATE */}
      {activeSection === "aiq" && (
        <div className="p-5 rounded-2xl border border-border/60 bg-card/60 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">KEA State 85% Quota vs MCC All India 15% Quota</h3>
            <p className="text-xs text-muted-foreground">
              Dual counseling navigation rules to avoid seat forfeiture or security deposit loss.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
              <span className="font-bold text-xs text-emerald-300">KEA Karnataka (85% State Quota)</span>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• Covers 85% seats in Govt Colleges + 100% seats in Pvt Colleges (Govt, GMP, OPN).</li>
                <li>• Counseling Authority: Karnataka Examinations Authority (KEA).</li>
                <li>• State reservation (2A, 2B, 3A, 3B, HK-371J, Rural, Kannada Medium) applies.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/10 space-y-2">
              <span className="font-bold text-xs text-blue-300">MCC All-India (15% AIQ + Deemed)</span>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• Covers 15% seats in Govt Colleges (BMC, MMC, KIMS) + 100% AIIMS, JIPMER, Deemed.</li>
                <li>• Counseling Authority: Medical Counseling Committee (MCC).</li>
                <li>• Central reservation (OBC-NCL, EWS, SC, ST) applies across all India.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
