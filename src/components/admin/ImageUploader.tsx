import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Trash2, Clipboard, Image as ImageIcon, Check, Loader2, Link2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    description?: string;
    compact?: boolean;
    previewHeight?: string;
}

/**
 * Optimizes an image (file or pasted clipboard) into an efficient compressed WebP/JPEG data URL.
 * Max dimension: 1200px (or 800px for options), Quality: 0.85.
 * Keeps file size tiny (~20KB-80KB) so it saves directly into Supabase without storage bucket limits.
 */
export async function optimizeImageToDataUrl(file: File | Blob, maxWidth = 1200, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    resolve(e.target?.result as string);
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Try converting to WebP for maximum compression; fallback to JPEG
                try {
                    const webpUrl = canvas.toDataURL("image/webp", quality);
                    if (webpUrl && webpUrl.startsWith("data:image/webp")) {
                        resolve(webpUrl);
                        return;
                    }
                } catch (err) {
                    // ignore
                }

                const jpegUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(jpegUrl);
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function ImageUploader({
    value = "",
    onChange,
    label,
    description,
    compact = false,
    previewHeight = "max-h-48"
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPasting, setIsPasting] = useState(false)
    const [isUrlInputOpen, setIsUrlInputOpen] = useState(false)
    const { toast } = useToast()

    // File selected via file chooser
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast({ title: "Invalid file", description: "Please select an image file (PNG, JPG, WebP)", variant: "destructive" })
            return
        }

        setIsProcessing(true)
        try {
            const dataUrl = await optimizeImageToDataUrl(file, compact ? 600 : 1200)
            onChange(dataUrl)
            toast({ title: "Image attached", description: "Image compressed & ready to save to database." })
        } catch (err: any) {
            toast({ title: "Failed to process image", description: err.message, variant: "destructive" })
        } finally {
            setIsProcessing(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    // Direct clipboard paste handler
    const handlePasteFromClipboard = async () => {
        setIsPasting(true)
        try {
            if (!navigator.clipboard?.read) {
                toast({ title: "Clipboard error", description: "Your browser doesn't allow direct clipboard reading. Use file upload or Ctrl+V in the box.", variant: "destructive" })
                setIsPasting(false)
                return
            }

            const items = await navigator.clipboard.read()
            let foundImage = false

            for (const item of items) {
                const imageType = item.types.find(t => t.startsWith("image/"))
                if (imageType) {
                    const blob = await item.getType(imageType)
                    const dataUrl = await optimizeImageToDataUrl(blob, compact ? 600 : 1200)
                    onChange(dataUrl)
                    toast({ title: "Image pasted!", description: "Image read from clipboard and attached." })
                    foundImage = true
                    break
                }
            }

            if (!foundImage) {
                // Check if clipboard contains an image URL as plain text
                const text = await navigator.clipboard.readText()
                if (text && (text.startsWith("http") || text.startsWith("data:image/"))) {
                    onChange(text.trim())
                    toast({ title: "Image URL attached", description: "Direct URL inserted from clipboard." })
                } else {
                    toast({ title: "No image found", description: "Copy an image or screenshot first, then click Paste." })
                }
            }
        } catch (err: any) {
            toast({ title: "Paste error", description: err.message || "Failed to read clipboard image", variant: "destructive" })
        } finally {
            setIsPasting(false)
        }
    }

    // Delete image
    const handleDeleteImage = () => {
        onChange("")
        toast({ title: "Image removed", description: "Save question to persist changes." })
    }

    if (compact) {
        return (
            <div className="space-y-1.5">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex items-center gap-1.5">
                    {value ? (
                        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 px-2 rounded-lg border border-emerald-500/30 flex-1 min-w-0">
                            <img
                                src={value}
                                alt="Option image"
                                className="h-8 w-8 object-contain rounded bg-black/40 border border-white/10 shrink-0"
                            />
                            <div className="text-[10px] text-emerald-400 truncate flex-1 font-mono">
                                Image attached
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleDeleteImage}
                                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                                title="Remove image"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isProcessing}
                                onClick={() => fileInputRef.current?.click()}
                                className="h-6 text-[10px] px-2 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300"
                            >
                                {isProcessing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Upload className="h-3 w-3 mr-1" />}
                                Upload Image
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={isPasting}
                                onClick={handlePasteFromClipboard}
                                className="h-6 text-[10px] px-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                title="Paste image from clipboard"
                            >
                                <Clipboard className="h-3 w-3 mr-1" />
                                Paste
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2 rounded-xl bg-white/[0.02] border border-white/10 p-3.5">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

            <div className="flex items-center justify-between">
                <div>
                    {label && <Label className="text-xs text-slate-200 font-semibold">{label}</Label>}
                    {description && <p className="text-[11px] text-slate-400">{description}</p>}
                </div>
                {value && (
                    <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] flex items-center gap-1">
                        <Check className="h-3 w-3" /> Image Active
                    </Badge>
                )}
            </div>

            {value ? (
                <div className="space-y-3">
                    {/* Image Preview Box */}
                    <div className="relative rounded-lg border border-white/10 bg-black/40 p-2 flex items-center justify-center overflow-hidden">
                        <img
                            src={value}
                            alt="Preview"
                            className={`${previewHeight} w-auto max-w-full rounded object-contain`}
                            onError={(e: any) => { e.target.src = "" }}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-slate-400 truncate max-w-xs font-mono">
                            {value.startsWith("data:") ? "Embedded Data Image (Synced with DB)" : value}
                        </span>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-7 text-xs border-white/10 text-slate-300 hover:bg-white/5"
                            >
                                <Upload className="h-3 w-3 mr-1.5" /> Replace
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteImage}
                                className="h-7 text-xs bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                            >
                                <Trash2 className="h-3 w-3 mr-1.5" /> Delete Image
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onPaste={async (e) => {
                        const items = e.clipboardData?.items;
                        if (!items) return;
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].type.startsWith("image/")) {
                                const blob = items[i].getAsFile();
                                if (blob) {
                                    setIsProcessing(true);
                                    try {
                                        const dataUrl = await optimizeImageToDataUrl(blob, 1200);
                                        onChange(dataUrl);
                                        toast({ title: "Image pasted successfully!" });
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                    return;
                                }
                            }
                        }
                    }}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="p-3 rounded-full bg-white/5 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors mb-2">
                        {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-6 w-6" />}
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-xs font-semibold text-slate-200">
                            Click to upload, or paste (Ctrl+V) image here
                        </p>
                        <p className="text-[11px] text-slate-500">
                            Supports PNG, JPG, WebP, SVG (Auto-compressed for fast loading on web)
                        </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => fileInputRef.current?.click()}
                            className="h-7 text-xs bg-white/10 hover:bg-white/15 text-white"
                        >
                            <Upload className="h-3.5 w-3.5 mr-1.5" /> Choose File
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPasting}
                            onClick={handlePasteFromClipboard}
                            className="h-7 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                        >
                            <Clipboard className="h-3.5 w-3.5 mr-1.5" /> Paste from Clipboard
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsUrlInputOpen(!isUrlInputOpen)}
                            className="h-7 text-xs text-slate-400 hover:text-white"
                        >
                            <Link2 className="h-3.5 w-3.5 mr-1" /> URL
                        </Button>
                    </div>

                    {isUrlInputOpen && (
                        <div className="w-full mt-3 pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                            <Input
                                placeholder="Paste direct image URL: https://... or /pyq_images/..."
                                className="bg-white/5 border-white/10 text-xs h-8 text-white placeholder:text-slate-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onChange((e.target as HTMLInputElement).value.trim());
                                        setIsUrlInputOpen(false);
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.trim()) {
                                        onChange(e.target.value.trim());
                                        setIsUrlInputOpen(false);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
