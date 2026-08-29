import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    MapPin,
    Train,
    IndianRupee,
    Briefcase,
    Swords,
    BarChart3,
    Scale,
    ShieldCheck,
    Sparkles,
    AlertCircle
} from "lucide-react";
import { COLLEGE_DATABASE } from "@/data/collegeDatabase";
import { METRO_COLLEGES } from "@/lib/metro-colleges";

export interface RecommendationCardData {
    collegeCode: string;
    collegeName: string;
    branch: string;
    cutoffRank: number;
    year?: string;
    round?: string;
    category?: string;
    userRank?: number;
    safetyTier?: "safe" | "target" | "reach" | "dream";
    feeEstimate?: string;
    city?: string;
    metroStation?: string;
    metroDistance?: string;
    metroWalkTime?: string;
    avgPackage?: number | null;
    medianPackage?: number | null;
}

interface CounselorRecommendationCardProps {
    data: RecommendationCardData;
}

export const CounselorRecommendationCard: React.FC<CounselorRecommendationCardProps> = ({
    data,
}) => {
    // Enrich with database information
    const dbCollege = COLLEGE_DATABASE.find(
        (c) => c.code.toUpperCase() === data.collegeCode.toUpperCase()
    );

    const metroInfo = METRO_COLLEGES.find(
        (m) => m.code.toUpperCase() === data.collegeCode.toUpperCase()
    );

    const collegeName = dbCollege?.name || data.collegeName;
    const shortName = dbCollege?.shortName || data.collegeName;
    const city = dbCollege?.city || data.city || "Karnataka";
    const avgPackage = dbCollege?.avgPackage ?? data.avgPackage;
    const feeCet = dbCollege?.feeCetQuota;

    // Calculate safety tier if userRank is available and not provided
    let safetyTier = data.safetyTier;
    let margin = 0;
    if (data.userRank && data.cutoffRank) {
        margin = data.cutoffRank - data.userRank;
        if (!safetyTier) {
            if (margin >= 2000) safetyTier = "safe";
            else if (margin >= -500) safetyTier = "target";
            else if (margin >= -2500) safetyTier = "reach";
            else safetyTier = "dream";
        }
    }

    const tierConfig = {
        safe: {
            label: "High Chance (Safe)",
            bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
            dot: "bg-emerald-500",
            icon: ShieldCheck,
        },
        target: {
            label: "Realistic Target",
            bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
            dot: "bg-blue-500",
            icon: Sparkles,
        },
        reach: {
            label: "Moderate Reach",
            bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
            dot: "bg-amber-500",
            icon: AlertCircle,
        },
        dream: {
            label: "Ambitious / Dream",
            bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
            dot: "bg-rose-500",
            icon: Sparkles,
        },
    };

    const currentTier = safetyTier ? tierConfig[safetyTier] : null;

    return (
        <Card className="my-2.5 overflow-hidden border border-border/80 bg-card/95 hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md">
            {/* Card Header Stripe */}
            <div className="bg-gradient-to-r from-muted/80 to-muted/40 px-3.5 py-2 border-b border-border/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {data.collegeCode}
                    </span>
                    <span className="font-semibold text-xs md:text-sm text-foreground truncate" title={collegeName}>
                        {shortName || collegeName}
                    </span>
                </div>

                {currentTier && (
                    <Badge
                        variant="outline"
                        className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 shrink-0 flex items-center gap-1 ${currentTier.bg}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${currentTier.dot}`} />
                        {currentTier.label}
                    </Badge>
                )}
            </div>

            <CardContent className="p-3.5 space-y-3">
                {/* Branch & Cutoff Matrix */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-background/60 p-2.5 rounded-lg border border-border/40">
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Offered Branch</p>
                        <p className="text-sm font-bold text-foreground truncate">{data.branch}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="text-left sm:text-right">
                            <p className="text-[11px] text-muted-foreground">
                                Cutoff Rank {data.round ? `(${data.round})` : ""}
                            </p>
                            <p className="text-sm font-extrabold font-mono text-primary">
                                #{data.cutoffRank.toLocaleString()}
                            </p>
                        </div>
                        {data.category && (
                            <Badge variant="secondary" className="text-[10px] font-mono">
                                {data.category}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Key Insights Chips (Metro, Fee, Placement, City) */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {/* Location Badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground border border-border/50 text-[11px]">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{city}</span>
                    </div>

                    {/* Metro Proximity */}
                    {metroInfo ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-[11px]">
                            <Train className="h-3 w-3 text-purple-500" />
                            <span>{metroInfo.station} Metro ({metroInfo.walkTime})</span>
                        </div>
                    ) : data.metroStation ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-[11px]">
                            <Train className="h-3 w-3 text-purple-500" />
                            <span>{data.metroStation}</span>
                        </div>
                    ) : null}

                    {/* Fee Badge */}
                    {feeCet ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px]">
                            <IndianRupee className="h-3 w-3 text-emerald-500" />
                            <span>₹{feeCet}L/yr (Govt Quota)</span>
                        </div>
                    ) : data.feeEstimate ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px]">
                            <IndianRupee className="h-3 w-3 text-emerald-500" />
                            <span>{data.feeEstimate}</span>
                        </div>
                    ) : null}

                    {/* Placement Package */}
                    {avgPackage ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-[11px]">
                            <Briefcase className="h-3 w-3 text-blue-500" />
                            <span>{avgPackage} LPA Avg</span>
                        </div>
                    ) : null}
                </div>

                {/* Quick Action Navigation Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40">
                    <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2.5 text-[11px] font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        <Link to={`/cutoff-clash?c1=${encodeURIComponent(data.collegeCode)}`}>
                            <Swords className="h-3 w-3 mr-1 text-purple-500" />
                            Cutoff Clash
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                    >
                        <Link to={`/college-compare?c1=${encodeURIComponent(data.collegeCode)}`}>
                            <Scale className="h-3 w-3 mr-1" />
                            Compare
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                    >
                        <Link to={`/college-cutoffs?college=${encodeURIComponent(data.collegeCode)}`}>
                            <BarChart3 className="h-3 w-3 mr-1" />
                            All Cutoffs
                        </Link>
                    </Button>

                    {metroInfo && (
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                        >
                            <Link to="/metro-mapper">
                                <Train className="h-3 w-3 mr-1" />
                                Metro Route
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
