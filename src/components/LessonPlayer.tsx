"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Code2 } from "lucide-react";
import { Lesson, LessonStep } from "@/lib/types";
import { ExplainStep } from "@/components/steps/ExplainStep";
import { CodeStep } from "@/components/steps/CodeStep";
import { useProgress } from "@/lib/useProgress";
import { completeStep } from "@/lib/progressStore";
import { content } from "@/lib/content";

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

  // === NEXT LESSON LOGIC ===
  const nextLessonId = useMemo(() => {
    // Collect all lesson IDs in order
    const allLessonIds: string[] = [];
    content.course.unitIds.forEach(uId => {
      content.units[uId].lessonIds.forEach(lId => {
        allLessonIds.push(lId);
      });
    });

    const currentPos = allLessonIds.indexOf(lesson.id);
    if (currentPos !== -1 && currentPos < allLessonIds.length - 1) {
      return allLessonIds[currentPos + 1];
    }
    return null;
  }, [lesson.id]);

  const handleNextLesson = () => {
    if (nextLessonId) {
      router.push(`/learn/${nextLessonId}`);
      setIdx(0);
      setHasUserNavigated(false);
      setIsFinishing(false);
    } else {
      router.push("/learn");
    }
  };

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
            
            <div className="mt-3 text-center text-xs font-medium text-edu-textSecondary italic opacity-60">Lesson mastery complete!</div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push("/learn")}
                className="px-8 py-3 rounded-2xl border border-white/20 text-white/60 font-black text-sm hover:bg-white/5 transition-all"
              >
                BACK TO MAP
              </button>
              {nextLessonId ? (
                <button 
                  onClick={handleNextLesson}
                  className="px-12 py-3 rounded-2xl bg-white text-black font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  NEXT LESSON
                </button>
              ) : (
                <button 
                  onClick={() => router.push("/learn")}
                  className="px-12 py-3 rounded-2xl bg-indigo-500 text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  FINISH COURSE
                </button>
              )}
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
      <div className="w-full max-w-5xl mx-auto bg-white/50 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 md:p-10 shadow-sm mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="flex-1">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3">
                <Code2 size={16} /> Current Lesson
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
               {lesson.title}
             </h1>
          </div>

          <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3 min-w-[240px]">
             <div className="flex items-center justify-between w-full">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mastery Progress</div>
                <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">{header.pct}%</div>
             </div>
             <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  style={{ width: `${header.pct}%` }}
                />
             </div>
             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider w-full text-right">
               Step {header.currentIndex} <span className="opacity-30">/</span> {header.total}
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
                <div className="flex items-center gap-4">
                  <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-black text-xs uppercase tracking-widest hidden sm:block">
                    Lesson Cleared
                  </div>
                  <button
                    onClick={handleNextLesson}
                    className="px-10 py-4 rounded-2xl bg-emerald-500 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    {nextLessonId ? "NEXT LESSON" : "BACK TO MAP"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleContinueExplain}
                  disabled={isSaving || isFinishing}
                  className="px-12 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm tracking-wide shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? "SAVING..." : isLastStep ? "FINISH LESSON" : "CONTINUE MISSION"}
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
