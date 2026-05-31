import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles,
  Info,
  Layers,
  Fingerprint,
  GraduationCap,
  CalendarCheck,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionStep {
  title: string;
  description: string;
  icon: any;
}

export default function MockVerification() {
  const [step, setStep] = useState(0);

  // Form State
  const [clauseA, setClauseA] = useState<string>(""); // Yes / No
  const [printedDocs, setPrintedDocs] = useState<string>(""); // Yes / No
  
  const [namesMatch, setNamesMatch] = useState<string>(""); // Yes / No
  const [hasTC, setHasTC] = useState<string>(""); // Yes / No
  
  const [studyCertBEO, setStudyCertBEO] = useState<string>(""); // Yes / No
  
  // Reservations Claimed
  const [claimsCaste, setClaimsCaste] = useState(false);
  const [claimsIncome, setClaimsIncome] = useState(false);
  const [claimsRural, setClaimsRural] = useState(false);
  const [claimsKannada, setClaimsKannada] = useState(false);
  const [claimsHK, setClaimsHK] = useState(false);

  // Reservation details
  const [casteTahisldar, setCasteTahisldar] = useState<string>(""); // Yes / No
  const [casteRD, setCasteRD] = useState<string>(""); // Yes / No
  const [incomeLimit, setIncomeLimit] = useState<string>(""); // Yes / No
  const [rural10Years, setRural10Years] = useState<string>(""); // Yes / No
  const [ruralBEO, setRuralBEO] = useState<string>(""); // Yes / No
  const [kannada10Years, setKannada10Years] = useState<string>(""); // Yes / No
  const [kannadaBEO, setKannadaBEO] = useState<string>(""); // Yes / No
  const [hkAnnexureA, setHkAnnexureA] = useState<string>(""); // Yes / No

  const totalSteps = 6;

  const stepsList: QuestionStep[] = [
    { title: "Eligibility & Clause", description: "Verify your candidature clause", icon: Fingerprint },
    { title: "Academic & Core", description: "Verify marks cards & core records", icon: GraduationCap },
    { title: "Karnataka Study Certificate", description: "Verify study duration and signatures", icon: CalendarCheck },
    { title: "Reservation Claims", description: "Select what quotas you are claiming", icon: Layers },
    { title: "Reservation Verification", description: "Specific checks for claims", icon: FileCheck },
    { title: "Verification Report", description: "Personalized compliance check report", icon: Sparkles }
  ];

  const handleNext = () => {
    // If step is Reservation selection (step 3) and no reservation is selected, we can skip step 4 (Reservation details)
    if (step === 3 && !claimsCaste && !claimsIncome && !claimsRural && !claimsKannada && !claimsHK) {
      setStep(5); // Jump straight to report
    } else {
      setStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrev = () => {
    if (step === 5 && !claimsCaste && !claimsIncome && !claimsRural && !claimsKannada && !claimsHK) {
      setStep(3);
    } else {
      setStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleReset = () => {
    setStep(0);
    setClauseA("");
    setPrintedDocs("");
    setNamesMatch("");
    setHasTC("");
    setStudyCertBEO("");
    setClaimsCaste(false);
    setClaimsIncome(false);
    setClaimsRural(false);
    setClaimsKannada(false);
    setClaimsHK(false);
    setCasteTahisldar("");
    setCasteRD("");
    setIncomeLimit("");
    setRural10Years("");
    setRuralBEO("");
    setKannada10Years("");
    setKannadaBEO("");
    setHkAnnexureA("");
  };

  // Compile compliance results
  const getComplianceResults = () => {
    const verified: string[] = [];
    const warnings: Array<{ doc: string; reason: string; action: string }> = [];

    // Clause verification
    if (clauseA === "yes") {
      verified.push("Candidature Clause eligibility (Karnataka Candidate)");
    } else if (clauseA === "no") {
      warnings.push({
        doc: "Candidature Clause Eligibility",
        reason: "You checked 'No' to 7 years study in Karnataka. You may not qualify under Clause A.",
        action: "Check KEA Brochure Clause B to M for alternate eligibility (like Parent's study certificate, domicile, or defense clause)."
      });
    }

    // Printed application details
    if (printedDocs === "yes") {
      verified.push("Printed UGCET Application Form, Admit Card, & Confirmation Slip");
    } else if (printedDocs === "no") {
      warnings.push({
        doc: "Core KEA Application Forms",
        reason: "Missing printed copies of Hall Ticket, Application, or Confirmation slips.",
        action: "Login to the KEA portal and download/print your UGCET Application form and Admit card before verification starts."
      });
    }

    // Names verification
    if (namesMatch === "yes") {
      verified.push("Name alignment between 10th and 12th Standard Marks Cards");
    } else if (namesMatch === "no") {
      warnings.push({
        doc: "10th & 12th Marks Cards (Name Mismatch)",
        reason: "Your name or parent name does not match exactly between standard records.",
        action: "Prepare a registered affidavit explaining the spelling discrepancy to prevent name mismatch rejection."
      });
    }

    // PU College TC
    if (hasTC === "yes") {
      verified.push("PU / 12th Transfer Certificate (TC)");
    } else if (hasTC === "no") {
      warnings.push({
        doc: "Transfer Certificate",
        reason: "Missing college Transfer Certificate.",
        action: "Collect your TC from your 2nd PUC / Class 12 college as soon as possible."
      });
    }

    // BEO Countersignature
    if (studyCertBEO === "yes") {
      verified.push("Study Certificate countersigned by BEO/DDPI");
    } else if (studyCertBEO === "no") {
      warnings.push({
        doc: "Study Certificate Verification Status",
        reason: "Study Certificate is not countersigned by the Block Education Officer (BEO).",
        action: "Visit your local Block Education Office (BEO) where your school is registered to get it countersigned and stamped."
      });
    }

    // Reservations
    if (claimsCaste) {
      if (casteTahisldar === "yes" && casteRD === "yes") {
        verified.push("Caste/Category Certificate (Form D/E/F, Tahsildar verified with RD number)");
      } else {
        warnings.push({
          doc: "Caste/OBC Certificate",
          reason: "Caste certificate is either not issued by Tahsildar or lacks a verifiable Revenue Department (RD) code.",
          action: "Apply for a fresh certificate on Seva Sindhu showing Tahsildar sign and standard RD number (e.g. RD003...)."
        });
      }
    }

    if (claimsIncome) {
      if (incomeLimit === "yes") {
        verified.push("Income Certificate / Supernumerary Quota (SNQ) Eligibility (< 8 LPA)");
      } else if (incomeLimit === "no") {
        warnings.push({
          doc: "Income / SNQ Eligibility",
          reason: "Income certificate shows annual family income exceeding ₹8,00,000.",
          action: "You will not be eligible for the low-fee SNQ quota. Ensure you are ready for standard fees."
        });
      }
    }

    if (claimsRural) {
      if (rural10Years === "yes" && ruralBEO === "yes") {
        verified.push("Rural Study Certificate (1st to 10th standard + BEO countersigned)");
      } else {
        warnings.push({
          doc: "Rural Reserve Eligibility",
          reason: "Rural Certificate does not cover full 10 years of study, or lacks BEO countersignature.",
          action: "Collect study certificates from all schools attended between 1st and 10th standard and get each BEO countersigned."
        });
      }
    }

    if (claimsKannada) {
      if (kannada10Years === "yes" && kannadaBEO === "yes") {
        verified.push("Kannada Medium Study Certificate (1st to 10th standard + BEO countersigned)");
      } else {
        warnings.push({
          doc: "Kannada Medium Reserve Eligibility",
          reason: "Kannada Medium Certificate lacks BEO countersignature or doesn't cover 1st to 10th standard.",
          action: "Get the Kannada medium study certificate countersigned by the BEO of the school's respective district/block."
        });
      }
    }

    if (claimsHK) {
      if (hkAnnexureA === "yes") {
        verified.push("Hyderabad-Karnataka Article 371(j) Certificate (Annexure-A)");
      } else if (hkAnnexureA === "no") {
        warnings.push({
          doc: "371(j) HK Reservation Status",
          reason: "Missing Annexure-A certificate issued by Assistant Commissioner.",
          action: "Obtain Annexure-A certificate from the Assistant Commissioner of your sub-division to validate HK quota eligibility."
        });
      }
    }

    return { verified, warnings };
  };

  const { verified, warnings } = getComplianceResults();
  const currentStepInfo = stepsList[step];
  const StepIcon = currentStepInfo.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SEO
        title="Mock Document Verification Wizard – KCET Coded"
        description="Verify your KCET counseling certificates and study documents against official KEA compliance rules before verification begins."
        url="https://kcet-coded2.vercel.app/document-verification"
        keywords="KCET document verification, KEA document verification, study certificate BEO countersign, rural certificate BEO, Kannada medium certificate, KCET reservation check"
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <FileCheck className="h-7 w-7 text-indigo-400" />
          Mock Document Verification Assistant
        </h1>
        <p className="text-muted-foreground">
          Self-verify your certificates, application forms, and reservation claims to prevent rejection during official KEA verification.
        </p>
      </div>

      {/* Progress Header */}
      <div className="glass border border-white/5 rounded-2xl p-4 sm:p-5">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-semibold text-indigo-400">STEP {step + 1} OF {totalSteps}</span>
          <span className="text-muted-foreground">{currentStepInfo.title}</span>
        </div>
        <Progress value={((step + 1) / totalSteps) * 100} className="h-2 bg-white/5" />
      </div>

      <Card className="glass border-white/5 shadow-xl overflow-hidden relative min-h-[380px] flex flex-col justify-between">
        {/* Decorative ambient glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <StepIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{currentStepInfo.title}</CardTitle>
              <CardDescription>{currentStepInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Step 0: Candidature & Clause */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                      Have you studied for a minimum of 7 academic years in Karnataka between 1st standard and 2nd PUC/12th standard?
                    </Label>
                    <RadioGroup value={clauseA} onValueChange={setClauseA} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="clause-yes" />
                        <Label htmlFor="clause-yes" className="cursor-pointer">Yes (Meets Clause A)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="clause-no" />
                        <Label htmlFor="clause-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                      Do you have printed copies of your UGCET Online Application Form, Admit Card (Hall Ticket), and the final Confirmation Slip?
                    </Label>
                    <RadioGroup value={printedDocs} onValueChange={setPrintedDocs} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="print-yes" />
                        <Label htmlFor="print-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="print-no" />
                        <Label htmlFor="print-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 1: Academic & Core */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                      Do the spellings of your Name and your Parents' Names match EXACTLY across your SSLC (10th) Marks Card, PU (12th) Marks Card, and KCET Application Form?
                    </Label>
                    <RadioGroup value={namesMatch} onValueChange={setNamesMatch} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="names-yes" />
                        <Label htmlFor="names-yes" className="cursor-pointer">Yes, they match exactly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="names-no" />
                        <Label htmlFor="names-no" className="cursor-pointer">No, there are spelling discrepancies</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                      Do you have the Transfer Certificate (TC) issued by your Class 12 / PU College?
                    </Label>
                    <RadioGroup value={hasTC} onValueChange={setHasTC} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="tc-yes" />
                        <Label htmlFor="tc-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="tc-no" />
                        <Label htmlFor="tc-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 2: Study Certificate */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                      Is your Karnataka Study Certificate (confirming study in standard 1 to 12) signed and stamped by the Block Education Officer (BEO) or DDPI?
                    </Label>
                    <RadioGroup value={studyCertBEO} onValueChange={setStudyCertBEO} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="beo-yes" />
                        <Label htmlFor="beo-yes" className="cursor-pointer">Yes, signed & stamped by BEO</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="beo-no" />
                        <Label htmlFor="beo-no" className="cursor-pointer">No / Not yet</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-2 flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                      KEA strictly mandates countersignature from BEO/DDPI for study certificates to prevent allotment cancellation. Stamped signatures from Headmasters only are NOT accepted.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Reservation Selection */}
              {step === 3 && (
                <div className="space-y-5">
                  <Label className="text-sm font-bold text-slate-200">Select any reservations or quotas you claim in UGCET application:</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 rounded-xl p-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                      <Checkbox id="caste" checked={claimsCaste} onCheckedChange={(v) => setClaimsCaste(!!v)} />
                      <Label htmlFor="caste" className="text-sm font-medium cursor-pointer flex-1">Caste Reservation (OBC, SC, ST)</Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-xl p-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                      <Checkbox id="income" checked={claimsIncome} onCheckedChange={(v) => setClaimsIncome(!!v)} />
                      <Label htmlFor="income" className="text-sm font-medium cursor-pointer flex-1">Income Limit / SNQ Quota</Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-xl p-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                      <Checkbox id="rural" checked={claimsRural} onCheckedChange={(v) => setClaimsRural(!!v)} />
                      <Label htmlFor="rural" className="text-sm font-medium cursor-pointer flex-1">Rural Candidate Reservation</Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-xl p-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                      <Checkbox id="kannada" checked={claimsKannada} onCheckedChange={(v) => setClaimsKannada(!!v)} />
                      <Label htmlFor="kannada" className="text-sm font-medium cursor-pointer flex-1">Kannada Medium Reservation</Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-xl p-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all sm:col-span-2">
                      <Checkbox id="hk" checked={claimsHK} onCheckedChange={(v) => setClaimsHK(!!v)} />
                      <Label htmlFor="hk" className="text-sm font-medium cursor-pointer flex-1">Hyderabad-Karnataka (Article 371j) Quota</Label>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Note: General Merit (GM) students who do not claim any quotas can leave these unchecked and proceed.
                  </p>
                </div>
              )}

              {/* Step 4: Reservation details */}
              {step === 4 && (
                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-1">
                  {claimsCaste && (
                    <div className="space-y-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Caste Reservation</Badge>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Is your Category certificate issued by a competent Tahsildar in Karnataka?
                        </Label>
                        <RadioGroup value={casteTahisldar} onValueChange={setCasteTahisldar} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="caste-tah-yes" />
                            <Label htmlFor="caste-tah-yes" className="text-xs cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="caste-tah-no" />
                            <Label htmlFor="caste-tah-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Does your Category certificate have a valid, digital Revenue Department (RD) number starting with RD?
                        </Label>
                        <RadioGroup value={casteRD} onValueChange={setCasteRD} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="caste-rd-yes" />
                            <Label htmlFor="caste-rd-yes" className="text-xs cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="caste-rd-no" />
                            <Label htmlFor="caste-rd-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {claimsIncome && (
                    <div className="space-y-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Income / SNQ Quota</Badge>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Is your annual family income less than ₹8,00,000 (8 LPA) shown on your Income certificate?
                        </Label>
                        <RadioGroup value={incomeLimit} onValueChange={setIncomeLimit} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="inc-yes" />
                            <Label htmlFor="inc-yes" className="text-xs cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="inc-no" />
                            <Label htmlFor="inc-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {claimsRural && (
                    <div className="space-y-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Rural Quota</Badge>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Have you studied in rural areas of Karnataka for 10 full years from 1st standard to 10th standard?
                        </Label>
                        <RadioGroup value={rural10Years} onValueChange={setRural10Years} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="rur-10-yes" />
                            <Label htmlFor="rur-10-yes" className="text-xs cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="rur-10-no" />
                            <Label htmlFor="rur-10-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Is your Rural Certificate signed by your School Headmaster and countersigned by the respective BEO?
                        </Label>
                        <RadioGroup value={ruralBEO} onValueChange={setRuralBEO} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="rur-beo-yes" />
                            <Label htmlFor="rur-beo-yes" className="text-xs cursor-pointer">Yes, verified by BEO</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="rur-beo-no" />
                            <Label htmlFor="rur-beo-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {claimsKannada && (
                    <div className="space-y-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">Kannada Medium Quota</Badge>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Have you studied in Kannada Medium standard 1 to 10 for full 10 academic years?
                        </Label>
                        <RadioGroup value={kannada10Years} onValueChange={setKannada10Years} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="kan-10-yes" />
                            <Label htmlFor="kan-10-yes" className="text-xs cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="kan-10-no" />
                            <Label htmlFor="kan-10-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Is your Kannada Medium certificate countersigned by the Block Education Officer (BEO)?
                        </Label>
                        <RadioGroup value={kannadaBEO} onValueChange={setKannadaBEO} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="kan-beo-yes" />
                            <Label htmlFor="kan-beo-yes" className="text-xs cursor-pointer">Yes, verified by BEO</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="kan-beo-no" />
                            <Label htmlFor="kan-beo-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {claimsHK && (
                    <div className="space-y-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Hyderabad-Karnataka Quota</Badge>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300">
                          Do you possess the Article 371(j) Annexure-A certificate issued by the competent Assistant Commissioner?
                        </Label>
                        <RadioGroup value={hkAnnexureA} onValueChange={setHkAnnexureA} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="hk-yes" />
                            <Label htmlFor="hk-yes" className="text-xs cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="hk-no" />
                            <Label htmlFor="hk-no" className="text-xs cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Verification Report */}
              {step === 5 && (
                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-sm font-bold flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-indigo-400" /> UGCET Verification Compliance
                    </span>
                    <Badge variant="outline" className={warnings.length > 0 ? "border-amber-500/20 text-amber-400 bg-amber-500/5" : "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"}>
                      {warnings.length > 0 ? `${warnings.length} Warnings Found` : "Perfectly Compliant ✓"}
                    </Badge>
                  </div>

                  {warnings.length > 0 ? (
                    <div className="space-y-4">
                      <Alert className="border-amber-500/20 bg-amber-500/5 rounded-xl">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="text-amber-400 font-bold text-sm">Action Required for Verification Approval</AlertTitle>
                        <AlertDescription className="text-slate-300 text-xs">
                          Please resolve the warning issues listed below prior to the official KEA document portal submission window.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3">
                        {warnings.map((warn, i) => (
                          <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-rose-400">{warn.doc}</span>
                              <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">REJECTION RISK</Badge>
                            </div>
                            <p className="text-xs text-slate-300">{warn.reason}</p>
                            <div className="text-xs bg-black/40 border border-white/5 p-3 rounded-lg text-emerald-400 flex items-start gap-2">
                              <Info className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                              <div>
                                <span className="font-bold text-[10px] uppercase text-emerald-500 block mb-0.5">How to resolve:</span>
                                {warn.action}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Alert className="border-emerald-500/20 bg-emerald-500/5 rounded-xl">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <AlertTitle className="text-emerald-400 font-bold text-sm">All Documents Compliant!</AlertTitle>
                      <AlertDescription className="text-slate-300 text-xs">
                        Based on your inputs, your documents are fully compliant with KEA guidelines. Make sure you organize them in the exact order requested by KEA.
                      </AlertDescription>
                    </Alert>
                  )}

                  {verified.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 block">Verified Checkpoints:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {verified.map((vItem, i) => (
                          <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{vItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/5 pt-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 p-4">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-1">
                      <Info className="h-3.5 w-3.5 text-emerald-400" /> Reminders on Copies:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      You are required to carry/upload **original certificates + 3 complete sets of copies** (making a total of **4 sets** of each document). Keep 1 copy strictly for your personal record as colleges might collect the originals.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <div className="border-t border-white/5 p-4 sm:p-5 flex justify-between gap-4 bg-black/25">
          {step > 0 ? (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="border-white/10 hover:bg-white/5 text-xs font-semibold rounded-xl flex items-center gap-1.5 h-10 px-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 h-10 px-5 shadow-lg shadow-indigo-500/15"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-indigo-500/20 hover:bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 h-10 px-5"
            >
              <RotateCcw className="h-4 w-4 animate-spin-slow" /> Reset Check
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
