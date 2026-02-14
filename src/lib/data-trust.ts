import { getPdfUrl } from "@/lib/pdf-url-mapper"

export type TrustLevel = "pdf_exact" | "mapped" | "merged"

interface TrustMeta {
  level: TrustLevel
  label: string
  className: string
}

const TRUST_META: Record<TrustLevel, TrustMeta> = {
  pdf_exact: {
    level: "pdf_exact",
    label: "Verified",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  mapped: {
    level: "mapped",
    label: "Mapped",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  merged: {
    level: "merged",
    label: "Merged",
    className: "bg-slate-100 text-slate-800 border-slate-200",
  },
}

const hasPdfReference = (year: string, round: string, instituteCode: string) => {
  const code = String(instituteCode || "").trim().toUpperCase()
  if (!/^E\d{3}$/.test(code)) return false
  return !!getPdfUrl(String(year || ""), String(round || ""))
}

export const getTrustMeta = (row: {
  year: string
  round: string
  institute_code: string
}): TrustMeta => {
  if (!hasPdfReference(row.year, row.round, row.institute_code)) {
    return TRUST_META.merged
  }
  if (String(row.year) === "2025") {
    return TRUST_META.pdf_exact
  }
  if (String(row.year) === "2023" || String(row.year) === "2024") {
    return TRUST_META.mapped
  }
  return TRUST_META.merged
}

export const extractPdfPage = (pdfUrl: string): number | null => {
  const match = String(pdfUrl || "").match(/[#&]page=(\d+)/i)
  if (!match) return null
  const page = Number(match[1])
  return Number.isFinite(page) ? page : null
}
