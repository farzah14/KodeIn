"use client";

import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";
import { getLevelInfo } from "@/components/XPBar";
import { BookOpen, Flame, Zap, Trophy } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { useSession } from "next-auth/react";

export function CourseProgressHeader() {
  const p = useProgress();
  const { data: session } = useSession();

  const lessonIds = content.course.unitIds.flatMap((uid) => content.units[uid].lessonIds);
  const lessons = lessonIds.map((lid) => content.lessons[lid]).filter(Boolean);

  const totalSteps = lessons.reduce((acc, l) => acc + l.steps.length, 0);
  const completedSteps = lessons.reduce(
    (acc, l) => acc + l.steps.filter((s) => p.completedStepIds[s.id]).length,
    0
  );

  const pct = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);
  const done = totalSteps > 0 && completedSteps === totalSteps;
  const lvl = getLevelInfo(p.xp);

  const userSeed = (session?.user?.image?.trim() || session?.user?.email?.trim() || session?.user?.name?.trim() || "anonymous") as string;

  return (
    <div className="bg-edu-surface1 border border-edu-border rounded-xl p-6 sm:p-8">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
           <div className="shrink-0 relative">
             <UserAvatar src={userSeed} size={64} className="rounded-full sm:w-[80px] sm:h-[80px]" />
           </div>
           <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-edu-primary mb-2">
                <BookOpen size={14} /> Current Quest
              </div>

              <h1 className="text-xl sm:text-3xl font-bold text-edu-textPrimary leading-tight">
                {content.course.title}
              </h1>

              <div className="mt-2 text-sm text-edu-textSecondary flex items-center gap-2">
                {completedSteps}/{totalSteps} steps completed
                {done && (
                  <span className="inline-flex items-center gap-1 text-edu-success font-semibold px-2 py-0.5 rounded-md bg-edu-success/10 text-xs uppercase">
                    Cleared!
                  </span>
                )}
              </div>
           </div>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-row w-full sm:w-auto gap-4">
          <div className="flex items-center gap-3 sm:gap-4 bg-edu-surface2 border border-edu-border rounded-xl p-3 sm:p-4 flex-1 sm:flex-none">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-edu-textSecondary/10 text-edu-textPrimary">
              <Zap size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div>
               <div className="text-xl font-bold text-edu-textPrimary leading-none mb-1">{p.xp}</div>
               <div className="text-xs font-semibold text-edu-textSecondary tracking-widest uppercase">XP</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 bg-edu-surface2 border border-edu-border rounded-xl p-3 sm:p-4 flex-1 sm:flex-none">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-edu-textSecondary/10 text-edu-textPrimary">
              <Flame size={16} className={p.streak.current > 0 ? "text-edu-streak sm:w-5 sm:h-5" : "text-edu-textMuted sm:w-5 sm:h-5"} />
            </div>
            <div>
               <div className="text-xl font-bold text-edu-textPrimary leading-none mb-1">{p.streak.current}</div>
               <div className="text-xs font-semibold text-edu-textSecondary tracking-widest uppercase">Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-edu-textSecondary tracking-widest uppercase mb-2 sm:mb-3">
          <span>Total Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 sm:h-3 w-full bg-edu-surface2 rounded-full overflow-hidden border border-edu-border">
          <div
            className="h-full bg-edu-primary transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
