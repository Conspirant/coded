import { useEffect, useRef } from "react"

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdUnitProps {
  className?: string
}

const AdUnit = ({ className = "" }: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch (e) {
      // AdSense not loaded or ad blocker active
    }
  }, [])

  return (
    <div
      ref={adRef}
      className={`w-full overflow-hidden rounded-2xl glass border border-white/5 ${className}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-fo-1v+3x-ej+cc"
        data-ad-client="ca-pub-8278256783074970"
        data-ad-slot="4887553688"
      />
    </div>
  )
}

export default AdUnit
