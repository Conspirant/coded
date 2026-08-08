import { useEffect, useRef } from "react"

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdUnitProps {
  className?: string
  slot?: string
  format?: string
  layoutKey?: string
  label?: boolean
}

const AdUnit = ({
  className = "",
  slot,
  format = "auto",
  layoutKey,
  label = true
}: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined" && adRef.current) {
          const insElem = adRef.current.querySelector(".adsbygoogle")
          if (insElem && !insElem.getAttribute("data-adsbygoogle-status")) {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            pushed.current = true
          }
        }
      } catch (e) {
        // Ad blocker or empty response
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={adRef}
      className={`w-full overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 p-2 my-4 flex flex-col items-center justify-center transition-all ${className}`}
    >
      {label && (
        <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest self-start px-2 py-0.5 select-none">
          Sponsored
        </span>
      )}
      <div className="w-full flex items-center justify-center min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight: "90px" }}
          data-ad-client="ca-pub-8278256783074970"
          {...(slot ? { "data-ad-slot": slot } : {})}
          data-ad-format={format}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : { "data-full-width-responsive": "true" })}
        />
      </div>
    </div>
  )
}

export default AdUnit
