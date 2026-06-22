import { useState, useEffect } from "react";

interface CollegeLogoProps {
  code: string;
  name: string;
  website: string | null;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  sizeClassName?: string;
  textClassName?: string;
  logoUrl?: string | null;
}

const TIER_GRADIENTS = {
  'Tier 1': 'from-emerald-500 to-cyan-600',
  'Tier 2': 'from-blue-500 to-indigo-600',
  'Tier 3': 'from-amber-500 to-orange-600',
  'Tier 4': 'from-gray-500 to-slate-600',
};

// Helper to extract clean domain from website URL
function getDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    const domain = url
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .split("/")[0]
      .trim();
    return domain || null;
  } catch (e) {
    return null;
  }
}

// Helper to extract initials
function getInitials(name: string): string {
  const clean = name
    .replace(/^Govt\.?\s+/i, "")
    .replace(/^Government\s+/i, "")
    .replace(/[^a-zA-Z\s]/g, "")
    .trim();
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase();
}

export function CollegeLogo({
  code,
  name,
  website,
  tier,
  sizeClassName = "w-12 h-12",
  textClassName = "text-[10px]",
  logoUrl
}: CollegeLogoProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const domain = getDomain(website);

  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [website, logoUrl]);

  const initials = getInitials(name);
  const gradient = TIER_GRADIENTS[tier] || TIER_GRADIENTS['Tier 4'];
  
  const imageUrl = logoUrl || (domain ? `https://www.google.com/s2/favicons?sz=128&domain=${domain}` : null);

  if (!imageUrl || error) {
    return (
      <div className={`${sizeClassName} rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10 hover:scale-105 transition-transform duration-300`}>
        <span className={`text-white font-bold tracking-wider ${textClassName}`}>{initials}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClassName} rounded-xl overflow-hidden bg-card border border-white/15 flex items-center justify-center flex-shrink-0 shadow-md group hover:scale-105 transition-transform duration-300`}>
      {loading && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-xl" />
      )}
      <img
        src={imageUrl}
        alt={`${name} logo`}
        className={`w-4/5 h-4/5 object-contain transition-all duration-500 rounded-lg ${
          loading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}
