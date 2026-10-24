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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { downloadFile } from "@/lib/download-helper"

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
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync state when opened with new pdf or initialPage changes
  useEffect(() => {
    if (open) {
      const pageToUse = initialPage > 0 ? initialPage : 1
      setCurrentPage(pageToUse)
      setPageInput(String(pageToUse))
      setZoomLevel(100)
    }
  }, [open, url, initialPage])

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
      // Fallback to CSS fullscreen if permissions or browser blocks requestFullscreen
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

  const handlePageChange = (page: number) => {
    const safePage = Math.max(1, totalPages ? Math.min(page, totalPages) : page)
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
    setZoomLevel((prev) => Math.min(200, Math.max(50, prev + delta)))
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
              {totalPages && (
                <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                  /{totalPages}
                </span>
              )}
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-foreground cursor-pointer"
              disabled={totalPages ? currentPage >= totalPages : false}
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
          <iframe
            key={`${url}-${currentPage}-${zoomLevel}`}
            src={iframeSrc}
            title={title}
            className="w-full h-full border-0 bg-neutral-900 block"
          />
        </div>
      </div>
    </div>
  )
}
