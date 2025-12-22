"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lesson, LessonStep } from "@/lib/types";
import { ExplainStep } from "@/components/steps/ExplainStep";
import { CodeStep } from "@/components/steps/CodeStep";
import { useProgress } from "@/lib/useProgress";
import { completeStep } from "@/lib/progressStore";

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const p = useProgress();

  const totalSteps = lesson.steps.length;

  const completedSteps = useMemo(() => {
    return lesson.steps.filter((s) => p.completedStepIds[s.id]).length;
  }, [lesson.steps, p.completedStepIds]);

  const pct = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  // === INI KUNCI LOGIKA ===
  // Lesson dianggap selesai jika semua step completed.
  const isLessonCompleted = totalSteps > 0 && completedSteps === totalSteps;

  // Resume learning: cari step pertama yang belum selesai
  const initialIdx = useMemo(() => {
    if (!lesson.steps.length) return 0;
    const firstIncomplete = lesson.steps.findIndex((s) => !p.completedStepIds[s.id]);
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  }, [lesson.steps, p.completedStepIds]);

  const [idx, setIdx] = useState(0);
  const [hasUserNavigated, setHasUserNavigated] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Sinkronisasi idx:
  // - Jika lesson sudah completed => paksa idx = 0 (Step 1) dan lock
  // - Jika belum completed => resume ke initialIdx, tapi hanya sebelum user mulai navigasi manual
  useEffect(() => {
    if (isLessonCompleted) {
      setIdx(0);
      return;
    }
    if (!hasUserNavigated) {
      setIdx(initialIdx);
    }
  }, [isLessonCompleted, initialIdx, hasUserNavigated]);

  const step = lesson.steps[idx];

  const isLastStep = idx >= totalSteps - 1;
  const isStepCompleted = step ? !!p.completedStepIds[step.id] : false;

  // Karena saat completed kita LOCK di Step 1, maka navigasi dimatikan
  const canBack = !isLessonCompleted && idx > 0;

  const header = useMemo(
    () => ({
      currentIndex: idx + 1,
      total: totalSteps,
      completedSteps,
      pct,
    }),
    [idx, totalSteps, completedSteps, pct]
  );

  useEffect(() => {
    if (!isFinishing) return;

    const t = setTimeout(() => {
      router.push("/learn");
    }, 1200);

    return () => clearTimeout(t);
  }, [isFinishing, router]);

  function finishLesson() {
    setIsFinishing(true);
  }

  function nextOrFinish() {
    // Jika lesson sudah 100%, tidak boleh pindah step sama sekali
    if (isLessonCompleted) return;

    setHasUserNavigated(true);

    if (isLastStep) {
      finishLesson();
      return;
    }
    setIdx((i) => Math.min(i + 1, totalSteps - 1));
  }

  function back() {
    if (isLessonCompleted) return;

    setHasUserNavigated(true);
    setIdx((i) => Math.max(i - 1, 0));
  }

  async function handleContinueExplain() {
    if (!step) return;

    // Jika lesson sudah completed => Step 1 hanya Completed dan tidak boleh lanjut
    if (isLessonCompleted) return;

    // Kalau step sudah completed, langsung next saja (jangan save XP lagi)
    if (isStepCompleted) {
      nextOrFinish();
      return;
    }

    try {
      setIsSaving(true);
      await completeStep(step.id, 2);
      nextOrFinish();
    } finally {
      setIsSaving(false);
    }
  }

  if (!step) {
    return (
      <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-gray-900">Lesson tidak memiliki step.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Finish Animation Overlay */}
      {isFinishing && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-white/70 backdrop-blur dark:bg-black/50"
          role="status"
          aria-live="polite"
        >
          <div className="finish-card w-[min(520px,92vw)] rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gray-900 dark:bg-white">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white dark:text-black"
                  aria-hidden="true"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="check-path"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  Lesson Completed
                </div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-zinc-100 truncate">
                  {lesson.title}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-zinc-300">
                  Great job. Returning to Course Map…
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-900/40">
                <div className="finish-bar h-2 rounded-full bg-gray-900 dark:bg-white" />
              </div>
            </div>
          </div>

          <style jsx>{`
            .finish-card {
              animation: popIn 240ms ease-out both;
            }
            @keyframes popIn {
              0% {
                opacity: 0;
                transform: translateY(10px) scale(0.985);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .check-path {
              stroke-dasharray: 60;
              stroke-dashoffset: 60;
              animation: draw 420ms ease-out 80ms forwards;
            }
            @keyframes draw {
              to {
                stroke-dashoffset: 0;
              }
            }
            .finish-bar {
              width: 0%;
              animation: fill 1000ms ease-out 120ms forwards;
            }
            @keyframes fill {
              to {
                width: 100%;
              }
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">Lesson</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-zinc-100">
          {lesson.title}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
          <span>
            Step{" "}
            <span className="font-semibold text-gray-900 dark:text-zinc-100">
              {header.currentIndex}
            </span>
            /{header.total}
          </span>

          <span>
            <span className="font-semibold text-gray-900 dark:text-zinc-100">
              {header.completedSteps}
            </span>
            /{header.total} completed • {header.pct}%
          </span>
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-900/40">
          <div
            className="h-2 rounded-full bg-gray-900 dark:bg-white"
            style={{ width: `${header.pct}%` }}
          />
        </div>
      </div>

      {/* Content */}
      {step.type === "explain" ? (
        <div className="space-y-4">
          <ExplainStep title={step.title} markdown={step.markdown} />

          {/* Footer buttons */}
          {isLessonCompleted ? (
            // === LOCK MODE: Step 1 hanya Completed ===
            <div className="flex items-center justify-end">
              <button
                disabled
                className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white opacity-80 cursor-not-allowed"
              >
                Completed
              </button>
            </div>
          ) : (
            // === NORMAL MODE ===
            <div className="flex items-center justify-end">
              <button
                onClick={handleContinueExplain}
                disabled={isSaving || isFinishing}
                className="focus-ring rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60 dark:bg-white dark:text-black"
              >
                {isSaving ? "Saving..." : isLastStep ? "Finish" : "Continue"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <CodeStep
          key={step.id}
          step={step as Extract<LessonStep, { type: "code" }>}
          onPassed={nextOrFinish}
          isCompleted={isStepCompleted}
          locked={isLessonCompleted}
          showBack={idx > 0 && !isLessonCompleted}
          onBack={back}
        />
      )}
    </div>
  );
}
