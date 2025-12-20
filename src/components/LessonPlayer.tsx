"use client";

import { useMemo, useState } from "react";
import { Lesson, LessonStep } from "@/lib/types";
import { ExplainStep } from "@/components/steps/ExplainStep";
import { CodeStep } from "@/components/steps/CodeStep";
import { markStepCompleted } from "@/lib/storage";
import { useProgress } from "@/lib/useProgress";

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [idx, setIdx] = useState(0);
  const step = lesson.steps[idx];

  // baca progress global (localStorage) agar header persentase akurat
  const p = useProgress();

  const totalSteps = lesson.steps.length;
  const completedSteps = lesson.steps.filter((s) => p.completedStepIds[s.id]).length;

  // persentase berdasarkan completion, bukan posisi step
  const pct = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  const canBack = idx > 0;

  const header = useMemo(
    () => ({
      currentIndex: idx + 1,
      total: totalSteps,
      completedSteps,
      pct,
    }),
    [idx, totalSteps, completedSteps, pct]
  );

  function next() {
    setIdx((i) => Math.min(i + 1, lesson.steps.length - 1));
  }

  function back() {
    setIdx((i) => Math.max(i - 1, 0));
  }

  function completeExplainAndNext() {
    // tandai step explain selesai (XP kecil)
    markStepCompleted(step.id, 2);
    next();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-medium text-gray-500">Lesson</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{lesson.title}</div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Step{" "}
            <span className="font-semibold text-gray-900">{header.currentIndex}</span>/
            {header.total}
          </span>

          <span>
            <span className="font-semibold text-gray-900">{header.completedSteps}</span>/
            {header.total} completed • {header.pct}%
          </span>
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-gray-900" style={{ width: `${header.pct}%` }} />
        </div>
      </div>

      {step.type === "explain" ? (
        <div className="space-y-4">
          <ExplainStep title={step.title} markdown={step.markdown} />

          <div className="flex items-center justify-between">
            <button
              onClick={back}
              disabled={!canBack}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60"
            >
              Back
            </button>

            <button
              onClick={completeExplainAndNext}
              className="focus-ring rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <CodeStep
          step={step as Extract<LessonStep, { type: "code" }>}
          onPassed={next}
        />
      )}
    </div>
  );
}
