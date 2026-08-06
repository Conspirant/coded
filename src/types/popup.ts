export type PopupType = 'announcement' | 'maintenance' | 'maintenance_announcement';

export interface SitePopup {
  id: string;
  title: string;
  subtitle?: string;
  message: string;
  type: PopupType;
  icon?: string; // e.g. 'bell' | 'wrench' | 'alert-triangle' | 'megaphone' | 'stethoscope' | 'sparkles' | 'shield' | 'info'
  badgeText?: string; // Custom badge label like "New Feature", "Downtime Alert", "System Notice"
  actionText?: string; // Optional CTA button label
  actionUrl?: string; // Optional CTA button URL link (e.g. "/round-predictor", "https://...")
  secondaryActionText?: string; // Optional secondary button text
  targetPages?: string[]; // Routes to show popup on, e.g. ["*"] for all pages, or ["/college-predictor"]
  dismissible: boolean; // Can user dismiss this modal
  isForced?: boolean; // If true, ignores prior user dismissal (always shows until disabled by admin)
  enabled: boolean; // Active state toggle controlled by admin
  createdAt: string;
  updatedAt: string;
}
