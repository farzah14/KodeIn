import { useState, useEffect } from "react";
import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";
import { getLevelInfo } from "@/components/XPBar";
import { BookOpen, Flame, Zap, Trophy } from "lucide-react";
import { Avatar3D } from "@/components/Avatar3D";
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
    <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-gray-200 bg-white p-5 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Subtle background glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 blur-3xl dark:from-indigo-500/5 dark:to-cyan-500/5"></div>

      <div className="relative z-10">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="shrink-0">
               <Avatar3D seed={userSeed} size={84} className="h-20 w-20 sm:h-24 sm:w-24 shadow-xl border-4 border-white dark:border-zinc-900" />
             </div>
             <div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                  <BookOpen size={14} />
                  Kursus Aktif
                </div>

                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {content.course.title}
                </h1>

                <p className="mt-1 text-[12px] sm:text-sm text-gray-500 dark:text-zinc-400">
                  {completedSteps} dari {totalSteps} langkah
                  {done && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <Trophy size={11} /> Selesai!
                    </span>
                  )}
                </p>
             </div>
          </div>

          {/* Stats Pills - Hidden on very small screens or rearranged */}
          <div className="flex w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 gap-2 sm:gap-3 no-scrollbar">
            <div className="flex flex-1 sm:flex-none flex-col items-center justify-center min-w-[70px] rounded-2xl border border-gray-100 bg-gray-50 px-3 sm:px-5 py-2 sm:py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Zap size={14} className="text-amber-500 mb-1" />
              <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-none">{p.xp}</div>
              <div className="mt-1 text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">XP</div>
            </div>
            <div className="flex flex-1 sm:flex-none flex-col items-center justify-center min-w-[70px] rounded-2xl border border-gray-100 bg-gray-50 px-3 sm:px-5 py-2 sm:py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Flame size={14} className={`mb-1 ${p.streak.current > 0 ? "text-orange-500" : "text-gray-300"}`} />
              <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-none">{p.streak.current}</div>
              <div className="mt-1 text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">Streak</div>
            </div>
            <div className="flex flex-1 sm:flex-none flex-col items-center justify-center min-w-[70px] rounded-2xl border border-indigo-100 bg-indigo-50/50 px-3 sm:px-5 py-2 sm:py-3 dark:border-indigo-900/30 dark:bg-indigo-900/10">
              <div className="mb-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-md bg-indigo-500 text-[8px] sm:text-[10px] font-black text-white">{lvl.level}</div>
              <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-none">{lvl.title.split(" ")[0]}</div>
              <div className="mt-1 text-[8px] sm:text-[10px] uppercase tracking-wider text-indigo-500 font-bold leading-none">Level</div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">PROGRESS KESELURUHAN</span>
            <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{pct}%</span>
          </div>
          <div className="relative h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-900">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-1000 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
