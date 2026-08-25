import { SEO } from "@/components/SEO"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Clock,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building2,
  Check
} from "lucide-react"

interface RoundStage {
  id: string
  stageNumber: number
  title: string
  status: 'completed' | 'active' | 'upcoming'
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
  actionRequired?: string
}

const COUNSELING_STAGES: RoundStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Document Verification & Mock Seat Allotment',
    status: 'completed',
    startDate: '2026-06-20',
    endDate: '2026-07-09',
    summary: 'Candidate registration, offline/online document verification, initial choice entry, and mock seat allotment.',
    highlights: [
      'Option Entry portal was open from June 20 to June 30, 2026.',
      'Mock Allotment results declared on July 6, 2026.',
      'Option modification window concluded on July 9, 2026.'
    ]
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Round 1 Seat Allotment & Cutoffs',
    status: 'completed',
    startDate: '2026-07-13',
    endDate: '2026-07-15',
    summary: 'Provisional allotment, grievance/objection window, and official Round 1 final seat allotment declaration.',
    highlights: [
      'Provisional Allotment published on July 13, 2026.',
      'Objection window closed on July 14, 2026 (5:00 PM).',
      'Final Round 1 seat allotment and cutoffs published on July 15, 2026.'
    ]
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Round 1 Choice Selection & Reporting',
    status: 'completed',
    startDate: '2026-07-16',
    endDate: '2026-07-25',
    summary: 'Post-allotment choice selection (Choice 1 to 4), online fee payment, admission order download, and reporting.',
    highlights: [
      'Choice 1 candidates paid fees and reported to colleges.',
      'Choice 2 & Choice 3 candidates moved forward to Round 2 with options retained/modified.'
    ]
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Round 2 Final Allotment & College Reporting',
    status: 'active',
    startDate: '2026-08-23',
    endDate: '2026-08-28',
    summary: 'Round 2 provisional cutoffs released, final allotment published, online fee payment, and mandatory college reporting.',
    highlights: [
      'Provisional Allotment & Cutoffs published on August 23, 2026.',
      'Final Round 2 Allotment declared on August 24, 2026.',
      'Choice Selection & Online Fee Payment Window: August 25 – August 27, 2026.',
      'Last Date to Report to Allotted College: August 28, 2026 (before 5:30 PM).'
    ],
    actionRequired: 'Allotted candidates must select Choice 1 (Accept) or Choice 4 (Exit), complete fee payment, download Admission Order, and report to college by Aug 28.'
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'Round 3 / Second Extended (Mop-Up) Round',
    status: 'upcoming',
    startDate: '2026-09-02',
    endDate: 'TBA',
    summary: 'Final counseling round for leftover vacant seats in engineering, architecture, and agricultural courses.',
    highlights: [
      'Seat Vacancy Matrix will be published after Round 2 college reporting concludes.',
      'Eligible unallotted candidates and mop-up registrants will be able to enter fresh choices.',
      'Final physical reporting and spot admissions.'
    ],
    actionRequired: 'Awaiting official KEA notification & seat matrix release in early September 2026.'
  }
]

const REPORTING_DOCS = [
  'KEA Final Seat Allotment Letter / Admission Order (Original)',
  'Online Fee Payment Receipt or Stamped Bank Challan Copy',
  'KCET 2026 Application Form Printout & Verification Slip',
  'KCET 2026 Admit Card / Hall Ticket',
  'SSLC / 10th Standard Marks Card (Date of Birth Proof)',
  '2nd PUC / 12th Standard Marks Card',
  'Study Certificate (7 Years study in Karnataka attested by BEO/DDPU)',
  'Rural / Kannada Medium Study Certificates (if claimed)',
  'Caste / Income / Category Certificate (valid form from Tahsildar)',
  '4 Recent Passport Size Photographs & Government Photo ID Proof'
]

export default function RoundTracker() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all')
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(['stage-4']))
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set())

  const toggleStage = (id: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDoc = (index: number) => {
    setCheckedDocs(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const filteredStages = useMemo(() => {
    if (activeTab === 'all') return COUNSELING_STAGES
    return COUNSELING_STAGES.filter(s => s.status === activeTab)
  }, [activeTab])

  const formatDate = (dateStr: string) => {
    if (dateStr === 'TBA') return 'September 2026 (TBA)'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-2 px-4 sm:px-6">
      <SEO
        title="KCET 2026 Counseling Round Tracker – Real-Time Schedule & Choice Entry Guide"
        description="Track KCET 2026 counseling stages in real time: Round 2 final allotment, fee payment dates, college reporting deadline (Aug 28), and Round 3 mop-up schedule."
        url="https://kcetcoded.dev/round-tracker"
        keywords="KCET counseling tracker, KCET 2026 dates, KCET round 2 reporting, KCET choice 1 choice 4, KEA counseling schedule, KCET round 3 dates"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Live Counseling Timeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">KCET 2026 Round Tracker</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official KEA counseling progression, active Round 2 deadlines, and reporting checklist.
          </p>
        </div>

        <a
          href="https://cetonline.karnataka.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors self-start sm:self-auto border border-white/10"
        >
          <span>KEA Portal</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Active Phase Callout Banner */}
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-5 sm:p-6 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] uppercase font-mono tracking-wider">
              Active Stage Now
            </Badge>
            <span className="text-xs text-emerald-400 font-medium">Stage 4: Round 2 Final Allotment & Reporting</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Reporting Deadline: <strong className="text-white">Aug 28, 2026 (5:30 PM)</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">STEP 1</span>
              <Badge variant="outline" className="text-[9px] border-white/10 text-slate-300">Aug 25–27</Badge>
            </div>
            <p className="text-xs font-semibold text-white">Choice Selection (1 or 4)</p>
            <p className="text-[11px] text-muted-foreground">Log in to KEA portal and confirm your decision.</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">STEP 2</span>
              <Badge variant="outline" className="text-[9px] border-white/10 text-emerald-400">Online / Challan</Badge>
            </div>
            <p className="text-xs font-semibold text-white">Tuition Fee Payment</p>
            <p className="text-[11px] text-muted-foreground">Pay fees & download the official Admission Order.</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">STEP 3</span>
              <Badge className="text-[9px] bg-amber-500/20 text-amber-300 border-amber-500/30">By Aug 28</Badge>
            </div>
            <p className="text-xs font-semibold text-white">Physical College Reporting</p>
            <p className="text-[11px] text-muted-foreground">Submit original certificates at allotted college.</p>
          </div>
        </div>
      </div>

      {/* Stages Filter & List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Counseling Stages Timeline</h2>
          <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/5">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Done' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredStages.map((stage) => {
            const isExpanded = expandedStages.has(stage.id)
            return (
              <div
                key={stage.id}
                className={`rounded-xl border transition-all ${
                  stage.status === 'active'
                    ? 'bg-card/70 border-indigo-500/30 shadow-sm'
                    : 'bg-card/30 border-white/5 hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => toggleStage(stage.id)}
                  className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      stage.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : stage.status === 'active'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse'
                        : 'bg-white/5 text-muted-foreground border border-white/10'
                    }`}>
                      {stage.status === 'completed' ? <Check className="h-3.5 w-3.5" /> : stage.stageNumber}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-white">
                          {stage.title}
                        </span>
                        {stage.status === 'active' && (
                          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[9px] uppercase font-mono py-0 px-1.5">
                            Live
                          </Badge>
                        )}
                        {stage.status === 'completed' && (
                          <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[9px] py-0 px-1.5">
                            Completed
                          </Badge>
                        )}
                        {stage.status === 'upcoming' && (
                          <Badge variant="outline" className="border-white/10 text-muted-foreground text-[9px] py-0 px-1.5">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(stage.startDate)} — {formatDate(stage.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="text-muted-foreground shrink-0 mt-1 sm:mt-0">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/5 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {stage.summary}
                    </p>

                    <div className="space-y-1.5 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Key Milestones & Updates
                      </span>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {stage.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-mono text-[10px] mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {stage.actionRequired && (
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                        <AlertCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong>Action:</strong> {stage.actionRequired}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Choice Entry Decision Rules */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <span>Choice 1, 2, 3 & 4 Selection Rules</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quick reference guide for post-allotment decisions in KCET counseling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">Choice 1: Accept & Freeze</span>
              <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-[9px]">Admission</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Satisfied with the allotted seat. Confirms admission, pays fee, downloads Admission Order, and reports to college.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400">Choice 2: Hold & Upgrade (Round 1 only)</span>
              <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[9px]">Upgrade</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Holds current seat and participates in subsequent round for higher preferences. If upgraded, old seat is released.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">Choice 3: Reject & Next Round (Round 1 only)</span>
              <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[9px]">Next Round</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Surrenders allotted seat completely and enters next round to compete for higher choices without holding any seat.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">Choice 4: Reject & Exit</span>
              <Badge className="bg-rose-500/10 text-rose-300 border-rose-500/20 text-[9px]">Exit</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Not interested in the allotted seat and exits the KCET 2026 seat allotment process entirely.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Reporting Document Checklist */}
      <div className="rounded-2xl border border-white/5 bg-card/40 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>College Reporting Document Checklist (Choice 1)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Check off your original certificates before physical reporting at your allotted college.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 self-start sm:self-auto">
            {checkedDocs.size} of {REPORTING_DOCS.length} ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {REPORTING_DOCS.map((doc, idx) => {
            const isChecked = checkedDocs.has(idx)
            return (
              <button
                key={idx}
                onClick={() => toggleDoc(idx)}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-colors ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-white/[0.02] border-white/5 text-muted-foreground hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                  isChecked
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'border-white/20 bg-transparent'
                }`}>
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span className="leading-snug">{doc}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}