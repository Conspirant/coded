import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  ArrowRight,
  Timer
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
  const [rounds, setRounds] = useState<RoundStatus[]>([
    {
      id: 'round1',
      name: 'Round 1',
      status: 'completed',
      startDate: '2025-07-08',
      endDate: '2025-08-15',
      progress: 100,
      description: 'First round of counseling completed - Option entry: July 8-29, Final results: August 2',
      alerts: ['All allotments have been finalized', 'Fee payment deadline has passed', 'Last date to report to colleges: August 15, 2025']
    },
    {
      id: 'round2',
      name: 'Round 2',
      status: 'completed',
      startDate: '2025-08-21',
      endDate: '2025-09-04',
      progress: 100,
      description: 'Second round of counseling completed - Option entry: August 21-26, Final results: August 30',
      alerts: ['Round 2 has concluded', 'Final seat allotment declared on August 30, 2025', 'Last date to report to colleges: September 4, 2025']
    },
    {
      id: 'round3',
      name: 'Round 3 (Final Results)',
      status: 'completed',
      startDate: '2025-09-06',
      endDate: '2025-09-13',
      progress: 100,
      description: 'Final round of counseling completed - Results declared, admission process ongoing',
      alerts: ['✅ Third Round Results Declared - Final results published for UGCET courses', '📋 Admission Process: Download Seat Confirmation Slip and report to college with originals before 13th September', '💰 Fee Details: If already paid, balance will be adjusted; if more required, pay via challan/online', '⚠️ Mandatory Reporting: Students allotted seats must join college - Penalty of 5× course fee + 4-year ban if skipped', '🎓 Engineering: Last date of admission (AICTE): 15th September - Unallotted seats will be handed over to colleges', '🩺 Medical/Dental: Admissions depend on MCC schedule (repeatedly delayed) - NMC still approving new colleges & extra seats', '🧘 AYUSH: Fresh option entry from 15–17 September - Will be clubbed with Medical & Dental in next MCC-linked round', '🚫 No Further Rounds: No additional rounds for UGCET courses - Engineering vacant seats will be used for next year DCET Lateral Entry']
    }
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'upcoming':
        return <Calendar className="h-5 w-5 text-orange-500" />
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
      case 'active':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Active</Badge>
      case 'upcoming':
        return <Badge variant="outline" className="border-orange-300 text-orange-700">Upcoming</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (dateString === 'TBA') {
      return 'To be announced'
    }
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getTimeUntilNextRound = () => {
    const nextRound = rounds.find(round => round.status === 'upcoming')
    if (!nextRound) return null

    // Check if schedule is not yet announced
    if (nextRound.startDate === 'TBA' || nextRound.endDate === 'TBA') {
      return 'TBA'
    }

    const nextRoundDate = new Date(nextRound.startDate)
    const now = currentTime
    const diff = nextRoundDate.getTime() - now.getTime()

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return { days, hours, minutes }
  }

  const timeUntilNext = getTimeUntilNextRound()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Round Tracker & Alerts</h1>
        <p className="text-foreground/70">Stay updated with KCET counseling rounds and notifications</p>
      </div>

      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Latest Completed Round</p>
                <p className="text-2xl font-bold">Round 3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <p className="text-2xl font-bold text-orange-600">
                  Admission Process
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Round Status Cards */}
      <div className="space-y-4">
        {rounds.map((round) => (
          <Card key={round.id} className={`${round.status === 'active' ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(round.status)}
                  <div>
                    <CardTitle className="text-xl">{round.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{round.description}</p>
                  </div>
                </div>
                {getStatusBadge(round.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              {(round.status === 'active' || round.status === 'completed') && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">Progress</span>
                    <span className="text-foreground font-semibold">{round.progress}%</span>
                  </div>
                  <Progress value={round.progress} className="h-3" />
                  <div className="text-xs text-muted-foreground">
                    {round.status === 'completed' ? 'Round completed successfully' : 'Round in progress'}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                  <p className="text-sm">{formatDate(round.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">End Date</p>
                  <p className="text-sm">{formatDate(round.endDate)}</p>
                </div>
              </div>


              {/* Alerts */}
              {round.alerts.length > 0 && (
                <div className="space-y-2">
                  {round.alerts.map((alert, index) => (
                    <Alert key={index} className={round.status === 'active' ? 'border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800' : 'border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700'}>
                      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <AlertDescription className="text-sm text-slate-900 dark:text-slate-100 font-medium">{alert}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Important Notices */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Bell className="h-5 w-5" />
            Important Notices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>✅ Round 3 Results Declared!</strong> KEA has published the final results of the 3rd round for UGCET courses (Engineering, Farm Sciences, Veterinary, Nursing, Allied Health Sciences, D. Pharma, etc.).
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>📋 Admission Process:</strong> Students must download the Seat Confirmation Slip and report to the allotted college with all original documents before <strong>13th September</strong>.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>⚠️ Mandatory Reporting:</strong> Students allotted seats must join the college. If they skip: Penalty of 5× course fee + 4-year ban from KEA counseling.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>🎓 Engineering Deadlines:</strong> Last date of admission (AICTE): 15th September. After that, unallotted seats will be handed over to colleges.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>🩺 Medical/Dental:</strong> Admissions depend on MCC schedule (repeatedly delayed). NMC is still approving new colleges & extra seats.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>🧘 AYUSH Courses:</strong> Fresh option entry will open from 15–17 September. Will be clubbed with Medical & Dental allotments in the next MCC-linked round.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>🚫 No Further Rounds:</strong> There will be no additional rounds of counseling for UGCET and Engineering courses. Engineering vacant seats will be used for next year's DCET Lateral Entry.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoundTracker