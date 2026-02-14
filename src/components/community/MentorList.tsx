import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Linkedin, CheckCircle2 } from "lucide-react";

interface MentorListProps {
    collegeName: string;
}

export const MentorList = ({ collegeName }: MentorListProps) => {
    // Mock data for mentorship program
    // In a real implementation, this would fetch from the 'mentors' table joined with 'users'
    const mentors = [
        {
            id: 1,
            name: "Aditya Kumar",
            branch: "Computer Science",
            year: "4th Year",
            company: "Placed at Google",
            linkedin: "#",
            verified: true
        },
        {
            id: 2,
            name: "Sneha R",
            branch: "Electronics (ECE)",
            year: "3rd Year",
            company: "Hardware Enthusiast",
            linkedin: "#",
            verified: true
        },
        {
            id: 3,
            name: "Rahul Singh",
            branch: "Mechanical",
            year: "Alumni (2023)",
            company: "Bosch",
            linkedin: "#",
            verified: true
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Connect with Seniors
                </CardTitle>
                <CardDescription>
                    Get guidance from verified seniors and alumni from {collegeName}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} />
                                    <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm">{mentor.name}</h4>
                                        {mentor.verified && (
                                            <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{mentor.branch}</span>
                                        <span>•</span>
                                        <span>{mentor.year}</span>
                                    </div>
                                    <Badge variant="secondary" className="mt-1 text-[10px]">
                                        {mentor.company}
                                    </Badge>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                                <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="h-4 w-4 text-blue-700" />
                                </a>
                            </Button>
                        </div>
                    ))}

                    <div className="pt-2">
                        <Button variant="outline" className="w-full text-xs">
                            View All Mentors
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
