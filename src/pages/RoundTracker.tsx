import { SEO } from "@/components/SEO"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  ArrowRight,
  ShieldCheck,
  FileText,
  Building2,
  ExternalLink,
  Info,
  HelpCircle
} from "lucide-react"

interface RoundStatus {
  id: string
  name: string
  status: 'completed' | 'active' | 'upcoming' | 'cancelled'
  startDate: string
  endDate: string
  progress: number
  description: string
  alerts: string[]
}

const RoundTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all')

  const [rounds] = useState<RoundStatus[]>([
    {
      id: 'mock_round',
      name: 'Stage 1: Verification & Mock Allotment',
      status: 'completed',
      startDate: '2026-06-20',
      endDate: '2026-07-09',
      progress: 100,
      description: 'Document verification, initial choice entry, and mock seat allotment result.',
      alerts: [
        'UGCET Option Entry was open from June 20 to June 30, 2026.',
        'Mock Seat Allotment results declared on July 6, 2026.',
        'Option editing window closed on July 9, 2026.'
      ]
    },
    {
      id: 'round1_allotment',
      name: 'Stage 2: Round 1 Seat Allotment',
      status: 'completed',
      startDate: '2026-07-13',
      endDate: '2026-07-15',
      progress: 100,
      description: 'Provisional allotment, objection window, and publication of final Round 1 seat allotment.',
      alerts: [
        'Provisional Seat Allotment declared on July 13, 2026.',
        'Objection window closed on July 14, 2026 (5:00 PM).',
        'Final Round 1 Seat Allotment declared on July 15, 2026.'
      ]
    },
    {
      id: 'round1_post',
      name: 'Stage 3: Round 1 Choice Entry & College Reporting',
      status: 'completed',
      startDate: '2026-07-16',
      endDate: '2026-07-24',
      progress: 100,
      description: 'Post-allotment choice selection (Choice 1/2/3/4), fee payment, and college reporting.',
      alerts: [
        'Choice Selection & Payment window concluded.',
        'Choice 1 candidates reported to allotted colleges with original documents.'
      ]
    },
    {
      id: 'round2',
      name: 'Stage 4: Round 2 Option Entry & Seat Allotment',
      status: 'active',
      startDate: '2026-08-07',
      endDate: '2026-08-13',
      progress: 65,
      description: 'Live option entry modification, fresh option additions, and Round 2 seat allotment.',
      alerts: [
        '🟢 LIVE NOW: KCET 2026 Round 2 Option Entry portal is ACTIVE on cetonline.karnataka.gov.in!',
        '📝 FRESH OPTIONS ALLOWED: Candidates (Choice 2, Choice 3 & unallotted) CAN add fresh options, re-order preferences, or delete unwanted options.',
        '⏰ DEADLINE: Option entry closes on August 13, 2026 (until 9:00 AM sharp).',
        '📊 Provisional Seat Allotment results will be declared on August 19, 2026 (after 10:00 AM).'
      ]
    },
    {
      id: 'round3_extended',
      name: 'Stage 5: Extended Round (Mop-Up / Round 3)',
      status: 'upcoming',
      startDate: '2026-08-20',
      endDate: 'TBA',
      progress: 0,
      description: 'Final counseling round for remaining unfilled engineering, architecture & farm science seats.',
      alerts: [
        'Eligible candidates with no seat allotted or holding Choice 2/3 will be allowed to participate.',
        'Final physical reporting and admission confirmation.'
      ]
    }
  ])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredRounds = rounds.filter(r => activeFilter === 'all' || r.status === activeFilter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
      case 'active':
        return <Clock className="h-5 w-5 text-indigo-400 animate-pulse shrink-0" />
      case 'upcoming':
        return <Calendar className="h-5 w-5 text-amber-400 shrink-0" />
      default:
        return <Bell className="h-5 w-5 text-slate-400 shrink-0" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Completed</Badge>
      case 'active':
        return <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 animate-pulse">Active Now</Badge>
      case 'upcoming':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Upcoming</Badge>
      default:
        return <Badge variant="outline">Scheduled</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (dateString === 'TBA') return 'To be announced'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8 pb-10">
      <SEO
        title="KCET 2026 Counseling Round Tracker – Real-Time Schedule & Choice Entry Guide"
        description="Track all KCET 2026 counseling stages, Round 1 choice entry deadlines, fee payment windows, college reporting dates, and Round 2 notifications in real time."
        url="https://kcetcoded.dev/round-tracker"
        keywords="KCET counseling rounds, KCET 2026 dates, KCET round 1 choice entry, KCET choice 1 choice 2, KEA counseling schedule, KCET reporting date"
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" />
              <span>Live Counseling Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              KCET 2026 Counseling Round Tracker
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Stay up-to-date with official KEA counseling timelines, Choice 1–4 entry guidelines, online fee payment windows, and college reporting checklists.
            </p>
          </div>

          <a 
            href="https://cetonline.karnataka.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <span>KEA Candidate Portal</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Official KEA Option Entry Update Callout Banner */}
      <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-200 p-4 sm:p-5 rounded-2xl flex items-start gap-3 shadow-md">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <AlertTitle className="text-sm font-bold text-emerald-300 flex flex-wrap items-center gap-2">
            <span>OFFICIAL KEA 2026 UPDATE: Candidates Allowed to Add Fresh Options in Round 2</span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px] uppercase font-mono">
              Policy Confirmed
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-xs leading-relaxed text-emerald-200/90">
            Candidates participating in Round 2 and Extended Rounds (holding Choice 2 / Choice 3 or unallotted) <strong>ARE PERMITTED to add fresh new college and branch options</strong> to their option entry sheet. You are no longer restricted to only re-ordering previously entered options.
          </AlertDescription>
        </div>
      </Alert>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass border-white/5 bg-slate-950/60">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Concluded Stage</p>
              <p className="text-lg font-bold text-white mt-0.5">Round 1 Allotment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-500/10">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Clock className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Phase (Live)</p>
              <p className="text-lg font-bold text-white mt-0.5">Round 2 Option Entry</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/5 bg-slate-950/60">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Upcoming Phase</p>
              <p className="text-lg font-bold text-white mt-0.5">Round 2 Allotment (Aug 19)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {(['all', 'active', 'upcoming', 'completed'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'glass text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {filter} Rounds
          </button>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="space-y-4">
        {filteredRounds.map((round) => (
          <Card key={round.id} className={`glass transition-all ${round.status === 'active' ? 'border-indigo-500/40 bg-slate-950/90 shadow-lg shadow-indigo-500/10' : 'border-white/5 bg-slate-950/50'}`}>
            <CardHeader className="p-5 sm:p-6 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(round.status)}
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-white">{round.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-0.5">{round.description}</CardDescription>
                  </div>
                </div>
                <div>{getStatusBadge(round.status)}</div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              {/* Progress Bar */}
              {(round.status === 'active' || round.status === 'completed') && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Completion Progress</span>
                    <span className="text-white font-semibold">{round.progress}%</span>
                  </div>
                  <Progress value={round.progress} className="h-2 bg-slate-800" />
                </div>
              )}

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Start Date</span>
                  <span className="text-white font-semibold mt-0.5 block">{formatDate(round.startDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">End Date</span>
                  <span className="text-white font-semibold mt-0.5 block">{formatDate(round.endDate)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-medium">Status Note</span>
                  <span className="text-indigo-300 font-medium mt-0.5 block">
                    {round.status === 'completed' ? 'Phase Concluded' : round.status === 'active' ? 'Action Required on KEA Portal' : 'Awaiting Schedule Release'}
                  </span>
                </div>
              </div>

              {/* Alerts & Steps */}
              {round.alerts.length > 0 && (
                <div className="space-y-2">
                  {round.alerts.map((alertText, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl border border-white/5 bg-slate-900/60 text-xs text-slate-300 leading-relaxed font-normal">
                      <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{alertText}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Choice Selection Guide (Crucial Information) */}
      <Card className="glass border-indigo-500/20 bg-slate-950/80 p-6 space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Post-Allotment Choice Entry Guide</span>
          </div>
          <h2 className="text-xl font-bold text-white">Understanding Choice 1, 2, 3 & 4 Options</h2>
          <p className="text-xs text-slate-400">
            After seat allotment is declared, every candidate MUST exercise one of the 4 choices within the specified deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Choice 1 */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-sm">Choice 1: Accept & Freeze</span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Final Admission</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Candidate is 100% satisfied with the allotted seat and does NOT wish to participate in subsequent counseling rounds.
            </p>
            <div className="text-slate-400 space-y-1 pt-1 border-t border-emerald-500/10">
              <span className="block font-medium text-emerald-300">Action Required:</span>
              <span>1. Pay prescribed course fee online or via challan.<br />2. Download Admission Order.<br />3. Report to college with original documents before deadline.</span>
            </div>
          </div>

          {/* Choice 2 */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 text-sm">Choice 2: Accept & Upgrade</span>
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px]">Hold & Next Round</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Candidate is satisfied with current seat, but wants to hold it while participating in Round 2 for higher preference options.
            </p>
            <div className="text-slate-400 space-y-1 pt-1 border-t border-indigo-500/10">
              <span className="block font-medium text-indigo-300">Action Required:</span>
              <span>1. Pay prescribed course fee for current seat.<br />2. Participate in Round 2 (<strong>You CAN add fresh college options</strong>, reorder, or delete options).<br />3. If higher option allotted in R2, current seat is automatically cancelled and upgraded.</span>
            </div>
          </div>

          {/* Choice 3 */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 text-sm">Choice 3: Reject & Upgrade</span>
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">Reject Current Seat</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Candidate is NOT satisfied with the allotted seat, forfeits it, and wishes to enter Round 2 to try for higher preferences.
            </p>
            <div className="text-slate-400 space-y-1 pt-1 border-t border-amber-500/10">
              <span className="block font-medium text-amber-300">Action Required:</span>
              <span>1. No fee payment for current seat.<br />2. Enter Round 2 option entry (<strong>You CAN add fresh college options</strong>, reorder, or delete options).<br />3. Current seat is released for other candidates.</span>
            </div>
          </div>

          {/* Choice 4 */}
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 text-sm">Choice 4: Reject & Exit</span>
              <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">Exit Counseling</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Candidate is not satisfied with the allotted seat and wishes to quit the KCET 2026 seat allotment process completely.
            </p>
            <div className="text-slate-400 space-y-1 pt-1 border-t border-rose-500/10">
              <span className="block font-medium text-rose-300">Action Required:</span>
              <span>1. No fee payment.<br />2. Candidate is removed from all future rounds.</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Documents Checklist for College Reporting */}
      <Card className="glass border-white/10 bg-slate-950/60 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Document Checklist for College Reporting (Choice 1)</h3>
            <p className="text-xs text-slate-400">Original documents required when reporting to allotted colleges</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            'KEA Final Seat Allotment Letter / Admission Order',
            'Online Fee Payment Receipt / Stamped Bank Challan',
            'KCET 2026 Application Form Printout & Verification Slip',
            'KCET 2026 Admit Card / Hall Ticket',
            '10th / SSLC Marks Card (Proof of Date of Birth)',
            '12th / 2nd PUC Marks Card',
            'Study Certificates (7 Years Study in Karnataka verified by BEO)',
            'Rural / Kannada Medium / Reservation Certificates (if applicable)',
            'Caste & Income Certificate (issued by Tahsildar if applicable)',
            '4 Recent Passport Size Photographs'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl border border-white/5 bg-white/5 text-slate-200 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default RoundTracker