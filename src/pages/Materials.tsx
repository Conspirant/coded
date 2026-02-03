import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, GraduationCap, AlertCircle, ExternalLink } from "lucide-react";

const Materials = () => {
    const cutoffs = [
        { year: "2025", rounds: ["Round 1", "Round 2", "Round 3"], mock: "Mock Round 1" },
        { year: "2024", rounds: ["Round 1", "Round 2", "Round 3 (Extended)"], mock: "Mock Round 1" },
        { year: "2023", rounds: ["Round 1", "Round 2", "Round 3 (Extended)"], mock: null },
    ];

    const resources = [
        {
            title: "Previous Year Cutoffs",
            description: "Official cutoff ranks for Engineering, Medical, and other courses.",
            icon: <FileText className="h-6 w-6 text-blue-500" />,
            items: cutoffs.map((data) => ({
                label: `KCET ${data.year} Cutoffs`,
                links: [
                    data.mock && { name: "Mock", url: `/cutoffs/kcet-${data.year}-mock-round1-cutoffs.pdf` },
                    ...data.rounds.map((round, i) => ({
                        name: round,
                        url: `/cutoffs/kcet-${data.year}-round${round.includes("Extended") ? "3(extended)" : i + 1}-cutoffs.pdf`
                    }))
                ].filter(Boolean)
            }))
        },
        {
            title: "Study Material",
            description: "Handpicked notes and resources.",
            icon: <BookOpen className="h-6 w-6 text-green-500" />,
            items: [
                {
                    label: "Physics Formula Sheet",
                    links: [{ name: "Download PDF", url: "#" }]
                },
                {
                    label: "Maths Short Notes",
                    links: [{ name: "Download PDF", url: "#" }]
                }
            ]
        }
    ];

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Materials & Resources</h1>
                <p className="text-muted-foreground">
                    Everything you need for your KCET preparation in one place.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((section, idx) => (
                    <Card key={idx} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-secondary/50 rounded-lg">
                                    {section.icon}
                                </div>
                                <CardTitle className="text-xl">{section.title}</CardTitle>
                            </div>
                            <CardDescription>{section.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="p-4 rounded-lg bg-secondary/20 border border-secondary/40 space-y-3">
                                    <div className="font-medium text-sm flex items-center gap-2">
                                        {item.label}
                                        {item.label.includes("2026") && <Badge variant="secondary" className="text-[10px] h-5">New</Badge>}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.links.map((link: any, linkIdx: number) => (
                                            <Button
                                                key={linkIdx}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs gap-1.5"
                                                asChild
                                            >
                                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                    {link.url.startsWith("http") ? <ExternalLink className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                                                    {link.name}
                                                </a>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-semibold mb-1">Disclaimer</p>
                    <p>These documents are sourced from the official KEA website for educational purposes. Always verify with the official website for the latest updates.</p>
                </div>
            </div>
        </div>
    );
};

export default Materials;
