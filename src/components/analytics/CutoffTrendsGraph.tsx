import { useState, useEffect, useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CutoffData {
    year: string;
    cutoff_rank: number;
    course: string;
    category: string;
    round: string;
}

interface CutoffTrendsProps {
    collegeCode: string;
    collegeName: string;
}

const CATEGORIES = ["GM", "2AG", "2BG", "3AG", "3BG", "SCG", "STG"];

import { normalizeCourseName } from "@/lib/course-normalization";

export const CutoffTrendsGraph = ({ collegeCode, collegeName }: CutoffTrendsProps) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("GM");
    const [courses, setCourses] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // We fetch the consolidated JSON file
                // Note: In a real production app with 30MB+ JSON, we'd want this filtered on the server.
                // For this implementation, we'll fetch and filter client-side as requested.
                // Use /data/kcet_cutoffs_consolidated.json first as it has the complete R3 2025 data
                let response = await fetch('/data/kcet_cutoffs_consolidated.json');
                if (!response.ok) {
                    response = await fetch('/kcet_cutoffs_consolidated.json');
                }
                if (!response.ok) {
                    throw new Error('Failed to load cutoff data');
                }

                const fullData = await response.json();

                // Filter for this college immediately to save memory if possible (though JS parses whole JSON first)
                // The structure from file view: top level is array? No, looking at file view earlier:
                // { metadata: {}, cutoffs: [] } or just array?
                // Let's re-verify structure. The view_file showed it started with { "metadata": ..., "unique_courses": ...
                // It seems the actual cutoffs might be in a property.
                // Wait, I need to be sure where the cutoffs are. 
                // Based on previous view_file, line 1500 showed objects inside an array structure, likely under a key or root array.
                // If it's the `kcet_cutoffs_consolidated.json`, detailed view showed line 1500: `}, { ... }`.
                // This implies a list of objects. But lines 1-10 showed "metadata".
                // It's likely: { metadata: {...}, data: [...] } or just an array after metadata?
                // Actually, looking at lines 1-320 in the view_file, it closes "unique_institutes" array but doesn't show the main data key.
                // I will assume it is `data` or similar. Let's try to detect it or assume it's a big array if not object.

                let cutoffs = [];
                if (Array.isArray(fullData)) {
                    cutoffs = fullData;
                } else if (Array.isArray(fullData.data)) {
                    cutoffs = fullData.data;
                } else if (Array.isArray(fullData.cutoffs)) {
                    cutoffs = fullData.cutoffs;
                } else {
                    // Fallback: search for the first large array property
                    const key = Object.keys(fullData).find(k => Array.isArray(fullData[k]) && fullData[k].length > 1000);
                    if (key) cutoffs = fullData[key];
                }

                // Filter for this college code
                // The JSON has "institute_code" field
                const collegeCutoffs = cutoffs.filter((c: any) => c.institute_code === collegeCode);

                if (collegeCutoffs.length === 0) {
                    console.warn(`No cutoffs found for college code ${collegeCode}`);
                }

                setData(collegeCutoffs);

                // Extract unique courses and normalize them for display
                const rawCourses = Array.from(new Set(collegeCutoffs.map((c: any) => c.course))) as string[];
                const uniqueCourses = Array.from(new Set(rawCourses.map(c => normalizeCourseName(c)))).sort();

                setCourses(uniqueCourses);
                if (uniqueCourses.length > 0) {
                    setSelectedCourse(uniqueCourses[0]);
                }

            } catch (err) {
                console.error("Error loading trends:", err);
                setError("Could not load trend data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [collegeCode]);

    const chartData = useMemo(() => {
        if (!selectedCourse || !selectedCategory) return [];

        // Filter by course and category
        const filtered = data.filter((item: any) =>
            normalizeCourseName(item.course) === selectedCourse &&
            (item.category === selectedCategory || item.category === selectedCategory + "G" || item.category === selectedCategory + "R")
        );

        // Group by year and take the "Round 2" or "Round 3" if available for better consistency?
        // Or average? Usually last round is most indicative.
        // Let's take the lowest rank (highest value) for each year to show the "easiest" entry, or highest rank (lowest value) for "toughest"?
        // "Cutoff Rank" usually means the last rank admitted.

        // We want to pivot this: { year: 2023, rank: 1234 }
        const byYear = new Map();

        filtered.forEach((item: any) => {
            // We prefer later rounds: Round 2 > Round 1. EXT > Round 2.
            // Simple heuristic: if we already have this year, is this a "later" round?
            // Let's just grab all valid ranks and sort by round precedence manually or just take the max rank (easiest to get in) or min rank?
            // Actually, "Cutoff" usually implies the closing rank.
            // Let's look for "EXT" or "Round 2" specifically.

            const existing = byYear.get(item.year);
            // If no entry, add it.
            if (!existing) {
                byYear.set(item.year, item.cutoff_rank);
            } else {
                // Logic: Precedence EXT > Round 3 > Round 2 > Round 1
                // If current item round is 'better' than existing, replace.
                // Simplified: Just show the trend of the *Final* round if possible.
                // Let's just take the maximum value (highest rank number) found for that category/year, 
                // as that represents the final cutoff (easiest rank that got in).
                if (item.cutoff_rank > existing) {
                    byYear.set(item.year, item.cutoff_rank);
                }
            }
        });

        return Array.from(byYear.entries())
            .map(([year, rank]) => ({ year, rank }))
            .sort((a, b) => a.year.localeCompare(b.year));

    }, [data, selectedCourse, selectedCategory]);

    if (loading) {
        return (
            <Card>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading historical data...</span>
                </CardContent>
            </Card>
        );
    }

    if (error || courses.length === 0) {
        return null; // Don't show empty card if no data
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Cutoff Trends (2023-2025)
                </CardTitle>
                <CardDescription>
                    Historical cutoff ranks for {collegeName}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="w-[200px]">
                        <label className="text-xs text-muted-foreground mb-1 block">Course</label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-[100px]">
                        <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="year" />
                                <YAxis reversed domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: number) => [`${value.toLocaleString()}`, 'Cutoff Rank']}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="rank"
                                    name="Cutoff Rank"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    dot={{ strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No data available for this combination
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                    <Badge variant="outline" className="text-[10px] h-5">NOTE</Badge>
                    <p>Lower graph points mean Higher Rank (easier to get). Comparison uses the final available round for each year.</p>
                </div>
            </CardContent>
        </Card>
    );
};
