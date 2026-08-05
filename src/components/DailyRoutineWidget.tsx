import React from "react";
import { Link } from "react-router-dom";
import { useEngagement } from "@/lib/engagement";
import { CheckCircle2, Circle, Flame, ArrowRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const DailyRoutineWidget: React.FC = () => {
  const { streak, todayTasks } = useEngagement();

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (todayTasks.length || 1)) * 100);
  const isAllDone = completedCount === todayTasks.length && todayTasks.length > 0;

  return (
    <div className="rounded-2xl glass border border-white/5 p-5 transition-all duration-300 hover:border-white/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base sm:text-lg tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Daily Counseling Routine
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              {streak} {streak === 1 ? "day" : "days"} active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete short daily checkpoints to stay prepared and avoid counseling oversights.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
          <div className="w-full sm:w-32">
            <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium text-foreground">{completedCount} of {todayTasks.length}</span>
            </div>
            <Progress value={progressPercent} className="h-1.5 bg-white/5" />
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {todayTasks.map((task) => (
          <Link
            key={task.id}
            to={task.actionUrl}
            className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
              task.completed
                ? "bg-white/2 border-white/5 text-muted-foreground opacity-75"
                : "bg-white/5 border-white/10 hover:border-indigo-500/30 hover:bg-white/8 text-foreground"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-xs font-medium line-clamp-2 leading-relaxed ${task.completed ? "line-through text-muted-foreground/80" : ""}`}>
                {task.label}
              </span>
            </div>
            {!task.completed && (
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
            )}
          </Link>
        ))}
      </div>

      {isAllDone && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-emerald-400 font-medium">✨ All checkpoints completed for today.</span>
          <span>Your preparation routine refreshes tomorrow at midnight.</span>
        </div>
      )}
    </div>
  );
};
