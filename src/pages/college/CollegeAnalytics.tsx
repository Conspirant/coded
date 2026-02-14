import { useParams } from "react-router-dom";
import { CutoffTrendsGraph } from "@/components/analytics/CutoffTrendsGraph";
import { CompetitionHeatmap } from "@/components/analytics/CompetitionHeatmap";
import { useState, useEffect } from "react";

export const CollegeAnalytics = () => {
    const { collegeCode } = useParams<{ collegeCode: string }>();
    const [collegeName, setCollegeName] = useState(collegeCode || "");

    useEffect(() => {
        // Optional: Fetch name to pass to graph if needed, 
        // though graph fetches its own data, it needs name for display
        const fetchName = async () => {
            try {
                // Use /data/kcet_cutoffs_consolidated.json first as it has the complete R3 2025 data
                let res = await fetch('/data/kcet_cutoffs_consolidated.json');
                if (!res.ok) {
                    res = await fetch('/kcet_cutoffs_consolidated.json');
                }
                if (res.ok) {
                    const data = await res.json();
                    const list = Array.isArray(data) ? data : (data.data || []);
                    const found = list.find((c: any) => c.institute_code === collegeCode);
                    if (found) setCollegeName(found.institute);
                }
            } catch (e) { }
        };
        fetchName();
    }, [collegeCode]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Visual Analytics</h2>
                <p className="text-gray-400">Deep dive into cutoff trends and market demand data.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <CutoffTrendsGraph
                        collegeCode={collegeCode || ""}
                        collegeName={collegeName}
                    />
                </div>

                <div className="md:col-span-2">
                    <CompetitionHeatmap />
                </div>
            </div>
        </div>
    );
};

export default CollegeAnalytics;
