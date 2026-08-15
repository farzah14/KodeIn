"use client";

import Link from "next/link";
import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";
import { Lock, Play, GraduationCap, Trophy } from "lucide-react";

type NodeState = "completed" | "available" | "locked";

const stateConfig = {
  completed: {
    icon: <Trophy size={20} className="text-emerald-500" />,
    border: "border-emerald-200 dark:border-emerald-800/50",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50",
    label: "Mastered",
    progressBg: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
  },
  available: {
    icon: <Play size={18} fill="currentColor" strokeWidth={0} className="text-indigo-600" />,
    border: "border-indigo-200 dark:border-indigo-800/50 ring-4 ring-indigo-50 dark:ring-indigo-900/10",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200/50",
    label: "Current",
    progressBg: "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]",
  },
  locked: {
    icon: <Lock size={16} className="text-gray-400" />,
    border: "border-gray-100 dark:border-zinc-800",
    bg: "bg-gray-50/50 dark:bg-zinc-900/30",
    badge: "bg-gray-100 text-gray-500 dark:bg-zinc-800/50 dark:text-zinc-500 border-gray-200/50",
    label: "Locked",
    progressBg: "bg-gray-200 dark:bg-zinc-800",
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
}) {
  const cfg = stateConfig[state];

  const card = (
    <div
      className={`group relative flex items-center gap-5 p-6 rounded-[2rem] border transition-all duration-500 ${
        state !== "locked" 
          ? "bg-white dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-900 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer" 
          : "bg-gray-50/40 dark:bg-zinc-900/20 border-dashed opacity-60 cursor-not-allowed"
      } ${cfg.border} overflow-hidden`}
    >
      {/* State Indicator Bar */}
      {state !== 'locked' && (
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${state === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
      )}

      {/* Icon Circle */}
      <div className={`flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl border transition-transform duration-500 group-hover:scale-110 ${cfg.bg} ${cfg.border}`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {lesson.title}
          </h3>
          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] shrink-0 ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
           <span className="flex items-center gap-1.5">
             <div className={`w-1 h-1 rounded-full ${state === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
             {completedSteps} / {totalSteps} Tasks
           </span>
           <span className={state === 'completed' ? 'text-emerald-500' : state === 'available' ? 'text-indigo-600' : ''}>
             {pct}% Complete
           </span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ease-out rounded-full ${cfg.progressBg}`}
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
    <div className="space-y-20 pb-20 max-w-5xl mx-auto">
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
            className="group/unit relative"
          >
            {/* Unit Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 px-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                      <GraduationCap size={20} />
                   </div>
                   <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                     Unit 0{unit.order}
                   </span>
                </div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                  {unit.title}
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>

              {/* Unit Progress Card */}
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-100 dark:border-zinc-800 p-5 rounded-3xl min-w-[240px] shadow-sm">
                <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  <span>Unit Completion</span>
                  <span className={unitDone ? "text-emerald-500" : "text-indigo-600"}>{unitPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${unitDone ? "bg-emerald-500" : "bg-indigo-600"}`}
                    style={{ width: `${unitPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid gap-6 px-4">
              {lessons.length === 0 ? (
                <div className="rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/20 p-16 text-center">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Curriculum Pending...</span>
                </div>
              ) : (
                lessons.map((lesson, idx) => {
                  const totalSteps = lesson.steps.length;
                  const completedSteps = lesson.steps.filter((s) => p.completedStepIds[s.id]).length;
                  const done = completedSteps === totalSteps;

                  const prev = lessons[idx - 1];
                  const prevDone = !prev ? true : prev.steps.every((s) => p.completedStepIds[s.id]);
                  const state: NodeState = done ? "completed" : prevDone ? "available" : "locked";
                  const pct = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

                  return (
                    <LessonNode
                      key={lesson.id}
                      lesson={lesson}
                      state={state}
                      completedSteps={completedSteps}
                      totalSteps={totalSteps}
                      pct={pct}
                    />
                  );
                })
              )}
            </div>
            
            {/* Decorative background number */}
            <div className="absolute -top-12 -left-12 text-[12rem] font-black text-gray-100 dark:text-zinc-900/20 -z-10 select-none pointer-events-none">
              {unit.order}
            </div>
          </section>
        );
      })}
    </div>
  );
}
