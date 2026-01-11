import { useState, useEffect } from "react"
import { Clock, Calendar, Zap } from "lucide-react"

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

const CountdownTimer = () => {
    // CET 2026 exam date: April 23, 2026 at 10:30 AM IST
    const targetDate = new Date("2026-04-23T10:30:00+05:30").getTime()

    const calculateTimeLeft = (): TimeLeft => {
        const now = new Date().getTime()
        const difference = targetDate - now

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        }
    }

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
    const [isUrgent, setIsUrgent] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft()
            setTimeLeft(newTimeLeft)
            // Mark as urgent when less than 30 days remain
            setIsUrgent(newTimeLeft.days < 30)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatNumber = (num: number) => num.toString().padStart(2, '0')

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className={`
        relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center
        ${isUrgent
                    ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/25'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25'
                }
        transition-all duration-500
      `}>
                <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {formatNumber(value)}
                </span>
                {/* Animated pulse ring for urgency */}
                {isUrgent && (
                    <div className="absolute inset-0 rounded-xl animate-ping bg-red-500/20" style={{ animationDuration: '2s' }} />
                )}
            </div>
            <span className="mt-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {label}
            </span>
        </div>
    )

    const isExamOver = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

    if (isExamOver) {
        return (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-center gap-3">
                    <Zap className="h-8 w-8 animate-pulse" />
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">CET 2026 Has Begun!</h3>
                        <p className="text-green-100/90">Best of luck to all aspirants! 🎯</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`
      relative overflow-hidden rounded-xl p-5 sm:p-6
      ${isUrgent
                ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/50 dark:via-orange-950/50 dark:to-yellow-950/50 border-2 border-red-200 dark:border-red-800/50'
                : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/50 dark:via-indigo-950/50 dark:to-blue-950/50 border-2 border-purple-200 dark:border-purple-800/50'
            }
    `}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Clock className="w-full h-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-500' : 'bg-purple-600'}`}>
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${isUrgent ? 'text-red-700 dark:text-red-400' : 'text-purple-700 dark:text-purple-400'}`}>
                            CET 2026 Countdown
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">April 23-24, 2026</p>
                    </div>
                </div>
                {isUrgent && (
                    <span className="px-3 py-1 text-xs font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse">
                        ⚡ Less than 30 days!
                    </span>
                )}
            </div>

            {/* Countdown blocks */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
                <TimeBlock value={timeLeft.days} label="Days" />
                <span className={`text-2xl font-bold ${isUrgent ? 'text-red-400' : 'text-purple-400'} animate-pulse`}>:</span>
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <span className={`text-2xl font-bold ${isUrgent ? 'text-red-400' : 'text-purple-400'} animate-pulse`}>:</span>
                <TimeBlock value={timeLeft.minutes} label="Mins" />
                <span className={`text-2xl font-bold ${isUrgent ? 'text-red-400' : 'text-purple-400'} animate-pulse hidden sm:block`}>:</span>
                <div className="hidden sm:block">
                    <TimeBlock value={timeLeft.seconds} label="Secs" />
                </div>
            </div>

            {/* Motivational message */}
            <p className={`mt-4 text-center text-sm ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'} font-medium`}>
                {isUrgent
                    ? "🔥 Final stretch! Stay focused and keep pushing!"
                    : "📚 Every day of preparation counts. Keep going!"
                }
            </p>
        </div>
    )
}

export default CountdownTimer
