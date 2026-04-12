"use client";

import Link from "next/link";
import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";
import { CheckCircle2, Lock, Play, ChevronRight } from "lucide-react";

type NodeState = "completed" | "available" | "locked";

const stateConfig = {
  completed: {
    icon: <CheckCircle2 size={20} />,
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25",
    cardBorder: "border-green-200 dark:border-green-900/40",
    cardBg: "bg-green-50/50 dark:bg-green-900/5",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    badgeText: "Selesai",
  },
  available: {
    icon: <Play size={18} fill="currentColor" />,
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 animate-pulse",
    cardBorder: "border-indigo-200 dark:border-indigo-900/40",
    cardBg: "bg-white dark:bg-zinc-950",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    badgeText: "Mulai",
  },
  locked: {
    icon: <Lock size={16} />,
    iconBg: "bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600",
    cardBorder: "border-gray-100 dark:border-zinc-800/50",
    cardBg: "bg-gray-50/50 dark:bg-zinc-900/20",
    badge: "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600",
    badgeText: "Terkunci",
  },
};

function LessonNode({
  lesson,
  state,
  completedSteps,
  totalSteps,
  pct,
  index,
}: {
  lesson: { id: string; title: string };
  state: NodeState;
  completedSteps: number;
  totalSteps: number;
  pct: number;
  index: number;
}) {
  const cfg = stateConfig[state];

  const card = (
    <div
      className={`group relative flex items-center gap-3 sm:gap-4 rounded-2xl border p-3 sm:p-4 transition-all duration-200 ${cfg.cardBorder} ${cfg.cardBg} ${
        state === "available" ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : ""
      } ${state === "completed" ? "hover:shadow-md cursor-pointer" : ""} ${
        state === "locked" ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {/* Icon */}
      <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">{lesson.title}</span>
          <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
            {cfg.badgeText}
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-zinc-400">
          {completedSteps}/{totalSteps} langkah
        </div>
        {/* Mini progress */}
        <div className="mt-1.5 sm:mt-2 h-1 w-full rounded-full bg-gray-100 dark:bg-zinc-800">
          <div
            className={`h-1 rounded-full transition-all duration-700 ${
              state === "completed"
                ? "bg-green-500"
                : state === "available"
                ? "bg-indigo-500"
                : "bg-gray-300 dark:bg-zinc-700"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Arrow */}
      {state !== "locked" && (
        <ChevronRight
          size={20}
          className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500 dark:text-zinc-700 dark:group-hover:text-zinc-400"
        />
      )}
    </div>
  );

  if (state === "locked") return <div>{card}</div>;
  return <Link href={`/learn/${lesson.id}`}>{card}</Link>;
}

export function PathMap() {
  const p = useProgress();

  const units = content.course.unitIds
    .map((id) => content.units[id])
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {units.map((unit) => {
        const lessons = unit.lessonIds
          .map((lid) => content.lessons[lid])
          .sort((a, b) => a.order - b.order);

        const unitTotalSteps = lessons.reduce((acc, l) => acc + l.steps.length, 0);
        const unitCompletedSteps = lessons.reduce(
          (acc, l) => acc + l.steps.filter((s) => p.completedStepIds[s.id]).length,
          0
        );
        const unitPct =
          unitTotalSteps === 0 ? 0 : Math.round((unitCompletedSteps / unitTotalSteps) * 100);
        const unitDone = unitTotalSteps > 0 && unitCompletedSteps === unitTotalSteps;

        return (
          <section
            key={unit.id}
            className="rounded-[24px] sm:rounded-[28px] border border-gray-200 bg-white p-4 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Unit Header */}
            <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                    Unit {unit.order}
                  </span>
                  {unitDone && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      ✓ Tuntas
                    </span>
                  )}
                </div>
                <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {unit.title}
                </h2>
              </div>

              {/* Unit Progress Ring */}
              <div className="shrink-0">
                <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                  <svg className="h-12 w-12 sm:h-14 sm:w-14 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-gray-100 dark:text-zinc-800"
                    />
                    <path
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${unitPct}, 100`}
                      strokeLinecap="round"
                      className={unitDone ? "text-green-500" : "text-indigo-500"}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-black text-gray-900 dark:text-white">
                    {unitPct}%
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons */}
            {lessons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-500">
                Materi segera hadir...
              </div>
            ) : (
              <div className="grid gap-2.5 sm:gap-3">
                {lessons.map((lesson, idx) => {
                  const totalSteps = lesson.steps.length;
                  const completedSteps = lesson.steps.filter((s) => p.completedStepIds[s.id]).length;
                  const done = completedSteps === totalSteps;

                  const prev = lessons[idx - 1];
                  const prevDone = !prev
                    ? true
                    : prev.steps.every((s) => p.completedStepIds[s.id]);

                  const state: NodeState = done ? "completed" : prevDone ? "available" : "locked";

                  const pct =
                    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

                  return (
                    <LessonNode
                      key={lesson.id}
                      lesson={lesson}
                      state={state}
                      completedSteps={completedSteps}
                      totalSteps={totalSteps}
                      pct={pct}
                      index={idx}
                    />
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
