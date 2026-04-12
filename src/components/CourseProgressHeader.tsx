"use client";

import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";
import { getLevelInfo } from "@/components/XPBar";
import { BookOpen, Flame, Zap, Trophy } from "lucide-react";

export function CourseProgressHeader() {
  const p = useProgress();

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

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Subtle background glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 blur-3xl dark:from-indigo-500/5 dark:to-cyan-500/5"></div>

      <div className="relative z-10">
        {/* Top Row */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
              <BookOpen size={14} />
              Kursus Aktif
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {content.course.title}
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              {completedSteps} dari {totalSteps} langkah diselesaikan
              {done && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Trophy size={12} /> Selesai!
                </span>
              )}
            </p>
          </div>

          {/* Stats Pills */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Zap size={16} className="text-amber-500 mb-1" />
              <div className="text-lg font-black text-gray-900 dark:text-white">{p.xp}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">XP</div>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Flame size={16} className={`mb-1 ${p.streak.current > 0 ? "text-orange-500" : "text-gray-300"}`} />
              <div className="text-lg font-black text-gray-900 dark:text-white">{p.streak.current}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Streak</div>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-indigo-100 bg-indigo-50/50 px-5 py-3 dark:border-indigo-900/30 dark:bg-indigo-900/10">
              <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500 text-[10px] font-black text-white">{lvl.level}</div>
              <div className="text-lg font-black text-gray-900 dark:text-white">{lvl.title.split(" ")[0]}</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold">Level</div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500">PROGRESS KESELURUHAN</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">{pct}%</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-900">
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
