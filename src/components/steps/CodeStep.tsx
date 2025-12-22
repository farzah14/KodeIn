"use client";

import { useMemo, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { mockPythonRunner } from "@/lib/runner/mockPythonRunner";
import { LessonStep } from "@/lib/types";
import { completeStep } from "@/lib/progressStore";

export function CodeStep({
  step,
  onPassed,
  isCompleted = false,
  locked = false,
  showBack = false,
  onBack,
}: {
  step: Extract<LessonStep, { type: "code" }>;
  onPassed: () => void;
  isCompleted?: boolean;
  locked?: boolean;

  // === BARU ===
  showBack?: boolean;
  onBack?: () => void;
}) {
  const isReadOnly = locked || isCompleted;

  const [code, setCode] = useState(() => step.starterCode);

  const [status, setStatus] = useState<"idle" | "checking" | "pass" | "fail">(
    () => (isReadOnly ? "pass" : "idle")
  );

  const [hintIndex, setHintIndex] = useState(0);
  const [message, setMessage] = useState("");

  const [shakeKey, setShakeKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentHint = useMemo(() => {
    if (!step.hints.length) return "";
    return step.hints[Math.min(hintIndex, step.hints.length - 1)];
  }, [hintIndex, step.hints]);

  async function onCheck() {
    if (isReadOnly) return;
    if (status === "pass") return;

    setStatus("checking");
    setMessage("");

    const res = await mockPythonRunner({
      language: "python",
      code,
      functionName: step.functionName,
      publicCases: step.publicCases,
      timeoutMs: 1500,
    });

    if (res.status === "pass") {
      setStatus("pass");
      await completeStep(step.id, 10);
      setShowSuccess(true);
      return;
    }

    setStatus("fail");
    setMessage(res.friendlyMessage);
    setHintIndex((i) => Math.min(i + 1, Math.max(step.hints.length - 1, 0)));
    setShakeKey((k) => k + 1);
  }

  function onReset() {
    if (isReadOnly) return;
    setCode(step.starterCode);
    setStatus("idle");
    setMessage("");
    setHintIndex(0);
    setShowSuccess(false);
  }

  function onContinueAfterSuccess() {
    setShowSuccess(false);
    onPassed();
  }

  return (
    <div className="space-y-4">
      {/* Prompt card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
              {step.title}
            </div>
            <div className="mt-2 text-sm leading-6 text-gray-700 dark:text-zinc-300">
              {step.prompt}
            </div>
          </div>
          <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
            Python
          </div>
        </div>
      </div>

      {/* Editor Card */}
      <div
        key={shakeKey}
        className={`rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 ${
          status === "fail" ? "anim-shake" : ""
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Editor</div>

          <button
            className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900/40"
            onClick={onReset}
            type="button"
            disabled={isReadOnly}
          >
            Reset code
          </button>
        </div>

        <CodeEditor
          value={code}
          onChange={isReadOnly ? () => {} : setCode}
          invertOnDark
        />
      </div>

      {(status === "fail" || message) && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm anim-fade-in dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-semibold text-red-700 dark:text-red-300">
            Belum tepat
          </div>
          <div className="mt-2 text-sm text-gray-800 dark:text-zinc-200">{message}</div>

          {currentHint && (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-xs font-semibold text-gray-700 dark:text-zinc-200">
                Hint
              </div>
              <div className="mt-1 text-sm text-gray-800 dark:text-zinc-200">{currentHint}</div>
            </div>
          )}
        </div>
      )}

      {/* Sticky action bar (TANPA rectangle putih) */}
      <div className="bottom-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-2">
          <div className="text-xs text-gray-600 dark:text-zinc-300">
            {status === "pass" ? (
              <span className="font-semibold text-green-600 dark:text-green-400">
                Langkah ini sudah selesai!
              </span>
            ) : (
              <>
                Klik <span className="font-semibold text-gray-900 dark:text-zinc-100">Check</span>{" "}
                untuk menjalankan penilaian.
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Back hanya muncul jika Step > 1 */}
            {showBack && onBack && (
              <button
                onClick={onBack}
                type="button"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40"
              >
                Back
              </button>
            )}

            {/* Tombol Check */}
            <button
              onClick={onCheck}
              disabled={status === "checking" || status === "pass" || isReadOnly}
              className={`focus-ring rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-80 disabled:cursor-not-allowed
                ${
                  status === "pass"
                    ? "bg-green-600 dark:bg-green-500"
                    : "bg-gray-900 hover:opacity-95 dark:bg-white dark:text-black"
                }`}
            >
              {status === "checking"
                ? "Checking..."
                : status === "pass"
                ? "Completed"
                : "Check"}
            </button>

            {/* Tombol Lanjut hanya kalau pass DAN tidak locked */}
            {status === "pass" && !locked && (
              <button
                onClick={onPassed}
                className="focus-ring animate-in fade-in rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 dark:bg-white dark:text-black"
              >
                Lanjut
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/30 anim-fade-in"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative w-full max-w-5xl px-4 pb-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl anim-slide-up dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-600 text-white anim-pop">
                    ✓
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                      Benar!
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-zinc-300">
                      Kamu dapat +10 XP
                    </div>
                  </div>
                </div>

                <button
                  onClick={onContinueAfterSuccess}
                  className="focus-ring rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 dark:bg-white dark:text-black"
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
