import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PopupService } from "@/lib/popup-service";
import { SitePopup, PopupType } from "@/types/popup";
import {
  Megaphone,
  Wrench,
  AlertTriangle,
  Bell,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Power,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  X,
  Stethoscope,
  Info,
  Layers,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminPopupControllerSection() {
  const [popups, setPopups] = useState<SitePopup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Modal / Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<SitePopup | null>(null);
  const [previewPopup, setPreviewPopup] = useState<SitePopup | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    subtitle: string;
    message: string;
    type: PopupType;
    icon: string;
    badgeText: string;
    actionText: string;
    actionUrl: string;
    secondaryActionText: string;
    targetPagesText: string;
    dismissible: boolean;
    isForced: boolean;
    enabled: boolean;
  }>({
    title: "",
    subtitle: "",
    message: "",
    type: "announcement",
    icon: "bell",
    badgeText: "",
    actionText: "",
    actionUrl: "",
    secondaryActionText: "",
    targetPagesText: "*",
    dismissible: true,
    isForced: false,
    enabled: true
  });

  const { toast } = useToast();

  const fetchPopups = async () => {
    setLoading(true);
    const data = await PopupService.getAllPopups();
    setPopups(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPopups();
    const unsubscribe = PopupService.subscribeToPopups(() => {
      fetchPopups();
    });
    return () => unsubscribe();
  }, []);

  const openCreateDialog = (presetType?: PopupType) => {
    setEditingPopup(null);
    if (presetType === "maintenance") {
      setFormData({
        title: "Scheduled System Maintenance",
        subtitle: "Brief downtime notice for core services",
        message: "We are currently performing scheduled backend maintenance to upgrade servers and improve speed. Some features may be temporarily unavailable.",
        type: "maintenance",
        icon: "wrench",
        badgeText: "Maintenance Alert",
        actionText: "Check Server Status",
        actionUrl: "",
        secondaryActionText: "Dismiss",
        targetPagesText: "*",
        dismissible: true,
        isForced: false,
        enabled: true
      });
    } else if (presetType === "maintenance_announcement") {
      setFormData({
        title: "Maintenance Completed & New Feature Launch",
        subtitle: "Server upgrades successfully completed!",
        message: "Maintenance is finished! We have deployed enhanced rank prediction algorithms, faster page loading, and updated round tracker insights.",
        type: "maintenance_announcement",
        icon: "alert-triangle",
        badgeText: "Maintenance & Update",
        actionText: "Explore What's New",
        actionUrl: "/round-predictor",
        secondaryActionText: "Got it",
        targetPagesText: "*",
        dismissible: true,
        isForced: false,
        enabled: true
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        message: "",
        type: "announcement",
        icon: "bell",
        badgeText: "Announcement",
        actionText: "",
        actionUrl: "",
        secondaryActionText: "",
        targetPagesText: "*",
        dismissible: true,
        isForced: false,
        enabled: true
      });
    }
    setIsDialogOpen(true);
  };

  const openEditDialog = (popup: SitePopup) => {
    setEditingPopup(popup);
    setFormData({
      id: popup.id,
      title: popup.title,
      subtitle: popup.subtitle || "",
      message: popup.message,
      type: popup.type,
      icon: popup.icon || "bell",
      badgeText: popup.badgeText || "",
      actionText: popup.actionText || "",
      actionUrl: popup.actionUrl || "",
      secondaryActionText: popup.secondaryActionText || "",
      targetPagesText: (popup.targetPages || ["*"]).join(", "),
      dismissible: popup.dismissible !== false,
      isForced: Boolean(popup.isForced),
      enabled: Boolean(popup.enabled)
    });
    setIsDialogOpen(true);
  };

  const handleToggle = async (popup: SitePopup) => {
    setTogglingId(popup.id);
    const newStatus = !popup.enabled;
    const ok = await PopupService.togglePopupStatus(popup.id, newStatus);
    if (ok) {
      toast({
        title: newStatus ? "Popup Enabled" : "Popup Disabled",
        description: `"${popup.title}" is now ${newStatus ? "ACTIVE on the site" : "INACTIVE"}.`
      });
      fetchPopups();
    } else {
      toast({
        title: "Toggle Failed",
        description: "Could not update popup state.",
        variant: "destructive"
      });
    }
    setTogglingId(null);
  };

  const handleDelete = async (popup: SitePopup) => {
    if (!confirm(`Are you sure you want to delete "${popup.title}"?`)) return;
    const ok = await PopupService.deletePopup(popup.id);
    if (ok) {
      toast({
        title: "Popup Deleted",
        description: `"${popup.title}" was removed successfully.`
      });
      fetchPopups();
    } else {
      toast({
        title: "Delete Failed",
        description: "Could not delete popup.",
        variant: "destructive"
      });
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and Message are required fields.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const targetPages = formData.targetPagesText
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    const result = await PopupService.upsertPopup({
      id: formData.id,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      message: formData.message.trim(),
      type: formData.type,
      icon: formData.icon || "bell",
      badgeText: formData.badgeText.trim() || undefined,
      actionText: formData.actionText.trim() || undefined,
      actionUrl: formData.actionUrl.trim() || undefined,
      secondaryActionText: formData.secondaryActionText.trim() || undefined,
      targetPages: targetPages.length > 0 ? targetPages : ["*"],
      dismissible: formData.dismissible,
      isForced: formData.isForced,
      enabled: formData.enabled
    });

    setSaving(false);

    if (result.success) {
      toast({
        title: formData.id ? "Popup Updated" : "Popup Created Successfully",
        description: `"${formData.title}" has been saved and synced across active users.`
      });
      setIsDialogOpen(false);
      fetchPopups();
    } else {
      toast({
        title: "Save Error",
        description: result.error || "Failed to save popup.",
        variant: "destructive"
      });
    }
  };

  const handleLivePreviewCurrentForm = () => {
    const pages = formData.targetPagesText
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    setPreviewPopup({
      id: formData.id || "preview_id",
      title: formData.title || "Preview Title",
      subtitle: formData.subtitle || "Preview Subtitle",
      message: formData.message || "This is how your popup message will appear to users on the website.",
      type: formData.type,
      icon: formData.icon || "bell",
      badgeText: formData.badgeText || (formData.type === "maintenance" ? "Maintenance Alert" : formData.type === "maintenance_announcement" ? "Maintenance & Update" : "Announcement"),
      actionText: formData.actionText || "Action Button",
      actionUrl: formData.actionUrl || "",
      secondaryActionText: formData.secondaryActionText || "Dismiss",
      targetPages: pages.length > 0 ? pages : ["*"],
      dismissible: formData.dismissible,
      isForced: formData.isForced,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  // Helper for popup badge styling
  const getTypeBadge = (type: PopupType) => {
    switch (type) {
      case "maintenance":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold gap-1">
            <Wrench className="h-3 w-3" /> Maintenance Update
          </Badge>
        );
      case "maintenance_announcement":
        return (
          <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 font-semibold gap-1">
            <AlertTriangle className="h-3 w-3" /> Maintenance & Announcement
          </Badge>
        );
      case "announcement":
      default:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-semibold gap-1">
            <Megaphone className="h-3 w-3" /> Announcement
          </Badge>
        );
    }
  };

  const totalPopups = popups.length;
  const activePopupsCount = popups.filter(p => p.enabled).length;
  const maintenanceCount = popups.filter(p => p.type === "maintenance" || p.type === "maintenance_announcement").length;
  const announcementCount = popups.filter(p => p.type === "announcement").length;

  return (
    <div className="space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Megaphone className="h-6 w-6 text-indigo-400" />
            Popup Controller & Alerts
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create, toggle, and manage live announcements, maintenance updates, and popup alerts on the platform.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => openCreateDialog("announcement")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-9 shadow-lg shadow-emerald-900/30 gap-1.5"
          >
            <Plus className="h-4 w-4" /> New Announcement
          </Button>
          <Button
            onClick={() => openCreateDialog("maintenance")}
            className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold h-9 shadow-lg shadow-amber-900/30 gap-1.5"
          >
            <Wrench className="h-4 w-4" /> Maintenance Notice
          </Button>
          <Button
            onClick={() => openCreateDialog("maintenance_announcement")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 shadow-lg shadow-indigo-900/30 gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Maintenance + Announcement
          </Button>
        </div>
      </div>

      {/* Metrics Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Popups</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalPopups}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active (Enabled)</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Power className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">{activePopupsCount}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Announcements</span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Bell className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-300 mt-2">{announcementCount}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Maintenance Alerts</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">{maintenanceCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Popups List Card */}
      <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-400" />
              Live Site Popups Directory
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enable or disable popups in real-time. Changes apply instantly across active user sessions.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPopups}
            className="border-white/10 hover:bg-white/5 text-xs h-8"
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
              Loading site popups...
            </div>
          ) : popups.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="p-4 rounded-full bg-white/5 w-12 h-12 mx-auto flex items-center justify-center text-muted-foreground">
                <Megaphone className="h-6 w-6" />
              </div>
              <p className="text-sm text-slate-300 font-medium">No popups configured yet.</p>
              <p className="text-xs text-muted-foreground">Click below to create your first announcement or maintenance alert.</p>
              <Button onClick={() => openCreateDialog("announcement")} className="bg-indigo-600 hover:bg-indigo-500 text-xs">
                Create First Popup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {popups.map((popup) => (
                <div
                  key={popup.id}
                  className={`p-4 rounded-xl border transition-all ${
                    popup.enabled
                      ? "bg-slate-900/60 border-emerald-500/30 shadow-md shadow-emerald-950/20"
                      : "bg-white/[0.02] border-white/5 opacity-75"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Popup Details */}
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(popup.type)}
                        {popup.badgeText && (
                          <Badge variant="outline" className="text-[10px] bg-white/5 text-zinc-300 border-white/10">
                            {popup.badgeText}
                          </Badge>
                        )}
                        {popup.isForced && (
                          <Badge variant="destructive" className="text-[9px] px-1.5 py-0 uppercase font-bold">
                            Forced / High Priority
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Target: {popup.targetPages?.join(", ") || "*"}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {popup.title}
                      </h3>
                      {popup.subtitle && (
                        <p className="text-xs text-indigo-300 font-medium">{popup.subtitle}</p>
                      )}
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {popup.message}
                      </p>
                    </div>

                    {/* Right: Actions & Toggle */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        <span className="text-xs font-semibold text-zinc-300">
                          {popup.enabled ? "Enabled" : "Disabled"}
                        </span>
                        <Switch
                          checked={popup.enabled}
                          disabled={togglingId === popup.id}
                          onCheckedChange={() => handleToggle(popup)}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewPopup(popup)}
                        className="h-8 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 gap-1"
                        title="Preview popup"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(popup)}
                        className="h-8 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30 gap-1"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(popup)}
                        className="h-8 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-2"
                        title="Delete popup"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Popup Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              {editingPopup ? <Edit3 className="h-5 w-5 text-indigo-400" /> : <Plus className="h-5 w-5 text-emerald-400" />}
              {editingPopup ? "Edit Popup Configuration" : "Create New Site Popup"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure announcement details, maintenance notices, and visual triggers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            {/* Type selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Popup Category / Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val: PopupType) => {
                  setFormData(prev => ({
                    ...prev,
                    type: val,
                    icon: val === "maintenance" ? "wrench" : val === "maintenance_announcement" ? "alert-triangle" : "bell",
                    badgeText: prev.badgeText || (val === "maintenance" ? "Maintenance Alert" : val === "maintenance_announcement" ? "Maintenance & Update" : "Announcement")
                  }));
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                  <SelectItem value="announcement">Megaphone Announcement (News / Features)</SelectItem>
                  <SelectItem value="maintenance">Wrench Maintenance Update (Server Maintenance)</SelectItem>
                  <SelectItem value="maintenance_announcement">Sparkle Maintenance + Announcement (Release Release)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Title *</Label>
                <Input
                  required
                  placeholder="e.g. NEET Coded Launch / Maintenance Scheduled"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subtitle / Tagline (Optional)</Label>
                <Input
                  placeholder="e.g. Built based on student feedback"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="bg-white/5 border-white/10 text-xs"
                />
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Message Content *</Label>
              <Textarea
                required
                rows={4}
                placeholder="Write full announcement details or maintenance explanation here..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/5 border-white/10 text-xs leading-relaxed resize-y"
              />
            </div>

            {/* Icon & Badge Label */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Icon Style</Label>
                <Select
                  value={formData.icon}
                  onValueChange={val => setFormData({ ...formData, icon: val })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                    <SelectItem value="bell">Bell Icon</SelectItem>
                    <SelectItem value="wrench">Wrench Tool Icon</SelectItem>
                    <SelectItem value="alert-triangle">Alert Triangle Icon</SelectItem>
                    <SelectItem value="stethoscope">Stethoscope Icon</SelectItem>
                    <SelectItem value="megaphone">Megaphone Icon</SelectItem>
                    <SelectItem value="sparkles">Sparkles Icon</SelectItem>
                    <SelectItem value="shield">Shield Icon</SelectItem>
                    <SelectItem value="info">Info Circle Icon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Badge Label (Optional)</Label>
                <Input
                  placeholder="e.g. Downtime Alert, New Feature"
                  value={formData.badgeText}
                  onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                  className="bg-white/5 border-white/10 text-xs"
                />
              </div>
            </div>

            {/* Action Buttons Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary CTA Action Text (Optional)</Label>
                <Input
                  placeholder="e.g. Explore Now / Notify Me"
                  value={formData.actionText}
                  onChange={e => setFormData({ ...formData, actionText: e.target.value })}
                  className="bg-white/5 border-white/10 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Action Link URL (Optional)</Label>
                <Input
                  placeholder="e.g. /round-predictor or https://..."
                  value={formData.actionUrl}
                  onChange={e => setFormData({ ...formData, actionUrl: e.target.value })}
                  className="bg-white/5 border-white/10 text-xs font-mono"
                />
              </div>
            </div>

            {/* Target Pages & Behavior */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Route Paths (Comma separated)</Label>
              <Input
                placeholder="Use * for all pages, or /round-predictor, /college-predictor"
                value={formData.targetPagesText}
                onChange={e => setFormData({ ...formData, targetPagesText: e.target.value })}
                className="bg-white/5 border-white/10 text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">Default `*` displays the popup site-wide.</p>
            </div>

            {/* Switches and Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dismissible"
                  checked={formData.dismissible}
                  onCheckedChange={checked => setFormData({ ...formData, dismissible: Boolean(checked) })}
                />
                <Label htmlFor="dismissible" className="text-xs font-medium cursor-pointer">
                  User can dismiss popup
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isForced"
                  checked={formData.isForced}
                  onCheckedChange={checked => setFormData({ ...formData, isForced: Boolean(checked) })}
                />
                <Label htmlFor="isForced" className="text-xs font-medium text-rose-400 cursor-pointer">
                  Force show (Ignore saved dismissal)
                </Label>
              </div>

              <div className="col-span-full pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-xs font-semibold text-white">Enable popup immediately upon saving</span>
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={checked => setFormData({ ...formData, enabled: checked })}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleLivePreviewCurrentForm}
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/40 text-xs gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" /> Test Live Preview
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold h-9 px-4 gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Save & Deploy Popup
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Test Preview Modal */}
      {previewPopup && (
        <AdminPopupPreviewModal
          popup={previewPopup}
          onClose={() => setPreviewPopup(null)}
        />
      )}
    </div>
  );
}

// ─── Modal Live Preview Component inside Admin Panel ───────────────────
function AdminPopupPreviewModal({ popup, onClose }: { popup: SitePopup; onClose: () => void }) {
  const getIcon = () => {
    switch (popup.icon) {
      case "wrench":
        return <Wrench className="h-6 w-6 text-amber-400" />;
      case "alert-triangle":
        return <AlertTriangle className="h-6 w-6 text-indigo-400" />;
      case "stethoscope":
        return <Stethoscope className="h-6 w-6 text-emerald-400" />;
      case "megaphone":
        return <Megaphone className="h-6 w-6 text-cyan-400" />;
      case "sparkles":
        return <Sparkles className="h-6 w-6 text-purple-400" />;
      case "shield":
        return <ShieldAlert className="h-6 w-6 text-rose-400" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-400" />;
      case "bell":
      default:
        return <Bell className="h-6 w-6 text-emerald-400" />;
    }
  };

  const isMaintenance = popup.type === "maintenance";
  const isMaintenanceUpdate = popup.type === "maintenance_announcement";

  const borderColor = isMaintenance
    ? "border-amber-500/30"
    : isMaintenanceUpdate
    ? "border-indigo-500/30"
    : "border-emerald-500/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-md bg-zinc-950 border ${borderColor} rounded-2xl p-6 text-zinc-100 shadow-2xl space-y-4`}
      >
        <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono border-b border-white/10 pb-2 mb-2">
          <span>LIVE ADMIN PREVIEW MODE</span>
          <button onClick={onClose} className="p-1 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white leading-snug">{popup.title}</h2>
              </div>
              {popup.subtitle && (
                <p className="text-xs text-indigo-400 font-medium mt-0.5">{popup.subtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
          <p>{popup.message}</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs h-9"
          >
            {popup.secondaryActionText || "Close Preview"}
          </Button>
          {popup.actionText && (
            <Button
              onClick={() => {
                alert(`Action link trigger: ${popup.actionUrl || "No URL set"}`);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 flex items-center gap-1.5"
            >
              <span>{popup.actionText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
