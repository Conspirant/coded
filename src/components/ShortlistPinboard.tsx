import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Bookmark, Plus, Trash2, ArrowUp, ArrowDown, Copy, Check, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export interface ShortlistItem {
  id: string
  code: string
  name: string
  branch: string
  tag: "Safe" | "Target" | "Dream"
}

const STORAGE_KEY = "kcet.shortlist.v1"

const QUICK_ADD_COLLEGES: Omit<ShortlistItem, "id" | "tag">[] = [
  { code: "E001", name: "RV College of Engineering", branch: "CSE" },
  { code: "E003", name: "BMS College of Engineering", branch: "CSE" },
  { code: "E005", name: "MS Ramaiah Institute of Tech", branch: "CSE" },
  { code: "E006", name: "PES University (Ring Road)", branch: "CSE" },
  { code: "E008", name: "UVCE Bengaluru", branch: "CSE" },
  { code: "E036", name: "Dayananda Sagar College", branch: "CSE" },
]

export function ShortlistPinboard() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<ShortlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [customName, setCustomName] = useState("")
  const [customBranch, setCustomBranch] = useState("CSE")
  const [customTag, setCustomTag] = useState<"Safe" | "Target" | "Dream">("Target")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (item: Omit<ShortlistItem, "id">) => {
    setItems((prev) => {
      if (prev.some((p) => p.name.toLowerCase() === item.name.toLowerCase() && p.branch === item.branch)) {
        toast.info("Already in your shortlist")
        return prev
      }
      return [...prev, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const moveItem = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName.trim()) return
    addItem({
      code: "CUSTOM",
      name: customName.trim(),
      branch: customBranch.trim() || "CSE",
      tag: customTag,
    })
    setCustomName("")
  }

  const copyList = () => {
    if (items.length === 0) return
    const lines = items.map(
      (item, i) => `${i + 1}. ${item.name} (${item.branch}) [${item.tag}]${item.code !== "CUSTOM" ? ` — ${item.code}` : ""}`
    )
    const text = `KCET Option-Entry Shortlist:\n${lines.join("\n")}\n\nPlanned on https://kcetcoded.dev`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    toast.success("Option-entry shortlist copied")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border bg-muted/40 hover:bg-muted/80 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Option-Entry Shortlist"
      >
        <Bookmark className="h-3.5 w-3.5 text-primary" />
        <span className="hidden md:inline font-medium">Shortlist</span>
        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-background border border-border text-foreground tabular-nums">
          {items.length}
        </span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[120] flex justify-end">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setOpen(false)}
            />
            <aside className="relative z-10 w-full max-w-md bg-card border-l border-border h-dvh flex flex-col shadow-2xl animate-scale-in">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-primary" />
                    Option-Entry Shortlist
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Save &amp; rank colleges across pages for KEA counseling day.
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Quick Add Form */}
                <form onSubmit={handleAddCustom} className="space-y-2.5 p-3.5 rounded-xl border border-border bg-muted/30">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Add College to Priority List
                  </div>
                  <Input
                    placeholder="College name (e.g. RVCE, BMSCE)..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Branch (CSE)"
                      value={customBranch}
                      onChange={(e) => setCustomBranch(e.target.value)}
                      className="h-8 text-xs flex-1"
                    />
                    <select
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value as "Safe" | "Target" | "Dream")}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                    >
                      <option value="Safe">Safe</option>
                      <option value="Target">Target</option>
                      <option value="Dream">Dream</option>
                    </select>
                    <Button type="submit" size="sm" className="h-8 px-3 text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                </form>

                {/* Quick Pin Presets */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Quick Pin Popular Campuses
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ADD_COLLEGES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => addItem({ ...c, tag: "Target" })}
                        className="text-[11px] px-2.5 py-1 rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors"
                      >
                        + {c.code} {c.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Your Priority Order ({items.length})
                    </span>
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setItems([])}
                        className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                      No colleges pinned yet. Add colleges above to build your KEA option-entry order and share it with family.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-border bg-background flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs font-mono font-bold text-muted-foreground w-5 shrink-0">
                              {idx + 1}.
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-foreground truncate">{item.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-mono text-muted-foreground">{item.branch}</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0 rounded border ${
                                    item.tag === "Safe"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : item.tag === "Target"
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                  }`}
                                >
                                  {item.tag}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.code !== "CUSTOM" && (
                              <Link to={`/college/${item.code}`} onClick={() => setOpen(false)}>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              disabled={idx === 0}
                              onClick={() => moveItem(idx, -1)}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              disabled={idx === items.length - 1}
                              onClick={() => moveItem(idx, 1)}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="default"
                  className="flex-1 h-9 text-xs font-semibold"
                  disabled={items.length === 0}
                  onClick={copyList}
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                  {copied ? "Copied for WhatsApp / Family" : "Copy Priority List"}
                </Button>
                <Link to="/mock-simulator" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="h-9 text-xs font-medium">
                    Simulate
                  </Button>
                </Link>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  )
}
