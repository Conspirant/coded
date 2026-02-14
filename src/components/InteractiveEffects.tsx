import { useEffect, useRef, useCallback } from "react"
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion"

/**
 * ScrollProgress — thin gradient bar at the top of the viewport
 * that fills as the user scrolls down the page.
 */
export function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 })

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            style={{ scaleX }}
        />
    )
}

/**
 * CursorSpotlight — radial gradient that follows the mouse,
 * creating a flashlight-like reveal effect on the page section.
 */
export function CursorSpotlight({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
    const spotlightRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const onMove = (e: MouseEvent) => {
            if (!spotlightRef.current) return
            const rect = container.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            spotlightRef.current.style.setProperty("--spotlight-x", `${x}px`)
            spotlightRef.current.style.setProperty("--spotlight-y", `${y}px`)
            spotlightRef.current.style.opacity = "1"
        }

        const onLeave = () => {
            if (spotlightRef.current) spotlightRef.current.style.opacity = "0"
        }

        container.addEventListener("mousemove", onMove)
        container.addEventListener("mouseleave", onLeave)

        return () => {
            container.removeEventListener("mousemove", onMove)
            container.removeEventListener("mouseleave", onLeave)
        }
    }, [containerRef])

    return (
        <div
            ref={spotlightRef}
            className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
            style={{
                background: `radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(99,102,241,0.08), transparent 60%)`,
            }}
        />
    )
}

/**
 * RippleEffect — click anywhere to create expanding ripple rings
 */
export function RippleEffect({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
    const ripplesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const onClick = (e: MouseEvent) => {
            if (!ripplesRef.current) return

            const rect = container.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const ripple = document.createElement("div")
            ripple.className = "ripple-ring"
            ripple.style.left = `${x}px`
            ripple.style.top = `${y}px`
            ripplesRef.current.appendChild(ripple)

            // Remove after animation ends
            setTimeout(() => {
                ripple.remove()
            }, 1200)
        }

        container.addEventListener("click", onClick)
        return () => container.removeEventListener("click", onClick)
    }, [containerRef])

    return (
        <div ref={ripplesRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" />
    )
}
