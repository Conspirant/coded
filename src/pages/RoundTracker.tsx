import { SEO } from "@/components/SEO"
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
      id: 'mock_round',
      name: 'Mock Allotment & Option Entry',
      status: 'completed',
      startDate: '2026-06-20',
      endDate: '2026-07-09',
      progress: 100,
      description: 'Choice entry and mock seat allotment window.',
      alerts: [
        'UGCET Option Entry was open from June 20 to June 30, 2026.',
        'Mock Seat Allotment results were declared on July 6, 2026.',
        'Option modification window closed on July 9, 2026, at 10:00 AM.'
      ]
    },
    {
      id: 'round1',
      name: 'Round 1 Seat Allotment',
      status: 'active',
      startDate: '2026-07-13',
      endDate: '2026-07-20',
      progress: 60,
      description: 'First round of seat allotment and admission process.',
      alerts: [
        '✅ Round 1 Provisional Seat Allotment declared on July 13, 2026.',
        '⏰ Objection window for provisional allotment closed on July 14, 2026, at 5:00 PM.',
        '📢 Final Round 1 Seat Allotment will be declared on July 15, 2026 (after 11:00 AM).',
        '📋 Candidates must exercise their choices (Freeze/Slide/Float) and pay fees online after final allotment.'
      ]
    },
    {
      id: 'round2',
      name: 'Round 2',
      status: 'upcoming',
      startDate: 'TBA',
      endDate: 'TBA',
      progress: 0,
      description: 'Second round of counseling and allotment.',
      alerts: [
        'Detailed schedule for Round 2 choice filling and allotment will be released after Round 1 concludes.',
        'AYUSH/Medical/Dental choice updates will align with MCC guidelines.'
      ]
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
      <SEO
        title="KCET 2026 Counseling Round Tracker – Dates, Deadlines & Alerts"
        description="Track all KCET 2026 counseling rounds, deadlines, and important dates. Get real-time updates on Round 1, Round 2, Round 3, fee payment dates, and document verification schedules."
        url="https://kcet-coded2.vercel.app/round-tracker"
        keywords="KCET counseling rounds, KCET 2026 counseling dates, KCET round 1 date, KCET round 2 date, KCET round 3, KEA counseling schedule, KCET admission deadlines"
      />
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
                <p className="text-2xl font-bold">Mock Allotment</p>
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
                  Round 1 (Ongoing)
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
              <strong>✅ Round 1 Provisional Allotment Declared!</strong> KEA has declared the provisional seat allotment for UGCET 2026 courses on July 13, 2026.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>⏰ Objections Window:</strong> Candidates had time until July 14, 2026 (5:00 PM) to raise objections or report discrepancies in their provisional allotment.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>📢 Final Round 1 Seat Allotment:</strong> The final allotment result for Round 1 is scheduled for declaration on July 15, 2026 (after 11:00 AM).
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>📋 Post-Allotment Process:</strong> Candidates must log in to submit their choices (Freeze/Slide/Float), complete the fee payment, and download their admission orders.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-orange-600 mt-1" />
            <p className="text-sm text-orange-800">
              <strong>🏫 College Reporting:</strong> Allotted candidates must report to their respective colleges along with original documents within the specified deadline after final allotment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoundTracker