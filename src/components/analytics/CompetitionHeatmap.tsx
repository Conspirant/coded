import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp } from "lucide-react";

export const CompetitionHeatmap = () => {
    // Ideally this data comes from backend analytics of 'views' or 'searches'
    // For now, we'll mock it based on "general knowledge" or static popular branches
    // In a real app, we'd query the `admin_activities` or a new `analytics` table.

    const trendingBranches = [
        { name: "Computer Science", demand: "Very High", color: "bg-red-500", count: "98% Fill Rate" },
        { name: "ISE / IT", demand: "High", color: "bg-orange-500", count: "95% Fill Rate" },
        { name: "AI & ML", demand: "High", color: "bg-orange-400", count: "94% Fill Rate" },
        { name: "Electronics (ECE)", demand: "Medium", color: "bg-yellow-400", count: "85% Fill Rate" },
        { name: "Electrical (EEE)", demand: "Moderate", color: "bg-yellow-300", count: "70% Fill Rate" },
        { name: "Mechanical", demand: "Stable", color: "bg-green-400", count: "60% Fill Rate" },
        { name: "Civil", demand: "Low", color: "bg-blue-400", count: "45% Fill Rate" },
        { name: "Aerospace", demand: "Niche", color: "bg-purple-400", count: "High Competition" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Market Demand Heatmap
                </CardTitle>
                <CardDescription>
                    Current year's estimated seat filling capability
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {trendingBranches.map((branch) => (
                        <div
                            key={branch.name}
                            className="relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md group"
                        >
                            <div className={`absolute top-0 right-0 h-16 w-16 translate-x-8 -translate-y-8 rounded-full opacity-20 ${branch.color} blur-xl group-hover:opacity-40 transition-opacity`} />

                            <h4 className="font-semibold mb-1 relative z-10">{branch.name}</h4>
                            <div className="flex items-center justify-between relative z-10">
                                <Badge variant="secondary" className="text-xs">
                                    {branch.demand}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {branch.count}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
