"use client";

import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { CodeEditor } from "@/components/CodeEditor";
import { runGenericPiston } from "@/lib/runner/pistonRunner";
import { Play, Code2, Terminal, Palette } from "lucide-react";

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
  }

  async function handleRun() {
     setIsRunning(true);
     setOutput("Menjalankan program...");
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
    <div className="relative min-h-screen bg-[#eef2f6] dark:bg-[#09090b] flex flex-col font-sans transition-colors duration-500">
      {/* Background Grids & Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="pointer-events-none fixed top-0 right-0 z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent blur-[120px] dark:from-cyan-500/5 dark:via-indigo-500/5"></div>
      <div className="pointer-events-none fixed bottom-[-200px] left-[-200px] z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-purple-500/10 to-transparent blur-[120px] dark:from-purple-500/5"></div>

      <Topbar />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 flex-1 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between rounded-[32px] border border-gray-200/50 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/60">
           <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 mb-4">
                <Code2 size={12} strokeWidth={3} /> Editor Bebas
              </div>
              <h1 className="text-4xl font-black tracking-tight text-gray-800 dark:text-white drop-shadow-sm">
                 KodeIn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">Playground</span>
              </h1>
              <p className="text-gray-500/90 dark:text-zinc-400 mt-2 font-medium">Tempat terbaik untuk merakit kode baru atau membuktikan teorimu.</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
              
              {/* Editor Theme Selector */}
              <div className="relative group hidden md:block">
                <select 
                  value={editorTheme}
                  onChange={e => setEditorTheme(e.target.value)}
                  className="relative appearance-none rounded-2xl border border-gray-200/80 bg-white/60 py-3.5 pl-10 pr-8 text-sm font-bold text-gray-700 shadow-sm outline-none backdrop-blur-md focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-zinc-800 dark:bg-black/60 dark:text-gray-300 dark:focus:border-cyan-500 transition-all cursor-pointer hover:bg-white/80 dark:hover:bg-black/80"
                >
                   <option value="system">Auto Theme</option>
                   <option value="vs-dark">Dark Theme</option>
                   <option value="vs">Light Theme</option>
                   <option value="hc-black">High Contrast</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
                  <Palette size={16} />
                </div>
              </div>

              {/* Language Selector */}
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                <select 
                  value={language}
                  onChange={e => handleLanguageChange(e.target.value)}
                  className="relative appearance-none rounded-2xl border border-gray-200/80 bg-white/80 px-6 py-3.5 pr-12 text-sm font-bold text-gray-800 shadow-sm outline-none backdrop-blur-md focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-zinc-800 dark:bg-black/80 dark:text-white dark:focus:border-cyan-500 transition-all cursor-pointer hover:bg-white dark:hover:bg-black"
                >
                   <option value="python">Python 3.10</option>
                   <option value="javascript">Node.js (JS)</option>
                   <option value="sql">SQL (SQLite)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>

              {/* Glowing Run Button */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gray-900 px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/25 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:shadow-white/20"
                title="RUN (Local Engine)"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                 <div className="relative flex items-center gap-2">
                   {isRunning ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full dark:border-black/30 dark:border-t-black"></span> : <Play size={18} fill="currentColor" />}
                   {isRunning ? "Running..." : "Run Code"}
                 </div>
              </button>
           </div>
        </div>

        {/* Editor & Output Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
           
           {/* EDITOR PANEL — VS Code-style editor handles its own chrome */}
           <div className="flex flex-col overflow-hidden rounded-xl shadow-2xl shadow-gray-900/20 dark:shadow-black/40">
              <div className="flex-1" style={{ minHeight: 0 }}>
                 <CodeEditor language={language} editorTheme={editorTheme} value={code} onChange={setCode} invertOnDark />
              </div>
           </div>

           {/* CONSOLE TERMINAL PANEL */}
           <div className="flex flex-col overflow-hidden rounded-[32px] border border-gray-200/60 bg-[#131b2c] shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl dark:border-zinc-800/60 dark:shadow-none transition-colors duration-300 group">
              {/* Fake Mac Window Controls */}
              <div className="flex items-center gap-3 border-b border-indigo-900/20 bg-[#1e293b]/50 px-6 py-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400/90 shadow-sm"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-400/90 shadow-sm"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400/90 shadow-sm"></div>
                  </div>
                  <div className="flex h-8 ml-2 px-3 items-center justify-center rounded-xl bg-black/20 text-indigo-300/80">
                    <Terminal size={14} className="mr-2" />
                    <span className="text-[11px] font-bold tracking-widest uppercase">Output Console</span>
                  </div>
              </div>
              {/* Terminal Body */}
              <div className="flex-1 p-6 font-mono text-[13px] leading-relaxed overflow-auto">
                 {output ? (
                    <div className="whitespace-pre-wrap">
                       {output.split('\n').map((line, i) => (
                           <div key={i} className={`flex gap-4 hover:bg-white/5 py-0.5 px-2 rounded -mx-2 ${line.startsWith('Error:') || line.includes('Error') || line.includes('Exception') ? 'text-rose-400' : 'text-[#3bdf72]'}`}>
                              <span className="opacity-30 select-none hidden sm:inline-block w-4 text-right shrink-0">{i+1}</span>
                              <span className="break-all">{line}</span>
                           </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-slate-500/70 italic flex items-center gap-3 select-none mt-2">
                      <span className="animate-pulse text-indigo-500">❯</span> Menunggu perintah eksekusi kode...
                    </div>
                 )}
              </div>
           </div>
           
        </div>
      </main>
    </div>
  );
}
