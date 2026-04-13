"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Code2 } from "lucide-react";
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
    }, 1500);

    return () => clearTimeout(t);
  }, [isFinishing, router]);

  function finishLesson() {
    setIsFinishing(true);
  }

  function nextOrFinish() {
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
    if (isLessonCompleted) return;

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
      <div className="rounded-xl border border-edu-border bg-edu-surface1 p-6 w-full max-w-5xl mx-auto mt-6">
        <div className="text-sm font-semibold text-edu-textPrimary">Lesson does not have any steps.</div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      {/* Level Clear Overlay */}
      {isFinishing && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-edu-bg/95">
          <div className="anim-slide-up flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-edu-success/10 text-edu-success mb-6">
              <Check size={40} strokeWidth={3} />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-edu-success mb-2">Lesson Completed</div>
            <h2 className="text-3xl font-bold text-white mb-8">{lesson.title}</h2>
            
            <div className="w-64 max-w-full">
              <div className="h-2 w-full rounded-full bg-edu-surface2 overflow-hidden">
                <div className="finish-bar h-full bg-edu-success rounded-full" />
              </div>
              <div className="mt-3 text-center text-xs font-medium text-edu-textSecondary">Returning to map...</div>
            </div>
          </div>
          <style jsx>{`
            .anim-slide-up { animation: slideUp 0.4s ease-out both; }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .finish-bar { width: 0%; animation: fill 1200ms ease-out forwards; }
            @keyframes fill { to { width: 100%; } }
          `}</style>
        </div>
      )}

      {/* Lesson Progress Header */}
      <div className="w-full max-w-5xl mx-auto bg-edu-surface1 border border-edu-border rounded-xl p-6 md:p-8 mt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex-1">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-edu-primary mb-2">
                <Code2 size={16} /> Current Lesson
             </div>
             <h1 className="text-2xl md:text-3xl font-bold text-edu-textPrimary leading-tight">
               {lesson.title}
             </h1>
          </div>

          <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3 min-w-[200px]">
             <div className="flex items-center justify-between w-full">
                <div className="text-xs font-semibold text-edu-textSecondary uppercase tracking-widest">Progress</div>
                <div className="text-sm font-bold text-edu-textPrimary">{header.pct}%</div>
             </div>
             <div className="h-2.5 w-full rounded-full bg-edu-surface2 border border-edu-border overflow-hidden">
                <div 
                  className="h-full bg-edu-xp transition-all duration-500 rounded-full"
                  style={{ width: `${header.pct}%` }}
                />
             </div>
             <div className="text-xs text-edu-textMuted font-medium w-full text-right">
               Step {header.currentIndex} of {header.total}
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative mt-6">
        {step.type === "explain" ? (
          <div className="space-y-6">
            <ExplainStep title={step.title} markdown={step.markdown} />

            <div className="flex items-center justify-end w-full max-w-5xl mx-auto">
              {isLessonCompleted ? (
                <div className="px-6 py-3 rounded-lg bg-edu-success/10 border border-edu-success/30 text-edu-success font-semibold text-sm">
                  Lesson Cleared
                </div>
              ) : (
                <button
                  onClick={handleContinueExplain}
                  disabled={isSaving || isFinishing}
                  className="px-8 py-3 rounded-lg bg-edu-primary text-white font-semibold hover:bg-edu-primaryHover focus:ring-2 focus:ring-offset-2 focus:ring-offset-edu-bg focus:ring-edu-primary transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : isLastStep ? "Finish Lesson" : "Continue"}
                </button>
              )}
            </div>
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
    </div>
  );
}
