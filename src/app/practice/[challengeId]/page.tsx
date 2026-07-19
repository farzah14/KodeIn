"use client";

import { useEffect, useState, use } from "react";
import { Topbar } from "@/components/Topbar";
import { practiceChallenges } from "@/lib/practiceChallenges";
import Editor from "@monaco-editor/react";
import { Zap, Play, Check, X, RotateCcw, Layout, Info, Trophy, Loader2, Code2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { completePractice } from "@/lib/progressStore";

export default function PracticeSolverPage({ params: paramsPromise }: { params: Promise<{ challengeId: string }> }) {
  const { challengeId } = use(paramsPromise);
  const router = useRouter();
  const { t } = useTranslation();
  
  const challenge = practiceChallenges.find(c => c.id === challengeId);
  const [code, setCode] = useState(challenge?.starterCode || "");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ input: string, expected: string, actual: string, passed: boolean }[] | null>(null);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!challenge) router.push("/practice");
  }, [challenge, router]);

  const handleReset = () => {
    if (challenge) setCode(challenge.starterCode);
    setResults(null);
    setError("");
  };

  const runCode = async () => {
    if (!challenge || running) return;
    setRunning(true);
    setResults(null);
    setError("");
    
    try {
      if (!window.loadPyodide) {
        throw new Error("Sistem pendukung coding sedang dimuat. Harap tunggu beberapa detik lalu coba lagi.");
      }
      
      let py = window.pyodideInstance;
      if (!py) {
        py = await window.loadPyodide();
        window.pyodideInstance = py;
      }

      const testResults = [];
      let allPassed = true;

      for (const tc of challenge.testCases) {
        try {
          // Setup: Catch stdout and Provide Stdin
          py.runPython(`
import sys
import io
import json
sys.stdin = io.StringIO(${JSON.stringify(tc.input)})
sys.stdout = io.StringIO()
          `);

          // Execute User Code
          await py.runPythonAsync(code);

          // Capture Output
          const finalResult = py.runPython("sys.stdout.getvalue()").trim();

          const passed = finalResult === tc.expectedOutput.trim();
          if (!passed) allPassed = false;

          testResults.push({
            input: tc.input,
            expected: tc.expectedOutput.trim(),
            actual: finalResult,
            passed
          });
        } catch (err) {
          allPassed = false;
          testResults.push({
             input: tc.input,
             expected: tc.expectedOutput.trim(),
             actual: (err as Error).message,
             passed: false
          });
        }
      }

      setResults(testResults);
      if (allPassed) {
        setIsSuccess(true);
        // Persist to database & update local store
        try {
          await completePractice(challengeId, code);
        } catch (e) {
          console.error("Failed to sync progress:", e);
        }
      }
    } catch (err) {
      setError((err as Error).message || "Gagal menjalankan kode.");
    } finally {
      setRunning(false);
    }
  };

  if (!challenge) return null;

  return (
    <div className="min-h-screen bg-edu-bg flex flex-col overflow-hidden">
      <Topbar />

      <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-white dark:bg-zinc-950">
        
        {/* Left Panel: Description */}
        <div className="w-full md:w-2/5 border-r border-gray-100 dark:border-zinc-800 overflow-y-auto custom-scrollbar p-8">
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <Link href="/practice" className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:underline flex items-center gap-1">
                    ← {t("common.back")}
                 </Link>
                 <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${challenge.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-500 border-emerald-500/10' : 'bg-amber-50 text-amber-500 border-amber-500/10'}`}>
                    {challenge.difficulty}
                 </div>
              </div>

              <div>
                 <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-4"><span className="text-gray-300 dark:text-zinc-700 mr-2">#{challenge.number}.</span>{challenge.title}</h1>
                 <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1.5"><Layout size={14} /> {challenge.category}</span>
                    <span className="flex items-center gap-1.5 text-edu-xp"><Zap size={14} fill="currentColor" /> {challenge.xp} XP</span>
                 </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none">
                 <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 leading-relaxed">
                    {challenge.description}
                 </div>
              </div>

              {/* Test Cases Preview */}
              <div className="space-y-4 pt-4">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={12} className="text-indigo-500" /> {t("practice.cases.example")}
                 </h3>
                 <div className="grid gap-3">
                    {challenge.testCases.slice(0, 2).map((tc, idx) => (
                       <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 font-mono text-base">
                          <div className="mb-1 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Input</div>
                          <div className="mb-3 text-gray-800 dark:text-gray-200 font-black">{tc.input}</div>
                          <div className="mb-1 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Expected Output</div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-black">{tc.expectedOutput}</div>
                       </div>
                    ))}
                 </div>
              </div>

              {isSuccess && (
                <div className="p-6 rounded-[2rem] bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 animate-in zoom-in duration-500">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                         <Trophy size={24} />
                      </div>
                      <div>
                         <h4 className="font-black uppercase tracking-tighter text-lg leading-tight">{t("practice.complete.title")}</h4>
                         <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-widest">{t("practice.complete.desc")}</p>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Right Panel: Editor & Results (Desktop Only) */}
        <div className="hidden md:flex flex-1 flex-col bg-edu-codeBg relative overflow-hidden">
           
           <div className="flex-1 min-h-0 relative">
              <div className="absolute top-0 left-0 right-0 h-10 bg-black/20 backdrop-blur-md border-b border-white/5 z-20 flex items-center justify-between px-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <Code2 size={12} /> solution.py
                 </div>
                 <button onClick={handleReset} className="text-white/40 hover:text-white transition-colors">
                    <RotateCcw size={14} />
                 </button>
              </div>

              <Editor 
                height="100%"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={v => setCode(v || "")}
                options={{
                  fontSize: 14,
                  padding: { top: 60, bottom: 100 },
                  minimap: { enabled: false },
                  fontFamily: 'JetBrains Mono, Menlo, monospace',
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />

              {/* Action Bar */}
              <div className="absolute bottom-10 left-10 right-10 z-30">
                 <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
                    <div className="hidden sm:block text-[9px] font-black text-white/50 uppercase tracking-[0.2em] pl-2">Ready to Solve?</div>
                    <button 
                      onClick={runCode}
                      disabled={running}
                      className="flex items-center gap-3 px-10 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                       {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                       {running ? t("practice.running") : t("practice.run")}
                    </button>
                 </div>
              </div>
           </div>

           {/* Results Tray */}
           {results && (
              <div className="h-1/3 bg-[#0c0c0e] border-t border-zinc-800 overflow-y-auto animate-in slide-in-from-bottom duration-500 custom-scrollbar">
                 <div className="px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Check size={14} className="text-emerald-500" /> {t("practice.cases.results")}
                       </h3>
                       <button onClick={() => setResults(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                       {results.map((res, i) => (
                          <div key={i} className={`p-4 rounded-2xl border transition-all ${res.passed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t("practice.cases.case")} {i+1}</span>
                                {res.passed ? <Check size={14} className="text-emerald-500" /> : <X size={14} className="text-rose-500" />}
                             </div>
                             <div className="space-y-1 font-mono text-[11px]">
                                <div className="text-zinc-500 truncate">Input: {res.input}</div>
                                <div className={res.passed ? "text-emerald-400" : "text-rose-400"}>Output: {res.actual}</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           )}

           {error && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 p-4 bg-rose-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl z-50 animate-bounce">
                 {error}
              </div>
           )}
        </div>
        
        {/* Mobile View Fallback */}
        <div className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-zinc-950/50">
           <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
              <Code2 size={32} />
           </div>
           <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Code Editor Not Available</h3>
           <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 max-w-[280px] leading-relaxed">
              For the best coding experience, please use a desktop browser to solve this practice challenge.
           </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
