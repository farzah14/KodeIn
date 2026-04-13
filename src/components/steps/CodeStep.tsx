"use client";

import { useMemo, useState } from "react";
import { Book } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { runWithPiston } from "@/lib/runner/pistonRunner";
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
  const [stdoutStr, setStdoutStr] = useState("");
  const [isEngineError, setIsEngineError] = useState(false);

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
    setStdoutStr("");
    setIsEngineError(false);

    const res = await runWithPiston({
      language: "python",
      code,
      functionName: step.functionName,
      publicCases: step.publicCases,
      timeoutMs: 3000,
    });

    const parsedStdout = res.stdout ? res.stdout.replace("ALL_PASS", "").trim() : "";
    setStdoutStr(parsedStdout || (res.stderr?.trim() ?? ""));

    if (res.status === "pass") {
      setStatus("pass");
      await completeStep(step.id, 10);
      setShowSuccess(true);
      return;
    }

    setStatus("fail");
    setMessage(res.friendlyMessage || "Ada error yang tidak diketahui.");
    setHintIndex((i: number) => Math.min(i + 1, Math.max(step.hints.length - 1, 0)));
    setShakeKey((k: number) => k + 1);
  }

  function onReset() {
    if (isReadOnly) return;
    setCode(step.starterCode);
    setStatus("idle");
    setMessage("");
    setStdoutStr("");
    setIsEngineError(false);
    setHintIndex(0);
    setShowSuccess(false);
  }

  function onContinueAfterSuccess() {
    setShowSuccess(false);
    onPassed();
  }

  return (
    <div className="space-y-6 font-pixel">
      {/* Prompt card - Quest Book Style */}
      <div className="pixel-border border-4 bg-white p-6 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[8px] text-gray-400 mb-2 uppercase">
              <Book size={12} /> MISSION OBJECTIVE
            </div>
            <h3 className="text-lg text-gray-900 dark:text-white leading-tight">
              {step.title}
            </h3>
            <div className="mt-4 text-[10px] leading-relaxed text-gray-600 dark:text-gray-300">
              {step.prompt}
            </div>
          </div>
          <div className="pixel-border border-2 bg-retro-primary text-white px-3 py-1 text-[8px] shrink-0">
            PYTHON
          </div>
        </div>
      </div>

      {/* Editor & Console Container */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Editor Side */}
        <div
          key={shakeKey}
          className={`pixel-border border-4 bg-white p-4 dark:bg-zinc-900 ${
            status === "fail" ? "animate-shake border-red-500" : ""
          }`}
        >
          <div className="mb-4 flex items-center justify-between border-b-2 border-black/5 pb-2">
            <div className="text-[10px] text-gray-400 uppercase">EDITOR.EXE</div>
            <button
              className="pixel-border border-2 bg-gray-50 px-2 py-1 text-[8px] hover:bg-gray-100 disabled:opacity-50"
              onClick={onReset}
              disabled={isReadOnly}
            >
              RESET_CODE
            </button>
          </div>

          <div className="h-[400px] pixel-border border-2 overflow-hidden bg-black">
            <CodeEditor
              value={code}
              onChange={isReadOnly ? () => {} : setCode}
              invertOnDark={false}
            />
          </div>
        </div>

        {/* Output/Console Side - CRT Screen */}
        <div className="pixel-border border-4 bg-black p-4 text-retro-secondary relative overflow-hidden group">
           {/* CRT Overlay Effects */}
           <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-retro-secondary/5 to-transparent animate-pulse pointer-events-none"></div>
           
           <div className="mb-4 flex items-center justify-between border-b-2 border-white/10 pb-2">
              <div className="text-[10px] text-white/40 uppercase">CONSOLE_OUTPUT</div>
              <div className="flex gap-1">
                 <div className="h-2 w-2 rounded-full bg-red-500/40"></div>
                 <div className="h-2 w-2 rounded-full bg-retro-accent/40 animate-pulse"></div>
                 <div className="h-2 w-2 rounded-full bg-retro-secondary/40"></div>
              </div>
           </div>

           <div className="h-[400px] overflow-auto font-mono text-sm space-y-4 pr-2">
              {status === "idle" && (
                <div className="text-white/20 animate-pulse">
                  READY TO EXECUTE... <br />
                  AWAITING INPUT_
                </div>
              )}

              {status === "checking" && (
                <div className="flex items-center gap-3">
                   <div className="h-3 w-3 border-2 border-retro-secondary border-t-transparent animate-spin"></div>
                   <span>EXECUTING MISSION...</span>
                </div>
              )}

              {stdoutStr && (
                <div className="space-y-2">
                  <div className="text-[8px] text-white/40">-- STDOUT --</div>
                  <pre className="whitespace-pre-wrap break-all opacity-80">{stdoutStr}</pre>
                </div>
              )}

              {status === "fail" && (
                <div className="pixel-border border-2 border-red-500 bg-red-500/10 p-4 text-red-500">
                  <div className="text-[8px] uppercase mb-1">SYSTEM_ERROR</div>
                  <p className="text-xs">{message}</p>
                </div>
              )}

              {currentHint && status === "fail" && (
                <div className="pixel-border border-2 border-retro-accent bg-retro-accent/10 p-4 text-retro-accent">
                   <div className="text-[8px] uppercase mb-1">TIP_FROM_HQ</div>
                   <p className="text-xs">{currentHint}</p>
                </div>
              )}

              {status === "pass" && (
                <div className="text-retro-secondary">
                   <div className="text-[10px] mb-2 font-pixel">MISSION CLEAR!</div>
                   <p className="opacity-60 text-xs">All test cases passed. Code execution successful.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t-4 border-black/5 dark:border-white/5">
         <div className="text-[8px] text-gray-400">
           {status === "pass" ? "[STABLE]" : "[AWAITING_RUN]"}
         </div>
         
         <div className="flex items-center gap-4">
            {showBack && onBack && (
              <button onClick={onBack} className="pixel-btn px-6 py-2 text-[10px]">BACK</button>
            )}
            
            <button
               onClick={onCheck}
               disabled={status === "checking" || status === "pass" || isReadOnly}
               className={`pixel-btn px-10 py-3 text-[10px] ${
                 status === "pass" ? "bg-retro-secondary text-white border-retro-secondary" : "bg-retro-primary text-white border-retro-primary"
               } disabled:opacity-50`}
            >
               {status === "checking" ? "CHECKING..." : status === "pass" ? "MISSION_CLEAR" : "CHECK_CODE"}
            </button>

            {status === "pass" && !locked && (
              <button 
                onClick={onPassed}
                className="pixel-btn bg-black text-white px-10 py-3 text-[10px] animate-bounce"
              >
                CONTINUE &gt;&gt;
              </button>
            )}
         </div>
      </div>

      {/* Mini Success Popover */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
           <div className="pixel-border border-4 border-retro-secondary bg-white p-6 shadow-pixel anim-slide-up">
              <div className="flex items-center gap-6">
                 <div className="h-12 w-12 bg-retro-secondary text-white grid place-items-center font-pixel text-xl">✓</div>
                 <div>
                    <div className="font-pixel text-[10px] text-retro-secondary">LEGENDARY!</div>
                    <div className="font-pixel text-[8px] text-gray-400 mt-1">+10 XP EARNED</div>
                 </div>
                 <button onClick={onContinueAfterSuccess} className="pixel-btn px-4 py-2 text-[8px] bg-black text-white">CONTINUE</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
