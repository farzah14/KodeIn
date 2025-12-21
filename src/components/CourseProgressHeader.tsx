"use client";

import { content } from "@/lib/content";
import { useProgress } from "@/lib/useProgress";

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

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">Course</div>

          <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-zinc-100">
            {content.course.title}
          </div>

          <div className="mt-1 text-sm text-gray-600 dark:text-zinc-300">
            <span className="font-semibold text-gray-900 dark:text-zinc-100">
              {completedSteps}
            </span>
            /{totalSteps} steps •{" "}
            <span className="font-semibold text-gray-900 dark:text-zinc-100">{pct}%</span>
            {done ? (
              <span className="ml-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
                Completed
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="text-xs text-gray-500 dark:text-zinc-400">Progress</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{pct}%</div>
        </div>
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-900">
        <div
          className="h-2 rounded-full bg-gray-900 dark:bg-white"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
