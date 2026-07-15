"use client";

import { useMemo, useState } from "react";
import { Book, CodeIcon, Terminal, RotateCcw, PlayCircle, CheckCircle2 } from "lucide-react";
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
  showBack?: boolean;
  onBack?: () => void;
}) {
  const isReadOnly = locked || isCompleted;
  const [editorTheme, setEditorTheme] = useState("system");
  const [code, setCode] = useState(() => step.starterCode);
  const [status, setStatus] = useState<"idle" | "checking" | "pass" | "fail">(
    () => (isReadOnly ? "pass" : "idle")
  );

  const [hintIndex, setHintIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [stdoutStr, setStdoutStr] = useState("");
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

    // Network call: run code against the Piston-compatible API. Any thrown
    // exception (offline, CORS, server 5xx with non-JSON body, etc.) must not
    // crash the whole step — fall back to a friendly offline message.
    let res;
    try {
      res = await runWithPiston({
        language: "python",
        code,
        functionName: step.functionName,
        publicCases: step.publicCases,
        timeoutMs: 3000,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[CodeStep] runWithPiston failed:", e);
      setStatus("fail");
      setMessage(
        "Tidak bisa menghubungi server kode. Periksa koneksi internetmu lalu coba lagi."
      );
      setShakeKey((k: number) => k + 1);
      return;
    }

    const parsedStdout = res.stdout ? res.stdout.replace("ALL_PASS", "").trim() : "";
    setStdoutStr(parsedStdout || (res.stderr?.trim() ?? ""));

    if (res.status === "pass") {
      setStatus("pass");
      // Database call: persist step completion. A failure here must not
      // overturn a successful run — the user already passed, so we just warn
      // and continue the lesson flow.
      try {
        await completeStep(step.id, 10);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[CodeStep] completeStep failed:", e);
        setMessage(
          "Hasil test pass, tetapi progres gagal disimpan. Coba lagi dalam beberapa saat."
        );
      }
      setShowSuccess(true);
      return;
    }

    setStatus("fail");
    setMessage(res.friendlyMessage || "Ada error pada kodemu. Silakan periksa kembali.");
    setHintIndex((i: number) => Math.min(i + 1, Math.max(step.hints.length - 1, 0)));
    setShakeKey((k: number) => k + 1);
  }

  function onReset() {
    if (isReadOnly) return;
    setCode(step.starterCode);
    setStatus("idle");
    setMessage("");
    setStdoutStr("");
    setHintIndex(0);
    setShowSuccess(false);
  }

  function onContinueAfterSuccess() {
    setShowSuccess(false);
    onPassed();
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Prompt Card */}
      <div className="rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-xl p-8 dark:border-zinc-800 dark:bg-zinc-950/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3">
           <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest dark:bg-indigo-900/30 dark:text-indigo-400">
             Python 3.10
           </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
             <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
               <Book size={20} />
             </div>
             <span className="text-xs font-black uppercase tracking-[0.1em]">Mission Objective</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {step.title}
            </h3>
            <div className="text-xl leading-relaxed text-gray-700 dark:text-zinc-300 bg-gray-50/80 dark:bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-indigo-500 shadow-inner">
              {step.prompt}
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Console Workspaces */}
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Editor Side */}
        <div
          key={shakeKey}
          className={`flex flex-col rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden transition-all duration-300 ${
            status === "fail" ? "animate-shake ring-2 ring-red-500/50" : ""
          }`}
        >
          <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <CodeIcon size={14} /> Editor
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={editorTheme}
                onChange={e => setEditorTheme(e.target.value)}
                className="appearance-none rounded-lg bg-transparent px-3 py-1 text-[10px] font-black text-gray-400 dark:text-zinc-600 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
              >
                 <option value="system">Theme: Auto</option>
                 <option value="dark-pro">Dark Pro</option>
                 <option value="monokai-pro">Monokai Pro</option>
                 <option value="monokai-pro-light">Monokai Light</option>
                 <option value="vs-dark">VS Dark</option>
              </select>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                onClick={onReset}
                disabled={isReadOnly}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          <div className="h-[450px] relative">
            <CodeEditor
              value={code}
              onChange={isReadOnly ? () => {} : setCode}
              invertOnDark={false}
              editorTheme={editorTheme}
            />
          </div>
        </div>

        {/* Output/Console Side */}
        <div className="flex flex-col rounded-3xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl overflow-hidden group">
           <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                 <Terminal size={14} /> Console Output
              </div>
              <div className="flex gap-1.5">
                 <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
                 <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
                 <div className={`h-2 w-2 rounded-full ${status === 'checking' ? 'bg-indigo-500 animate-pulse' : 'bg-zinc-700'}`}></div>
              </div>
           </div>

           <div className="flex-1 p-8 font-mono text-base space-y-6 overflow-auto custom-scrollbar">
              {status === "idle" && (
                <div className="text-zinc-600 flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="p-4 rounded-full bg-zinc-900/50">
                    <PlayCircle size={32} className="opacity-20" />
                  </div>
                  <p className="text-sm font-medium opacity-50 uppercase tracking-wider">Awaiting execution...</p>
                </div>
              )}

              {status === "checking" && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-indigo-400">
                   <div className="h-10 w-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                   <span className="text-sm font-bold uppercase tracking-widest">Running tests...</span>
                </div>
              )}

              {stdoutStr && (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-50">Standard Output</div>
                  <pre className="text-emerald-400 whitespace-pre-wrap break-all leading-relaxed drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]">{stdoutStr}</pre>
                </div>
              )}

              {status === "fail" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <div className="text-[10px] font-black uppercase mb-2 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> System Error
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{message}</p>
                  </div>

                  {currentHint && (
                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                       <div className="text-[10px] font-black uppercase mb-2 tracking-widest">Hint from HQ</div>
                       <p className="text-sm font-medium leading-relaxed">{currentHint}</p>
                    </div>
                  )}
                </div>
              )}

              {status === "pass" && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-emerald-400 animate-in zoom-in duration-500">
                   <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                     <CheckCircle2 size={48} />
                   </div>
                   <div className="text-center">
                     <div className="text-xl font-black tracking-tight mb-1">MISSION CLEAR!</div>
                     <p className="text-sm text-emerald-500/60 font-medium">Semua test case berhasil dilewati.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Modern Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-4">
         <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 dark:text-zinc-700">
            <div className={`w-2 h-2 rounded-full ${status === 'pass' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gray-300 dark:bg-zinc-800'}`} />
            System Status: {status === "pass" ? "STABLE" : "READY"}
         </div>
         
         <div className="flex items-center gap-4 w-full sm:w-auto">
            {showBack && onBack && (
              <button 
                onClick={onBack} 
                className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all active:scale-95"
              >
                BACK
              </button>
            )}
            
            <button
               onClick={onCheck}
               disabled={status === "checking" || status === "pass" || isReadOnly}
               className={`flex-1 sm:flex-none px-12 py-3.5 rounded-2xl text-sm font-black tracking-wide shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
                 status === "pass" 
                  ? "bg-emerald-500 text-white shadow-emerald-500/25" 
                  : "bg-indigo-600 text-white shadow-indigo-600/25 hover:bg-indigo-700 hover:shadow-indigo-700/40"
               }`}
            >
               {status === "checking" ? (
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   CHECKING...
                 </div>
               ) : status === "pass" ? "MISSION CLEAR" : "RUN TESTS"}
            </button>

            {status === "pass" && !locked && (
              <button 
                onClick={onPassed}
                className="flex-1 sm:flex-none px-12 py-3.5 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-black tracking-wide shadow-xl transition-all hover:-translate-y-1 active:scale-95 animate-in slide-in-from-right-4"
              >
                CONTINUE
              </button>
            )}
         </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
}
