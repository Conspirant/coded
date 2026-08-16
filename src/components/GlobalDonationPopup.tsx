import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { X, Heart } from "lucide-react"
import { AdminSuggestionsService } from "@/lib/admin-suggestions-service"

export function GlobalDonationPopup() {
  const [visible, setVisible] = useState(false)
  const [broadcastId, setBroadcastId] = useState<number | null>(null)

  useEffect(() => {
    // 1. Initial check of database config on mount
    const checkActiveBroadcast = async () => {
      const activeId = await AdminSuggestionsService.getActiveDonationBroadcast()
      if (activeId) {
        const dismissed = localStorage.getItem(`dismiss_donation_${activeId}`)
        if (!dismissed) {
          setBroadcastId(activeId)
          setVisible(true)
        }
      }
    }
    checkActiveBroadcast()

    // 2. Setup standard Realtime database changes listener (100% reliable in Supabase)
    const dbChannel = supabase
      .channel("ugcet-cache-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:active_donation_broadcast",
        },
        (payload) => {
          const newId = (payload.new as any)?.results_json?.broadcastId
          if (newId) {
            const dismissed = localStorage.getItem(`dismiss_donation_${newId}`)
            if (!dismissed) {
              setBroadcastId(newId)
              setVisible(true)
            }
          } else {
            setVisible(false)
            setBroadcastId(null)
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:active_donation_broadcast",
        },
        (payload) => {
          const newId = (payload.new as any)?.results_json?.broadcastId
          if (newId) {
            const dismissed = localStorage.getItem(`dismiss_donation_${newId}`)
            if (!dismissed) {
              setBroadcastId(newId)
              setVisible(true)
            }
          } else {
            setVisible(false)
            setBroadcastId(null)
          }
        }
      )
      .subscribe()

    // 3. Keep ephemeral broadcast channel as fallback
    const broadcastChannel = supabase.channel("global-alerts")
    broadcastChannel
      .on("broadcast", { event: "donation-prompt" }, (payload) => {
        const id = payload.payload?.broadcastId
        if (!id) {
          setVisible(false)
          setBroadcastId(null)
          return
        }

        const dismissed = localStorage.getItem(`dismiss_donation_${id}`)
        if (dismissed) return

        setBroadcastId(id)
        setVisible(true)
      })
      .on("broadcast", { event: "donation-prompt-stop" }, () => {
        setVisible(false)
        setBroadcastId(null)
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          broadcastChannel.track({ online_at: new Date().toISOString() })
        }
      })

    // 4. Local manual test trigger
    const handleLocalTest = (e: Event) => {
      const customEv = e as CustomEvent
      const id = customEv.detail?.broadcastId || Date.now()
      setBroadcastId(id)
      setVisible(true)
    }

    const handleLocalTestStop = () => {
      setVisible(false)
      setBroadcastId(null)
    }

    window.addEventListener("donation-prompt-local-test", handleLocalTest)
    window.addEventListener("donation-prompt-local-stop", handleLocalTestStop)

    return () => {
      dbChannel.unsubscribe()
      broadcastChannel.unsubscribe()
      window.removeEventListener("donation-prompt-local-test", handleLocalTest)
      window.removeEventListener("donation-prompt-local-stop", handleLocalTestStop)
    }
  }, [])

  const handleDismiss = async () => {
    setVisible(false)
    if (broadcastId) {
      localStorage.setItem(`dismiss_donation_${broadcastId}`, "true")
      
      // Save analytics to database (100% reliable)
      AdminSuggestionsService.recordDonationAction(broadcastId, "dismiss")

      // Send fallback realtime broadcast
      const channel = supabase.channel("global-alerts")
      channel.send({
        type: "broadcast",
        event: "client-response",
        payload: { action: "dismiss", broadcastId }
      })
    }
  }

  const handleDonate = async () => {
    setVisible(false)
    if (broadcastId) {
      localStorage.setItem(`dismiss_donation_${broadcastId}`, "true")

      // Save analytics to database (100% reliable)
      AdminSuggestionsService.recordDonationAction(broadcastId, "try")

      // Send fallback realtime broadcast
      const channel = supabase.channel("global-alerts")
      channel.send({
        type: "broadcast",
        event: "client-response",
        payload: { action: "try", broadcastId }
      })
    }
    window.open("/donate", "_blank")
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div 
        onClick={handleDismiss}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div className="relative max-w-md w-full bg-card border border-border text-card-foreground rounded-md shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <button 
          onClick={handleDismiss} 
          className="absolute top-4 right-4 text-muted-foreground hover:text-zinc-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
            <Heart className="h-6 w-6 text-rose-500 fill-rose-500/20 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground tracking-tight">Support KCET Compass</h3>
            <p className="text-xs text-muted-foreground leading-relaxed px-1">
              Maintaining this portal, servers, and database updates is supported entirely by candidate donations. If you have found our predictors, tools, and news updates useful, please consider a small contribution to help keep this service running.
            </p>
          </div>

          <div className="flex w-full gap-3 pt-3">
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="flex-1 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-900 text-xs font-semibold h-10 rounded-md"
            >
              Dismiss
            </Button>
            <Button 
              onClick={handleDonate}
              className="flex-1 bg-primary hover:bg-primary/90 text-foreground text-xs font-semibold h-10 rounded-md shadow-lg shadow-indigo-500/10"
            >
              Support Platform
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

