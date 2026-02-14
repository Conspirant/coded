import { useParams } from "react-router-dom";
import { DiscussionBoard } from "@/components/community/DiscussionBoard";
import { MentorList } from "@/components/community/MentorList";
import { useState, useEffect } from "react";

export const CollegeCommunity = () => {
    const { collegeCode } = useParams<{ collegeCode: string }>();
    const [collegeName, setCollegeName] = useState(collegeCode || "");

    useEffect(() => {
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
                <h2 className="text-2xl font-bold text-white mb-2">Community & Connect</h2>
                <p className="text-gray-400">Discuss with peers and find mentors from {collegeCode}.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DiscussionBoard
                        collegeId={collegeCode || ""}
                        collegeName={collegeName}
                    />
                </div>
                <div className="lg:col-span-1">
                    <MentorList collegeName={collegeName} />
                </div>
            </div>
        </div>
    );
};

export default CollegeCommunity;
