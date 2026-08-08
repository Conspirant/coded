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
}

const AdUnit = ({
  className = "",
  slot = "4887553688",
  format = "auto",
  layoutKey
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
        // Silent catch for ad blockers or unapproved domain
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={adRef}
      className={`w-full overflow-hidden rounded-2xl bg-card/30 border border-white/5 p-2 my-4 min-h-[90px] flex items-center justify-center ${className}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client="ca-pub-8278256783074970"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : { "data-full-width-responsive": "true" })}
      />
    </div>
  )
}

export default AdUnit
