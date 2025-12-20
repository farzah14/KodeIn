"use client";

import { useMemo, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { mockPythonRunner } from "@/lib/runner/mockPythonRunner";
import { markStepCompleted } from "@/lib/storage";
import { LessonStep } from "@/lib/types";

export function CodeStep({
  step,
  onPassed,
}: {
  step: Extract<LessonStep, { type: "code" }>;
  onPassed: () => void;
}) {
  const [code, setCode] = useState(step.starterCode);
  const [status, setStatus] = useState<"idle" | "checking" | "pass" | "fail">("idle");
  const [hintIndex, setHintIndex] = useState(0);
  const [message, setMessage] = useState("");

  // Animasi fail ringan pada card editor
  const [shakeKey, setShakeKey] = useState(0);

  // Success overlay
  const [showSuccess, setShowSuccess] = useState(false);

  const currentHint = useMemo(() => {
    if (!step.hints.length) return "";
    return step.hints[Math.min(hintIndex, step.hints.length - 1)];
  }, [hintIndex, step.hints]);

  async function onCheck() {
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
      markStepCompleted(step.id, 10);

      // tampilkan success animation
      setShowSuccess(true);
      return;
    }

    setStatus("fail");
    setMessage(res.friendlyMessage);
    setHintIndex((i) => Math.min(i + 1, Math.max(step.hints.length - 1, 0)));

    // trigger shake animation (pakai key agar animasi bisa repeat)
    setShakeKey((k) => k + 1);
  }

  function onReset() {
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
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{step.title}</div>
            <div className="mt-2 text-sm leading-6 text-gray-700">{step.prompt}</div>
          </div>
          <div className="rounded-full border bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
            Python
          </div>
        </div>
      </div>

      {/* Editor Card */}
      <div
        key={shakeKey}
        className={`rounded-3xl border bg-white p-4 shadow-sm ${
          status === "fail" ? "anim-shake" : ""
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Editor</div>
          <button
            className="rounded-xl border bg-white px-3 py-1 text-xs shadow-sm hover:bg-gray-50"
            onClick={onReset}
            type="button"
          >
            Reset code
          </button>
        </div>
        <CodeEditor value={code} onChange={setCode} />
      </div>

      {(status === "fail" || message) && (
        <div className="rounded-3xl border bg-white p-6 shadow-sm anim-fade-in">
          <div className="text-sm font-semibold text-red-700">Belum tepat</div>
          <div className="mt-2 text-sm text-gray-800">{message}</div>

          {currentHint && (
            <div className="mt-4 rounded-2xl border bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-700">Hint</div>
              <div className="mt-1 text-sm text-gray-800">{currentHint}</div>
            </div>
          )}
        </div>
      )}

      {/* Sticky action bar */}
      <div className="sticky bottom-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
          <div className="text-xs text-gray-600">
            Klik <span className="font-semibold text-gray-900">Check</span> untuk menjalankan penilaian.
          </div>

          <button
            onClick={onCheck}
            disabled={status === "checking" || showSuccess}
            className="focus-ring rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {status === "checking" ? "Checking..." : "Check"}
          </button>
        </div>
      </div>

      {/* SUCCESS OVERLAY (Duolingo-style) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/20 anim-fade-in"
            onClick={() => setShowSuccess(false)}
          />
          {/* sheet */}
          <div className="relative w-full max-w-5xl px-4 pb-6">
            <div className="rounded-3xl border bg-white p-6 shadow-xl anim-slide-up">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-600 text-white anim-pop">
                    ✓
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">Benar!</div>
                    <div className="mt-1 text-sm text-gray-600">Kamu dapat +10 XP</div>
                  </div>
                </div>

                <button
                  onClick={onContinueAfterSuccess}
                  className="focus-ring rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
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
