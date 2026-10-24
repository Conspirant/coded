import React, { useState, useEffect, useRef } from "react"
import {
  X,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  Printer,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { downloadFile } from "@/lib/download-helper"
import { pdfjsLib, configurePDFJS } from "@/lib/pdf-config"

export interface PdfViewerModalProps {
  open: boolean
  onClose: () => void
  url: string
  title: string
  fileName?: string
  subtitle?: string
  fileSize?: string
  badgeText?: string
  totalPages?: number
  initialPage?: number
}

// Detect mobile browsers (Android / iOS / Touch)
function isMobileDevice() {
  if (typeof window === "undefined") return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  )
}

export function PdfViewerModal({
  open,
  onClose,
  url,
  title,
  fileName,
  subtitle = "Official KSEAB Resource",
  fileSize,
  badgeText,
  totalPages,
  initialPage = 1,
}: PdfViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [pageInput, setPageInput] = useState<string>(String(initialPage))
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isMobile] = useState<boolean>(() => isMobileDevice())
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(totalPages || 1)
  const [isRendering, setIsRendering] = useState<boolean>(false)
  const [canvasError, setCanvasError] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTaskRef = useRef<any>(null)
  const touchStartRef = useRef<{ x: number; y: number; distance: number; initialZoom: number } | null>(null)

  // Configure PDF.js once on mount
  useEffect(() => {
    configurePDFJS()
  }, [])

  // Sync state when opened with new pdf or initialPage changes
  useEffect(() => {
    if (open) {
      const pageToUse = initialPage > 0 ? initialPage : 1
      setCurrentPage(pageToUse)
      setPageInput(String(pageToUse))
      setZoomLevel(100)
      setCanvasError(null)
    }
  }, [open, url, initialPage])

  // Load PDF document using PDF.js for mobile canvas rendering
  useEffect(() => {
    if (!open || !url || !isMobile) return

    let isMounted = true
    setIsRendering(true)
    setCanvasError(null)

    const loadDoc = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.149/cmaps/',
          cMapPacked: true,
        })
        const doc = await loadingTask.promise
        if (isMounted) {
          setPdfDoc(doc)
          setPdfTotalPages(doc.numPages)
        }
      } catch (err: any) {
        console.warn("⚠️ PDF.js direct load failed:", err)
        if (isMounted) {
          setCanvasError("Could not render page canvas. You can download or open in new tab.")
        }
      } finally {
        if (isMounted) {
          setIsRendering(false)
        }
      }
    }

    loadDoc()

    return () => {
      isMounted = false
    }
  }, [open, url, isMobile])

  // Render current page onto HTML5 canvas when currentPage, zoomLevel or pdfDoc changes
  useEffect(() => {
    if (!open || !pdfDoc || !canvasRef.current || !isMobile) return

    let isMounted = true

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel()
          } catch { }
        }

        setIsRendering(true)
        const page = await pdfDoc.getPage(currentPage)
        if (!isMounted) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Compute available screen width to make default zoom (100%) fit screen nicely
        const screenWidth = window.innerWidth > 0 ? window.innerWidth : 360
        // Padding offset inside modal container
        const availableWidth = Math.max(280, screenWidth - (isFullscreen ? 16 : 32))

        const unscaledViewport = page.getViewport({ scale: 1.0 })
        const fitScale = availableWidth / unscaledViewport.width
        
        // Multiplied by user zoom level (100% = fit screen width)
        const userScale = (zoomLevel / 100) * fitScale

        // Cap DPR to 2 for performance and battery on mobile
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const viewport = page.getViewport({ scale: userScale })

        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        }

        const task = page.render(renderContext)
        renderTaskRef.current = task
        await task.promise

        if (isMounted) {
          setIsRendering(false)
        }
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn("PDF Page render error:", err)
          if (isMounted) {
            setIsRendering(false)
          }
        }
      }
    }

    renderPage()

    return () => {
      isMounted = false
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch { }
      }
    }
  }, [pdfDoc, currentPage, zoomLevel, open, isMobile, isFullscreen])

  // Sync with browser native fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFs = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFs)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Toggle fullscreen using native browser Fullscreen API with seamless fallback
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen()
        } else {
          setIsFullscreen(true)
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else {
          setIsFullscreen(false)
        }
      }
    } catch {
      setIsFullscreen((prev) => !prev)
    }
  }

  // Handle ESC key to exit fullscreen or close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
        } else if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, isFullscreen, onClose])

  if (!open) return null

  const effectiveTotalPages = isMobile ? (pdfTotalPages || totalPages) : totalPages

  const handlePageChange = (page: number) => {
    const maxP = effectiveTotalPages || 999
    const safePage = Math.max(1, Math.min(page, maxP))
    setCurrentPage(safePage)
    setPageInput(String(safePage))
  }

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseInt(pageInput, 10)
    if (!isNaN(p)) {
      handlePageChange(p)
    } else {
      setPageInput(String(currentPage))
    }
  }

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(250, Math.max(70, prev + delta)))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const distance = Math.hypot(dx, dy)
      touchStartRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        distance,
        initialZoom: zoomLevel,
      }
    } else if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        distance: 0,
        initialZoom: zoomLevel,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    // Pinch zoom handling
    if (e.touches.length === 2 && touchStartRef.current.distance > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const currentDistance = Math.hypot(dx, dy)
      const ratio = currentDistance / touchStartRef.current.distance
      const newZoom = Math.min(250, Math.max(70, Math.round(touchStartRef.current.initialZoom * ratio)))
      if (Math.abs(newZoom - zoomLevel) >= 5) {
        setZoomLevel(newZoom)
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    // Single finger swipe left/right for page turn (only if not heavily zoomed)
    if (touchStartRef.current.distance === 0 && e.changedTouches.length === 1 && zoomLevel <= 130) {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - touchStartRef.current.x
      const deltaY = endY - touchStartRef.current.y

      // Horizontal swipe detected (threshold 60px, mostly horizontal)
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          // Swiped left -> Next page
          handlePageChange(currentPage + 1)
        } else {
          // Swiped right -> Previous page
          handlePageChange(currentPage - 1)
        }
      }
    }

    touchStartRef.current = null
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDownloading(true)
    const dlName = fileName || `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`
    try {
      await downloadFile(url, dlName)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const fullUrl = `${url}#page=${currentPage}`
    window.open(fullUrl, "_blank", "noopener,noreferrer")
  }

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const printWindow = window.open(url, "_blank")
    if (printWindow) {
      printWindow.focus()
    }
  }

  // Construct iframe URL with PDF open parameters
  const iframeSrc = `${url}#page=${currentPage}&zoom=${zoomLevel}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={
        isFullscreen
          ? "fixed inset-0 z-50 p-0 m-0 w-screen h-screen bg-black overflow-hidden"
          : "fixed inset-0 z-50 flex items-center justify-center p-0 m-0 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
      }
    >
      <div
        ref={containerRef}
        className={
          isFullscreen
            ? "fixed inset-0 z-50 flex flex-col w-screen h-screen max-w-none max-h-none rounded-none m-0 p-0 border-0 bg-background text-foreground overflow-hidden"
            : "relative flex flex-col bg-background text-foreground shadow-2xl border border-border/80 overflow-hidden w-[96vw] max-w-7xl h-[94vh] rounded-xl my-auto"
        }
      >
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-2.5 sm:px-4 py-2 bg-card/95 border-b border-border/60 shrink-0 select-none gap-2">
          {/* Document Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-base font-semibold truncate leading-tight tracking-tight">
                  {title}
                </h2>
                {badgeText && (
                  <Badge
                    variant="outline"
                    className="hidden sm:inline-flex text-[10px] sm:text-[11px] font-mono py-0 px-1.5 text-primary border-primary/30 bg-primary/5 shrink-0"
                  >
                    {badgeText}
                  </Badge>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate mt-0.5 flex items-center gap-1.5">
                <span className="truncate">{subtitle}</span>
                {fileSize && (
                  <>
                    <span>•</span>
                    <span className="shrink-0">{fileSize}</span>
                  </>
                )}
                {totalPages && (
                  <>
                    <span>•</span>
                    <span className="shrink-0">{totalPages}p</span>
                  </>
                )}
                {initialPage > 1 && (
                  <>
                    <span>•</span>
                    <span className="text-primary font-medium shrink-0">p.{initialPage}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Direct Download Button */}
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-8 px-2.5 sm:px-3 text-xs font-medium gap-1.5 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden xs:inline sm:inline">
                {isDownloading ? "..." : "PDF"}
              </span>
              {fileSize && !isDownloading && (
                <span className="hidden md:inline opacity-85 text-[11px]">
                  ({fileSize})
                </span>
              )}
            </Button>

            {/* Open in New Tab Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleOpenInNewTab}
              title="Open PDF in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="icon"
              className={`h-8 w-8 cursor-pointer transition-colors ${
                isFullscreen
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </Button>

            <div className="h-4 w-[1px] bg-border mx-0.5 sm:mx-1" />

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              onClick={onClose}
              title="Close viewer (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Brand Secondary Sub-Toolbar */}
        <div className="flex items-center justify-between gap-2 px-2.5 sm:px-4 py-1.5 bg-muted/40 border-b border-border/50 text-xs text-muted-foreground shrink-0 select-none overflow-x-auto no-scrollbar">
          {/* Page Navigation */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-[11px] font-medium hidden sm:inline">Page</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-foreground cursor-pointer"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageSubmit}
                className="w-9 sm:w-10 h-7 text-center text-xs font-mono rounded border border-border bg-background px-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {effectiveTotalPages && (
                <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                  /{effectiveTotalPages}
                </span>
              )}
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-foreground cursor-pointer"
              disabled={effectiveTotalPages ? currentPage >= effectiveTotalPages : false}
              onClick={() => handlePageChange(currentPage + 1)}
              title="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Quick Zoom Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-foreground cursor-pointer"
              onClick={() => handleZoom(-15)}
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[10px] sm:text-[11px] font-mono px-1 w-10 sm:w-12 text-center text-foreground font-medium">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-foreground cursor-pointer"
              onClick={() => handleZoom(15)}
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-1.5 sm:px-2 text-[10px] sm:text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setZoomLevel(100)}
            >
              Reset
            </Button>
          </div>

          {/* Direct Print / Brand indicator */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handlePrint}
              title="Print document"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </Button>

            <span className="text-[11px] bg-background/60 border border-border/50 px-2 py-0.5 rounded text-muted-foreground">
              Official KSEAB Coded Viewer
            </span>
          </div>
        </div>

        {/* Embedded PDF Canvas Container */}
        <div className="relative flex-1 w-full h-full min-h-0 bg-neutral-900 overflow-hidden flex flex-col p-0 m-0">
          {isMobile ? (
            <div 
              className="w-full h-full overflow-auto flex flex-col items-center justify-start p-2 sm:p-4 bg-neutral-950/90 relative touch-pan-x touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isRendering ? (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white border border-white/20 shadow-lg">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Loading Page {currentPage}...</span>
                </div>
              ) : (
                <div className="absolute top-2 right-3 z-10 pointer-events-none opacity-60 text-[10px] font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                  Swipe ← / → • Pinch to zoom
                </div>
              )}

              {canvasError ? (
                <div className="my-auto text-center p-6 max-w-sm space-y-3">
                  <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">Mobile PDF Preview Notice</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This browser does not support embedded PDF rendering directly. You can open or download the complete PDF below.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button size="sm" onClick={handleDownload} className="text-xs gap-1.5">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleOpenInNewTab} className="text-xs gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> Open Tab
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center shadow-2xl rounded-sm overflow-visible my-auto transition-transform duration-75">
                  <canvas ref={canvasRef} className="max-w-none bg-white rounded-sm shadow-2xl" />
                </div>
              )}
            </div>
          ) : (
            <iframe
              key={`${url}-${currentPage}-${zoomLevel}`}
              src={iframeSrc}
              title={title}
              className="w-full h-full border-0 bg-neutral-900 block"
            />
          )}
        </div>
      </div>
    </div>
  )
}
