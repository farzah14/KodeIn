"use client";

import Link from "next/link";
import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";
import { CheckCircle2, Lock, Play, Circle } from "lucide-react";

type NodeState = "completed" | "available" | "locked";

const stateConfig = {
  completed: {
    icon: <CheckCircle2 size={24} className="text-edu-success" />,
    border: "border-edu-success",
    bg: "bg-edu-success/10",
    badgeBg: "bg-edu-success/20",
    badgeText: "bg-edu-success/10 text-edu-success border-edu-success/30",
    textLabel: "Cleared",
    textClass: "text-edu-success",
  },
  available: {
    icon: <Play size={20} fill="currentColor" strokeWidth={0} className="text-edu-primary" />,
    border: "border-edu-primary ring-2 ring-edu-primary/20",
    bg: "bg-edu-primary/10",
    badgeBg: "bg-edu-primary/20",
    badgeText: "bg-edu-primary/10 text-edu-primary border-edu-primary/30",
    textLabel: "Available",
    textClass: "text-edu-primary",
  },
  locked: {
    icon: <Lock size={18} className="text-edu-textMuted" />,
    border: "border-edu-border",
    bg: "bg-edu-surface2",
    badgeBg: "bg-edu-border",
    badgeText: "bg-edu-surface2 text-edu-textMuted border-edu-border",
    textLabel: "Locked",
    textClass: "text-edu-textMuted",
  },
};

function LessonNode({
  lesson,
  state,
  completedSteps,
  totalSteps,
  pct,
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
      className={`group relative flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300 ${
        state === "available" ? "bg-edu-surface1 border-edu-primary hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)] cursor-pointer" : ""
      } ${
        state === "completed" ? "bg-edu-surface1 border-edu-success hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.1)] cursor-pointer" : ""
      } ${
        state === "locked" ? "bg-edu-bg border-edu-border opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {/* Icon Circle */}
      <div className={`flex shrink-0 items-center justify-center w-14 h-14 rounded-full border ${cfg.bg} ${cfg.border}`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center py-0.5 justify-between gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-bold text-edu-textPrimary truncate transition-colors group-hover:text-black">
            {lesson.title}
          </h3>
          <span className={`inline-flex shrink-0 px-2.5 py-0.5 rounded-full border text-xs font-bold uppercase tracking-wider ${cfg.badgeText}`}>
            {cfg.textLabel}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs font-semibold text-edu-textSecondary uppercase tracking-widest mb-3 transition-colors group-hover:text-black/80">
           <span>{completedSteps}/{totalSteps} Steps</span>
           <span>{pct}%</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-edu-surface2 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              state === "completed" ? "bg-edu-success" : "bg-edu-primary"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
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
    <div className="space-y-12 pb-20">
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
            className="bg-edu-surface1 border border-edu-border rounded-3xl p-6 sm:p-10"
          >
            {/* Unit Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-edu-border">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-edu-primary uppercase tracking-[0.1em]">
                    Unit {unit.order}
                  </span>
                  {unitDone && (
                    <span className="px-2 py-0.5 rounded bg-edu-success/10 text-edu-success text-xs font-bold uppercase tracking-wider">
                      Cleared
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-edu-textPrimary leading-tight">
                  {unit.title}
                </h2>
              </div>

              {/* Unit Progress Display */}
              <div className="flex flex-col w-full md:w-48 gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-edu-textSecondary uppercase tracking-widest">
                  <span>Progress</span>
                  <span className={unitDone ? "text-edu-success" : "text-edu-textPrimary"}>{unitPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-edu-surface2 overflow-hidden border border-edu-border">
                  <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${unitDone ? "bg-edu-success" : "bg-edu-primary"}`}
                    style={{ width: `${unitPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Lessons */}
            {lessons.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-edu-border bg-edu-surface2/50 p-12 text-center text-sm font-semibold text-edu-textMuted uppercase tracking-widest">
                Stages Coming Soon...
              </div>
            ) : (
              <div className="grid gap-6">
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
