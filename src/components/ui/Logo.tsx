import React, { useId } from "react"

export interface LogoProps {
  className?: string
  iconSize?: number
  showText?: boolean
  textSize?: string
  mode?: "KCET" | "COMEDK" | "default"
  variant?: "default" | "badge" | "glyph"
}

export function Logo({
  className = "",
  iconSize = 28,
  showText = true,
  textSize = "text-base sm:text-lg",
  mode = "default",
  variant = "default",
}: LogoProps) {
  const uniqueId = useId()

  // Dynamic theme gradients tuned for engineering rigor & clarity
  const theme = {
    KCET: {
      top1: "#93C5FD",
      top2: "#60A5FA",
      top3: "#4F46E5",
      spine1: "#4F46E5",
      spine2: "#312E81",
      base1: "#6366F1",
      base2: "#4338CA",
      core1: "#38BDF8",
      core2: "#818CF8",
      dot: "bg-sky-400",
      prefix: "KCET",
    },
    COMEDK: {
      top1: "#FEF08A",
      top2: "#F59E0B",
      top3: "#D97706",
      spine1: "#D97706",
      spine2: "#78350F",
      base1: "#F59E0B",
      base2: "#9A3412",
      core1: "#FBBF24",
      core2: "#F97316",
      dot: "bg-amber-400",
      prefix: "COMEDK",
    },
    default: {
      top1: "#93C5FD",
      top2: "#60A5FA",
      top3: "#4F46E5",
      spine1: "#4F46E5",
      spine2: "#312E81",
      base1: "#6366F1",
      base2: "#4338CA",
      core1: "#38BDF8",
      core2: "#818CF8",
      dot: "bg-sky-400",
      prefix: "KCET",
    },
  }[mode]

  const idTop = `hex-top-${uniqueId}`
  const idSpine = `hex-spine-${uniqueId}`
  const idBase = `hex-base-${uniqueId}`
  const idCore = `hex-core-${uniqueId}`

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Hex-Prism Monogram Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 ease-out hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={idTop} x1="6" y1="5.25" x2="26" y2="13.6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={theme.top1} />
            <stop offset="40%" stopColor={theme.top2} />
            <stop offset="100%" stopColor={theme.top3} />
          </linearGradient>
          <linearGradient id={idSpine} x1="6" y1="9.25" x2="13.5" y2="22.75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={theme.spine1} />
            <stop offset="100%" stopColor={theme.spine2} />
          </linearGradient>
          <linearGradient id={idBase} x1="13.5" y1="18.3" x2="26" y2="26.75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={theme.base1} />
            <stop offset="100%" stopColor={theme.base2} />
          </linearGradient>
          <linearGradient id={idCore} x1="18" y1="13.5" x2="24.5" y2="18.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={theme.core1} />
            <stop offset="100%" stopColor={theme.core2} />
          </linearGradient>
        </defs>

        {variant !== "glyph" && (
          <>
            {/* Dark Obsidian Housing Squircle */}
            <rect
              x="0.75"
              y="0.75"
              width="30.5"
              height="30.5"
              rx="7.5"
              fill="#080C16"
              stroke="rgba(255, 255, 255, 0.14)"
              strokeWidth="0.9"
            />
            {/* Subtle Inner Highlight */}
            <rect
              x="1.75"
              y="1.75"
              width="28.5"
              height="28.5"
              rx="6.5"
              fill="none"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="0.5"
            />
          </>
        )}

        {/* 1. Top Arm Facet (Hexagon Upper Crest) */}
        <path d="M16 5.25 L26 11 L21.5 13.625 L13.5 9.25 L16 5.25 Z" fill={`url(#${idTop})`} />

        {/* 2. Left Spine Facet (Code Bracket < ) */}
        <path d="M13.5 9.25 L6 13.5 V18.5 L13.5 22.75 L13.5 17.5 L10.5 16 L13.5 14.5 Z" fill={`url(#${idSpine})`} />

        {/* 3. Bottom Arm Facet (Hexagon Lower Foundation) */}
        <path d="M13.5 22.75 L16 26.75 L26 21 L21.5 18.375 L13.5 22.75 Z" fill={`url(#${idBase})`} />

        {/* 4. Forward Code Prompt Chevron ( > Admission Compass Vector ) */}
        <path d="M18 14.25 L22.5 16 L18 17.75 L19 18.5 L24.5 16 L19 13.5 Z" fill={`url(#${idCore})`} />
      </svg>

      {/* Unified Cohesive Typography Lockup */}
      {showText && (
        <span className={`inline-flex items-center tracking-tight leading-none font-brand ${textSize}`}>
          <span className="font-bold text-foreground/90 mr-1.5">
            {theme.prefix}
          </span>
          <span className="font-extrabold text-foreground flex items-center">
            Coded
            <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1 ${theme.dot}`} />
          </span>
        </span>
      )}
    </div>
  )
}
