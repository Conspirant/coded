import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export const INITIAL_VISITOR_OFFSET = 51783

const SESSION_STORAGE_KEY = "kcet_visitor_session_counted"
const LOCAL_STORAGE_CACHE_KEY = "kcet_last_known_visitor_count"

export interface VisitorStats {
  totalVisits: number
  activeOnline: number
  isLive: boolean
  incrementVisit: () => Promise<number>
  overrideVisits: (newCount: number) => Promise<boolean>
}

/**
 * Service to manage total site visit counts & active user presence
 */
export class VisitorService {
  /**
   * Fetch current total visit count from Supabase (or local cache with offset fallback)
   */
  static async getVisitCount(): Promise<number> {
    try {
      // 1. Try querying site_visits table
      const { data: visitsData, error: visitsErr } = await supabase
        .from("site_visits" as any)
        .select("count")
        .eq("id", "total_visits")
        .maybeSingle()

      if (!visitsErr && visitsData && typeof (visitsData as any).count === "number") {
        const count = (visitsData as any).count
        const finalCount = Math.max(count, INITIAL_VISITOR_OFFSET)
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(finalCount))
        return finalCount
      }

      // 2. Fallback to ugcet_results_cache key 'METRIC:site_visits'
      const { data: cacheData, error: cacheErr } = await supabase
        .from("ugcet_results_cache" as any)
        .select("results_json")
        .eq("appl_no", "METRIC:site_visits")
        .maybeSingle()

      if (!cacheErr && cacheData && (cacheData as any).results_json?.count) {
        const count = Number((cacheData as any).results_json.count) || INITIAL_VISITOR_OFFSET
        const finalCount = Math.max(count, INITIAL_VISITOR_OFFSET)
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(finalCount))
        return finalCount
      }
    } catch (e) {
      console.warn("VisitorService fetch error, using local fallback:", e)
    }

    // 3. Fallback to local storage or initial offset
    const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY)
    return cached ? Math.max(Number(cached) || INITIAL_VISITOR_OFFSET, INITIAL_VISITOR_OFFSET) : INITIAL_VISITOR_OFFSET
  }

  /**
   * Atomically increment the site visit count
   */
  static async incrementVisitCount(): Promise<number> {
    try {
      // Try atomic RPC function first
      const { data: rpcCount, error: rpcErr } = await supabase.rpc("increment_site_visits" as any)

      if (!rpcErr && typeof rpcCount === "number") {
        const finalCount = Math.max(rpcCount, INITIAL_VISITOR_OFFSET)
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(finalCount))
        return finalCount
      }

      // Fallback: fetch, increment, and update
      const current = await this.getVisitCount()
      const nextCount = current + 1

      // Update site_visits
      await supabase
        .from("site_visits" as any)
        .upsert({ id: "total_visits", count: nextCount, updated_at: new Date().toISOString() })
        .catch(() => {})

      // Also sync to ugcet_results_cache for high resilience
      await supabase
        .from("ugcet_results_cache" as any)
        .upsert({
          appl_no: "METRIC:site_visits",
          dob: "analytics",
          name: "site_visits",
          results_json: { count: nextCount, updated_at: new Date().toISOString() }
        })
        .catch(() => {})

      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(nextCount))
      return nextCount
    } catch (e) {
      console.warn("Increment visit failed, incrementing locally:", e)
      const cached = await this.getVisitCount()
      const next = cached + 1
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(next))
      return next
    }
  }

  /**
   * Override visit count (Admin only)
   */
  static async setVisitCount(newCount: number): Promise<boolean> {
    try {
      const sanitized = Math.max(newCount, INITIAL_VISITOR_OFFSET)

      await supabase
        .from("site_visits" as any)
        .upsert({ id: "total_visits", count: sanitized, updated_at: new Date().toISOString() })

      await supabase
        .from("ugcet_results_cache" as any)
        .upsert({
          appl_no: "METRIC:site_visits",
          dob: "analytics",
          name: "site_visits",
          results_json: { count: sanitized, updated_at: new Date().toISOString() }
        })

      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, String(sanitized))
      return true
    } catch (e) {
      console.error("Failed to set visit count:", e)
      return false
    }
  }
}

/**
 * Custom React Hook for live visitor stats & presence tracking
 */
export function useVisitorCounter() {
  const [totalVisits, setTotalVisits] = useState<number>(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY)
    return cached ? Math.max(Number(cached) || INITIAL_VISITOR_OFFSET, INITIAL_VISITOR_OFFSET) : INITIAL_VISITOR_OFFSET
  })
  const [activeOnline, setActiveOnline] = useState<number>(1)
  const [isLive, setIsLive] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true

    // 1. Initial count & session visit deduplication
    const initVisitorSession = async () => {
      let count = await VisitorService.getVisitCount()

      const hasCountedSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!hasCountedSession) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "1")
        count = await VisitorService.incrementVisitCount()
      }

      if (isMounted) {
        setTotalVisits(count)
      }
    }

    initVisitorSession()

    // 2. Realtime presence & broadcast channel
    const channel = supabase.channel("site-visitor-counter", {
      config: { presence: { key: Math.random().toString(36).substring(2) } }
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const count = Object.keys(state).length
        if (isMounted) setActiveOnline(Math.max(count, 1))
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "site_visits" }, (payload: any) => {
        if (payload.new && typeof payload.new.count === "number") {
          if (isMounted) {
            setTotalVisits(Math.max(payload.new.count, INITIAL_VISITOR_OFFSET))
          }
        }
      })
      .on("broadcast", { event: "visit-update" }, (payload: any) => {
        if (payload.payload?.count && typeof payload.payload.count === "number") {
          if (isMounted) {
            setTotalVisits(Math.max(payload.payload.count, INITIAL_VISITOR_OFFSET))
          }
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          if (isMounted) setIsLive(true)
          channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      isMounted = false
      channel.unsubscribe()
    }
  }, [])

  const manualIncrement = async () => {
    const next = await VisitorService.incrementVisitCount()
    setTotalVisits(next)
    return next
  }

  const overrideVisits = async (newCount: number) => {
    const ok = await VisitorService.setVisitCount(newCount)
    if (ok) setTotalVisits(newCount)
    return ok
  }

  return {
    totalVisits,
    activeOnline,
    isLive,
    incrementVisit: manualIncrement,
    overrideVisits
  }
}
