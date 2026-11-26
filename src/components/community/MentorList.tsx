import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Linkedin, CheckCircle2, Calendar, ShieldCheck } from "lucide-react";
import {
  CounsellorApplication,
  CounsellorRecruitmentService,
  LEVEL_META,
} from "@/lib/counsellor-recruitment-service";

interface MentorListProps {
  collegeName: string;
}

const FALLBACK_MENTORS = [
  {
    id: "sample-1",
    full_name: "Aditya Kumar",
    branch: "Computer Science",
    current_status: "4th Year",
    highlight_badge: "Placed at Google",
    linkedin_url: "#",
    booking_url: null,
    verification_level: 2 as const,
  },
  {
    id: "sample-2",
    full_name: "Sneha R",
    branch: "Electronics (ECE)",
    current_status: "3rd Year",
    highlight_badge: "Hardware Enthusiast",
    linkedin_url: "#",
    booking_url: null,
    verification_level: 1 as const,
  },
  {
    id: "sample-3",
    full_name: "Rahul Singh",
    branch: "Mechanical",
    current_status: "Alumni (2023)",
    highlight_badge: "Bosch",
    linkedin_url: "#",
    booking_url: null,
    verification_level: 2 as const,
  },
];

export const MentorList = ({ collegeName }: MentorListProps) => {
  const [mentors, setMentors] = useState<
    Array<Pick<
      CounsellorApplication,
      | "id"
      | "full_name"
      | "branch"
      | "current_status"
      | "highlight_badge"
      | "linkedin_url"
      | "booking_url"
      | "verification_level"
    >>
  >(FALLBACK_MENTORS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    CounsellorRecruitmentService.getActiveCounsellors(collegeName).then((rows) => {
      if (!mounted) return;
      if (rows.length > 0) {
        setMentors(rows);
        setIsLive(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [collegeName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Connect with Seniors
        </CardTitle>
        <CardDescription>
          {isLive
            ? `Verified seniors & 1-on-1 counsellors from ${collegeName}`
            : `Get guidance from verified seniors and alumni from ${collegeName}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      mentor.full_name
                    )}`}
                  />
                  <AvatarFallback>{mentor.full_name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm">{mentor.full_name}</h4>
                    {mentor.verification_level >= 2 ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      {LEVEL_META[mentor.verification_level]?.shortLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{mentor.branch}</span>
                    <span>•</span>
                    <span>{mentor.current_status}</span>
                  </div>
                  {mentor.highlight_badge && (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      {mentor.highlight_badge}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {mentor.verification_level >= 2 && mentor.booking_url && (
                  <Button size="sm" variant="default" className="h-8 px-2.5 text-xs" asChild>
                    <a href={mentor.booking_url} target="_blank" rel="noopener noreferrer">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      1-on-1
                    </a>
                  </Button>
                )}
                {mentor.linkedin_url && (
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                    <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="pt-2 flex gap-2">
            <Button variant="outline" className="w-full text-xs" asChild>
              <Link to="/counsellor-apply">Apply as a 1-on-1 Counsellor</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
