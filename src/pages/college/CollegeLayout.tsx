import { Outlet, useParams, Link, NavLink } from "react-router-dom";
import { ArrowLeft, Building2, ExternalLink, TrendingUp, Users } from "lucide-react";
import { CollegeSidebar } from "@/components/college/CollegeSidebar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CollegeInfo {
    name: string;
    code: string;
    website?: string;
}

export const CollegeLayout = () => {
    const { collegeCode } = useParams<{ collegeCode: string }>();
    const [collegeInfo, setCollegeInfo] = useState<CollegeInfo | null>(null);

    // Fetch college info (simplified for layout, could be shared state or context in refactor)
    // For now, we'll re-fetch or pass simplest data. 
    // Ideally, we fetch once here and pass via Context, but for MVP we might just fetch in children 
    // OR fetch here and display the header.
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                // Fast fetch just for name/code if possible, or full JSON.
                // Prefer high-volume merged dataset first, then fall back.
                const urls = [
                    '/data/kcet_cutoffs_high_volume.json',
                    '/data/kcet_cutoffs_master.json',
                    '/data/kcet_cutoffs_consolidated.json',
                    '/kcet_cutoffs_high_volume.json',
                    '/kcet_cutoffs_master.json',
                    '/kcet_cutoffs_consolidated.json',
                ];
                let data: any = null;
                for (const url of urls) {
                    const response = await fetch(url);
                    if (response.ok) {
                        data = await response.json();
                        break;
                    }
                }
                if (data) {
                    let cutoffs = Array.isArray(data) ? data : (data.cutoffs || data.data || []);
                    const code = String(collegeCode || "").toUpperCase();
                    const matches = cutoffs.filter((c: any) => String(c.institute_code || "").toUpperCase() === code);
                    if (matches.length > 0) {
                        const nameCounts = new Map<string, number>();
                        matches.forEach((c: any) => {
                            const name = String(c.institute || "").trim();
                            if (!name) return;
                            nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
                        });
                        let bestName = matches[0]?.institute || code;
                        let bestCount = -1;
                        for (const [name, count] of nameCounts.entries()) {
                            if (count > bestCount || (count === bestCount && name < bestName)) {
                                bestName = name;
                                bestCount = count;
                            }
                        }
                        setCollegeInfo({
                            name: bestName,
                            code
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to fetch college info for header", e);
            }
        };
        if (collegeCode) fetchInfo();
    }, [collegeCode]);

    return (
        <div className="flex flex-col min-h-screen bg-[#0a1628]">
            {/* Shared College Header */}
            <div className="bg-[#0f1d32] border-b border-[#1e3a5f] px-4 py-6 shadow-md z-10">
                <div className="max-w-[1600px] mx-auto w-full">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <Link to="/college-list" className="hover:text-white transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span>College Directory</span>
                        <span>/</span>
                        <span className="text-white">{collegeCode}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="w-16 h-16 rounded-xl bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                            <Building2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                                {collegeInfo ? collegeInfo.name : collegeCode}
                            </h1>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full border border-blue-500/20">
                                    Code: {collegeCode}
                                </span>
                                {collegeInfo?.website && (
                                    <a
                                        href={collegeInfo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1 transition-colors"
                                    >
                                        Visit Website
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Content: Sidebar + Page */}
            <div className="flex-1 max-w-[1600px] mx-auto w-full flex">
                {/* Contextual Sidebar */}
                <div className="hidden md:block w-64 border-r border-[#1e3a5f] bg-[#0f1d32]/50 min-h-[calc(100vh-200px)]">
                    <div className="p-4 space-y-2">
                        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Menu
                        </h3>
                        <NavLink
                            to={`/college/${collegeCode}`}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white hover:bg-[#1e3a5f]"
                                }`
                            }
                        >
                            <Building2 className="h-4 w-4" />
                            Overview
                        </NavLink>
                        <NavLink
                            to={`/college/${collegeCode}/analytics`}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white hover:bg-[#1e3a5f]"
                                }`
                            }
                        >
                            <TrendingUp className="h-4 w-4" />
                            Analytics
                        </NavLink>
                        <NavLink
                            to={`/college/${collegeCode}/community`}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white hover:bg-[#1e3a5f]"
                                }`
                            }
                        >
                            <Users className="h-4 w-4" />
                            Community
                        </NavLink>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
