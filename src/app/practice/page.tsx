"use client";

import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { CodeEditor } from "@/components/CodeEditor";
import { runGenericPiston } from "@/lib/runner/pistonRunner";
import { Play, Code2, Terminal, Palette, CodeIcon, RotateCcw } from "lucide-react";

const TEMPLATES: Record<string, string> = {
  python: `def greet(name):\n    return f"Hello {name}!"\n\nprint(greet("Dunia"))\n`,
  javascript: `function greet(name) {\n  return \`Hello \${name}!\`;\n}\n\nconsole.log(greet("Dunia"));\n`,
  sql: `-- Buat tabel sementara\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  role TEXT\n);\n\n-- Masukkan data\nINSERT INTO users (name, role) VALUES \n  ('Budi', 'Admin'), \n  ('Andi', 'Member'),\n  ('Siti', 'Member');\n\n-- Ambil data\nSELECT * FROM users;`
};

export default function PracticePage() {
  const [language, setLanguage] = useState("python");
  const [editorTheme, setEditorTheme] = useState("system");
  const [code, setCode] = useState(TEMPLATES["python"]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    setCode(TEMPLATES[lang] || "");
    setOutput("");
  }

  function handleReset() {
    setCode(TEMPLATES[language] || "");
    setOutput("");
  }

  async function handleRun() {
     if (isRunning) return;
     setIsRunning(true);
     setOutput("");
     const res = await runGenericPiston(code, language);
     
     if (res.stderr?.includes("__ENGINE_UNAVAILABLE__")) {
       setOutput("⚠️ Server Execution Engine sedang sibuk.\nSilakan tunggu beberapa saat lalu klik Run Code lagi.");
       setIsRunning(false);
       return;
     }

     let finalOut = res.stderr ? `Error:\n${res.stderr}\n\n` : "";
     finalOut += res.stdout ? res.stdout : (res.stderr ? "" : "Program exited with no output.");
     setOutput(finalOut);
     setIsRunning(false);
  }

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#060608] flex flex-col font-sans transition-colors duration-500">
      {/* Premium Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="pointer-events-none fixed top-0 right-0 z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px]"></div>

      <Topbar />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 flex-1 flex flex-col gap-10">
        
        {/* Modern Header Section */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between px-2">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Code2 size={12} strokeWidth={3} /> Sandbox Environment
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                 KodeIn <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500">Playground</span>
              </h1>
              <p className="text-gray-500 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
                Tempat bebas untuk bereksperimen, merancang algoritma, dan mengasah logika pemrogramanmu setiap hari.
              </p>
           </div>
           
           <div className="flex flex-wrap items-center gap-4">
              {/* Tool Selector Group */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/50 backdrop-blur-md border border-gray-100 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-sm">
                {/* Theme Toggle */}
                <select 
                  value={editorTheme}
                  onChange={e => setEditorTheme(e.target.value)}
                  className="appearance-none rounded-xl bg-transparent px-4 py-2 text-xs font-bold text-gray-600 dark:text-zinc-400 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                   <option value="system">Auto Theme</option>
                   <option value="dark-pro">Dark Pro</option>
                   <option value="monokai-pro">Monokai Pro (Dark)</option>
                   <option value="monokai-pro-light">Monokai Pro (Light)</option>
                   <option value="vs-dark">VS Dark</option>
                   <option value="vs">VS Light</option>
                </select>

                <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700 mx-1" />

                {/* Language Switcher */}
                <select 
                  value={language}
                  onChange={e => handleLanguageChange(e.target.value)}
                  className="appearance-none rounded-xl bg-transparent px-4 py-2 text-xs font-black text-indigo-600 dark:text-indigo-400 outline-none cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors uppercase tracking-widest"
                >
                   <option value="python">Python</option>
                   <option value="javascript">JavaScript</option>
                   <option value="sql">SQLite</option>
                </select>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="group relative flex items-center justify-center gap-3 px-10 py-3.5 rounded-2xl bg-indigo-600 text-white font-black text-sm tracking-wide shadow-xl shadow-indigo-600/25 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                  {isRunning ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                  <span>{isRunning ? "RUNNING..." : "RUN CODE"}</span>
              </button>
           </div>
        </div>

        {/* Workspace Container — Sync with Learn style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[500px]">
           
           {/* Editor Side */}
           <div className="flex flex-col rounded-[2rem] border border-gray-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden transition-all duration-300">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <CodeIcon size={14} /> main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'sql'}
                </div>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  onClick={handleReset}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              <div className="flex-1 relative">
                 <CodeEditor language={language} editorTheme={editorTheme} value={code} onChange={setCode} invertOnDark={false} />
              </div>
           </div>

           {/* Console Side */}
           <div className="flex flex-col rounded-[2rem] border border-zinc-800 bg-[#0c0c0e] shadow-2xl overflow-hidden group">
              <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                     <Terminal size={14} /> Console Output
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
                    <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
                    <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-indigo-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                  </div>
              </div>

              <div className="flex-1 p-8 font-mono text-base space-y-4 overflow-auto custom-scrollbar">
                 {output ? (
                    <div className="space-y-3 animate-in fade-in duration-300">
                       <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-50">Master Terminal</div>
                       <div className="whitespace-pre-wrap">
                          {output.split('\n').map((line, i) => (
                              <div key={i} className={`flex gap-4 py-0.5 ${line.startsWith('Error:') || line.includes('Error') || line.includes('Exception') ? 'text-rose-400' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.1)]'}`}>
                                 <span className="opacity-20 select-none hidden sm:inline-block w-6 text-right shrink-0">{i+1}</span>
                                 <span className="break-all">{line}</span>
                              </div>
                          ))}
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-zinc-600">
                       <div className="p-4 rounded-full bg-zinc-900/50">
                         <Play size={24} className="opacity-20" />
                       </div>
                       <p className="text-sm font-medium opacity-50 uppercase tracking-widest">Awaiting execution...</p>
                    </div>
                 )}
              </div>
           </div>
           
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
}
