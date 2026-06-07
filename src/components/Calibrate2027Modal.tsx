import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Database, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActualRankService } from "@/lib/actual-rank-service"
import { toast } from "sonner"

const KCET_CATEGORIES = [
  { code: "GM", label: "General Merit (GM)" },
  { code: "GMK", label: "General Merit Kannada (GMK)" },
  { code: "GMR", label: "General Merit Rural (GMR)" },
  { code: "1G", label: "Category 1G" },
  { code: "1K", label: "Category 1K" },
  { code: "1R", label: "Category 1R" },
  { code: "2AG", label: "Category 2AG" },
  { code: "2AK", label: "Category 2AK" },
  { code: "2AR", label: "Category 2AR" },
  { code: "2BG", label: "Category 2BG" },
  { code: "2BK", label: "Category 2BK" },
  { code: "2BR", label: "Category 2BR" },
  { code: "3AG", label: "Category 3AG" },
  { code: "3AK", label: "Category 3AK" },
  { code: "3AR", label: "Category 3AR" },
  { code: "3BG", label: "Category 3BG" },
  { code: "3BK", label: "Category 3BK" },
  { code: "3BR", label: "Category 3BR" },
  { code: "SCG", label: "Scheduled Caste General (SCG)" },
  { code: "SCK", label: "Scheduled Caste Karnataka (SCK)" },
  { code: "SCR", label: "Scheduled Caste Rural (SCR)" },
  { code: "STG", label: "Scheduled Tribe General (STG)" },
  { code: "STK", label: "Scheduled Tribe Karnataka (STK)" },
  { code: "STR", label: "Scheduled Tribe Rural (STR)" }
]

export const Calibrate2027Modal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [shareRank, setShareRank] = useState("")
  const [shareMarks, setShareMarks] = useState("")
  const [sharePucAggregate, setSharePucAggregate] = useState("")
  const [shareBoard, setShareBoard] = useState("State Board")
  const [shareCategory, setShareCategory] = useState("GM")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Check if the user has already calibrated, has entered results, or has dismissed the popup
    const hasCalibrated = localStorage.getItem("hasCalibrated2027") === "true"
    const hasResults = localStorage.getItem("kcetResults") !== null
    const hasDismissed = localStorage.getItem("hasDismissedCalibratePopup") === "true"

    if (!hasCalibrated && !hasResults && !hasDismissed) {
      // 1.5 second delay before displaying the modal on site entry
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("hasDismissedCalibratePopup", "true")
    setIsOpen(false)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shareRank || parseInt(shareRank) <= 0) {
      toast.error("Please enter a valid official KCET rank.")
      return
    }
    if (!shareMarks || parseFloat(shareMarks) <= 0 || parseFloat(shareMarks) > 180) {
      toast.error("KCET marks must be between 1 and 180.")
      return
    }
    if (!sharePucAggregate || parseFloat(sharePucAggregate) <= 0 || parseFloat(sharePucAggregate) > 100) {
      toast.error("PUC/12th PCM aggregate percentage must be between 1 and 100.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await ActualRankService.submitRank({
        kcet_marks: parseFloat(shareMarks),
        puc_aggregate: parseFloat(sharePucAggregate),
        puc_board: shareBoard,
        actual_rank: parseInt(shareRank),
        category: shareCategory,
        year: 2026
      })

      if (res.success) {
        setSubmitted(true)
        localStorage.setItem("hasCalibrated2027", "true")
        localStorage.setItem("hasDismissedCalibratePopup", "true")
        toast.success("Thank you! Your rank has been submitted anonymously.")
        
        // Auto-close modal after 2.5 seconds upon successful submission
        setTimeout(() => {
          setIsOpen(false)
        }, 2500)
      } else {
        toast.error(res.error || "Failed to submit calibration data.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md grid place-items-center p-4 overflow-y-auto"
      onClick={handleDismiss}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-background/40 to-pink-950/10 pointer-events-none" />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-slate-950/90 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-7 backdrop-blur-2xl overflow-hidden my-auto"
          >
            {/* Interactive neon corner glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 p-1.5 rounded-full border border-white/5 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/10 transition-all z-20"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Calibration Complete! 🎉</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Thank you! Your official marks and rank have been securely stored anonymously. This data helps us calibrating next year's predictions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Database className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                      Calibrate 2027 Predictor
                      <Sparkles className="h-4 w-4 text-pink-400" />
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Anonymously contribute your 2026 scores.
                    </p>
                  </div>
                </div>

                {/* Sticky Request Note Callout Box */}
                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1">
                    <HelpCircle className="h-3 w-3 text-indigo-400/50" />
                  </div>
                  <h4 className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    📢 Aspirant Request Note
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Help future students get accurate rank forecasts! If you took the KCET exam recently, please share your score and rank. Your input is <strong>100% anonymous</strong> and used solely to verify board weightage and rank shifts.
                  </p>
                </div>

                {/* Calibration Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid gap-3 grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="popupRank" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Official Rank</Label>
                      <Input
                        id="popupRank"
                        type="number"
                        required
                        placeholder="e.g. 15430"
                        value={shareRank}
                        onChange={e => setShareRank(e.target.value)}
                        className="bg-black/25 border-white/10 text-xs h-9 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="popupMarks" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">KCET Marks (out of 180)</Label>
                      <Input
                        id="popupMarks"
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 110"
                        value={shareMarks}
                        onChange={e => setShareMarks(e.target.value)}
                        className="bg-black/25 border-white/10 text-xs h-9 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="popupPuc" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">PUC PCM (%)</Label>
                      <Input
                        id="popupPuc"
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 95.5"
                        value={sharePucAggregate}
                        onChange={e => setSharePucAggregate(e.target.value)}
                        className="bg-black/25 border-white/10 text-xs h-9 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="popupBoard" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">12th Board</Label>
                      <Select value={shareBoard} onValueChange={setShareBoard}>
                        <SelectTrigger id="popupBoard" className="bg-black/25 border-white/10 text-xs h-9 text-white">
                          <SelectValue placeholder="Select Board" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-xs text-foreground">
                          <SelectItem value="State Board">State Board (PUC)</SelectItem>
                          <SelectItem value="CBSE">CBSE Class 12</SelectItem>
                          <SelectItem value="ISC">ISC Class 12</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="popupCategory" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Category</Label>
                    <Select value={shareCategory} onValueChange={setShareCategory}>
                      <SelectTrigger id="popupCategory" className="bg-black/25 border-white/10 text-xs h-9 text-white">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-xs text-foreground max-h-48">
                        {KCET_CATEGORIES.map(cat => (
                          <SelectItem key={cat.code} value={cat.code} className="hover:bg-slate-800 text-xs">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDismiss}
                      className="flex-1 border-white/10 hover:bg-white/5 text-xs text-slate-300 h-9"
                    >
                      Maybe Later
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold gap-1.5 h-9 text-xs"
                    >
                      {isSubmitting ? "Submitting..." : "Calibrate Now"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
