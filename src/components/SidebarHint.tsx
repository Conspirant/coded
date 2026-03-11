import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

export function SidebarHint() {
    const { state } = useSidebar()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Only show if the sidebar is closed and they haven't dismissed it before
        const hasSeenHint = localStorage.getItem('kcet_sidebar_hint_seen')
        if (!hasSeenHint && state === 'collapsed') {
            setIsVisible(true)
        } else {
            setIsVisible(false) // Hide if sidebar opens or they already saw it
        }
    }, [state])

    if (!isVisible) return null

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('kcet_sidebar_hint_seen', 'true')
    }

    return (
        <div 
            className="absolute left-10 top-2.5 z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-700 cursor-pointer"
            onClick={handleDismiss}
        >
            <ArrowLeft className="h-4 w-4 text-indigo-400 animate-bounce-horizontal" strokeWidth={2.5} />
            <span className="text-xs font-medium text-foreground/80 tracking-wide select-none bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/5">
                Menu
            </span>
        </div>
    )
}
