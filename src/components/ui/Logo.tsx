import React from "react"

interface LogoProps {
  className?: string
  iconSize?: number
  showText?: boolean
  textSize?: string
  mode?: "KCET" | "COMEDK" | "default"
}

export function Logo({
  className = "",
  iconSize = 32,
  showText = true,
  textSize = "text-xl",
  mode = "default",
}: LogoProps) {
  // Define gradient color schemes for different modes
  const getGradientId = () => {
    if (mode === "KCET") return "logo-grad-kcet"
    if (mode === "COMEDK") return "logo-grad-comedk"
    return "logo-grad-default"
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Brand Mark SVG */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* KCET Mode Gradient (Indigo to Violet) */}
          <linearGradient id="logo-grad-kcet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          {/* COMEDK Mode Gradient (Amber to Orange) */}
          <linearGradient id="logo-grad-comedk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Default Gradient (Indigo to Orange mix) */}
          <linearGradient id="logo-grad-default" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Outer subtle shield container */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="8"
          fill="rgba(255, 255, 255, 0.03)"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />

        {/* Diamond (top of graduation cap / data node diamond) */}
        <path
          d="M16 7L24 11L16 15L8 11L16 7Z"
          fill={`url(#${getGradientId()})`}
          opacity="0.95"
        />

        {/* Cap Base (engineering shield / graph connection) */}
        <path
          d="M10 14.5V19.5C10 21.5 16 23.5 16 23.5C16 23.5 22 21.5 22 19.5V14.5"
          stroke={`url(#${getGradientId()})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data node connection points */}
        <circle cx="16" cy="11" r="1.5" fill="#ffffff" />
        <circle cx="8" cy="11" r="1" fill="#ffffff" opacity="0.8" />
        <circle cx="24" cy="11" r="1" fill="#ffffff" opacity="0.8" />

        {/* Tassel line morphing into data point */}
        <path
          d="M20 13L24 16.5C24.5 17 25 18 24.5 19C24 20 22.5 19.5 22 19"
          stroke={`url(#${getGradientId()})`}
          strokeWidth="1.2"
          strokeDasharray="1.5 1.5"
          fill="none"
        />
        <circle cx="22" cy="19" r="1" fill="#ffffff" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <span className={`${textSize} font-extrabold tracking-tight font-brand flex items-center`}>
          <span className="text-muted-foreground/80 font-normal mr-1 text-[0.85em] uppercase tracking-wide">
            {mode === "default" ? "KCET" : mode}
          </span>
          <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">Coded</span>
        </span>
      )}
    </div>
  )
}
