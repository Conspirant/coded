import React, { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, FileText, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { copyToClipboard } from "@/lib/utils"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface DonationCertificateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  donorName: string
  amount: number
  date?: string
  paymentId?: string
}

export function DonationCertificateModal({
  open,
  onOpenChange,
  donorName,
  amount,
  date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
  paymentId = "KCET-SUPPORTER-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
}: DonationCertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const certId = paymentId.startsWith("pay_") 
    ? "CERT-" + paymentId.toUpperCase() 
    : paymentId

  // Universal A4 Landscape PDF Generation (297mm x 210mm — 100% full-bleed edge-to-edge)
  const handleDownloadPDF = async () => {
    if (!certRef.current) return
    try {
      toast.info("Generating PDF certificate...")
      const canvas = await html2canvas(certRef.current, {
        scale: 3, // 300 DPI High-DPI Capture
        backgroundColor: "#0b0f19",
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      
      // Universal A4 Landscape: 297mm wide x 210mm high
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST")
      pdf.save(`KCET_Coded_Certificate_${certId}.pdf`)
      toast.success("PDF Certificate downloaded successfully!")
    } catch (err) {
      console.error("PDF generation failed:", err)
      toast.error("Failed to generate PDF file.")
    }
  }

  // Edge-to-Edge High-Res PNG Image Download Generation
  const handleDownloadPNG = async () => {
    if (!certRef.current) return
    try {
      toast.info("Generating certificate image...")
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        backgroundColor: "#0b0f19",
        useCORS: true,
        logging: false,
      })

      const link = document.createElement("a")
      link.download = `KCET_Coded_Certificate_${certId}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
      toast.success("Certificate image downloaded successfully!")
    } catch (err) {
      console.error("Certificate download error:", err)
      toast.error("Failed to download certificate image.")
    }
  }

  const handleShare = async () => {
    const shareText = `I supported KCET Coded to help keep counseling tools free for Karnataka students! Verified Certificate ID: ${certId}`
    const shareUrl = window.location.origin + "/donate"

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Certificate of Appreciation - KCET Coded",
          text: shareText,
          url: shareUrl,
        })
        toast.success("Certificate shared successfully!")
        return
      } catch (err) {
        // Fallback
      }
    }

    const ok = await copyToClipboard(`${shareText}\n${shareUrl}`)
    if (ok) {
      toast.success("Share link copied to clipboard!")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl z-[150] max-h-[95vh] overflow-y-auto bg-slate-950 border-white/10 text-slate-100 p-3 sm:p-5 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Certificate of Support</DialogTitle>
        </DialogHeader>

        {/* Universal A4 Landscape Aspect Ratio (1.414 / 1) - Zero Margins */}
        <div
          ref={certRef}
          className="relative w-full aspect-[1.414/1] bg-[#0b0f19] border border-white/10 p-6 sm:p-10 text-center select-none flex flex-col justify-between overflow-hidden"
        >
          {/* Outer Gold Accent Frame Line */}
          <div className="absolute inset-3 border border-amber-500/25 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 space-y-1.5 pt-2">
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              KCET CODED
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Certificate of Appreciation
            </h2>
            <div className="border-b border-amber-500/30 max-w-[120px] mx-auto pt-2" />
          </div>

          {/* Citation Body */}
          <div className="relative z-10 space-y-3 my-auto py-2">
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              This certificate is presented to
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase font-sans">
              {donorName.trim() || "Valued Supporter"}
            </h3>

            <div className="space-y-1.5 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg mx-auto font-sans pt-1">
              <p>
                In sincere appreciation of your contribution of <span className="font-bold text-amber-400">₹{amount}</span> to KCET Coded.
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Your support helps keep our counseling tools, rank predictors, and cutoff analytics free and accessible for all Karnataka students.
              </p>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-4 text-left">
            <div className="space-y-1 text-[10px] sm:text-xs font-mono text-slate-400">
              <div>Certificate ID: <span className="text-slate-200">{certId}</span></div>
              <div>Date: <span className="text-slate-200">{date}</span></div>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-xs sm:text-sm font-semibold text-white">
                u/Elegant_Compote9073
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-sans">
                KCET Coded Initiative
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <FileText className="h-4 w-4" />
              Download PDF (.pdf)
            </Button>

            <Button
              type="button"
              onClick={handleDownloadPNG}
              variant="outline"
              className="flex-1 sm:flex-none border-white/10 text-slate-300 hover:bg-white/5 text-xs h-9 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Download Image (.png)
            </Button>

            <Button
              type="button"
              onClick={handleShare}
              variant="ghost"
              className="flex-1 sm:flex-none text-slate-400 hover:text-white text-xs h-9 px-3 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
