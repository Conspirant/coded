import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { triggerScopeNotice } from "./ScopeNotification"

interface UnsupportedExamRedirectProps {
  examName?: string
}

export function UnsupportedExamRedirect({ examName = "NEET / COMEDK" }: UnsupportedExamRedirectProps) {
  useEffect(() => {
    triggerScopeNotice()
    toast.info("Admissions Scope Notice", {
      description: `KCET Coded currently supports only Karnataka CET admissions. We do not support ${examName} counseling at this time.`,
      duration: 6000,
    })
  }, [examName])

  return <Navigate to="/?notice=exam-scope" replace />
}
