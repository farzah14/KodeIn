"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/Topbar";
import { UserAvatar } from "@/components/UserAvatar";
import { battleChallenges } from "@/lib/battleChallenges";
import Editor from "@monaco-editor/react";
import { Sword, Zap, Trophy, Copy, Check, X, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface PyodideInstance {
  runPython: (code: string) => string;
  runPythonAsync: (code: string) => Promise<void>;
}

declare global {
  interface Window {
    loadPyodide?: () => Promise<PyodideInstance>;
    pyodideInstance?: PyodideInstance;
  }
}

type RoomState = {
  id: string;
  status: string;
  challengeId: string;
  player1Id: string;
  player2Id: string | null;
  player1Done: boolean;
  player2Done: boolean;
  player1Result: string;
  player2Result: string;
  winnerId: string | null;
  player1: { name: string; image: string } | null;
  player2: { name: string; image: string } | null;
};

export default function BattleArena({ params: paramsPromise }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(paramsPromise);
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [room, setRoom] = useState<RoomState | null>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [surrendering, setSurrendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const challenge = room ? battleChallenges.find(c => c.id === room.challengeId) : null;
  const isPlayer1 = session?.user?.id === room?.player1Id;
  const isPlayer2 = session?.user?.id === room?.player2Id;
  const done = isPlayer1 ? room?.player1Done : room?.player2Done;

  useEffect(() => {
    const sse = new EventSource(`/api/battle/${roomId}/state`);
    sse.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setRoom(data);
      if (data.status === "active") {
        const ch = battleChallenges.find(c => c.id === data.challengeId);
        if (ch) {
          setCode((curr) => curr ? curr : ch.starterCode);
        }
      }
    };
    sse.onerror = () => sse.close();
    return () => sse.close();
  }, [roomId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (submitting || done || !challenge) return;
    setSubmitting(true);
    setError("");

    try {
      // 1. Initialize Pyodide if not already there
      if (!window.loadPyodide) {
        throw new Error("Sistem eksekusi belum siap. Tunggu sebentar.");
      }
      
      let py = window.pyodideInstance;
      if (!py) {
        py = await window.loadPyodide();
        window.pyodideInstance = py;
      }

      // 2. Run all test cases locally
      let allPassed = true;
      for (const tc of challenge.testCases) {
        try {
          // Prepare Python environment
          py.runPython(`
import sys
import io
sys.stdin = io.StringIO(${JSON.stringify(tc.input)})
sys.stdout = io.StringIO()
          `);
          
          await py.runPythonAsync(code);
          const result = py.runPython("sys.stdout.getvalue()").trim();
          
          if (result !== tc.expectedOutput.trim()) {
            allPassed = false;
            break;
          }
        } catch (err) {
          console.error("Test Case Error:", err);
          allPassed = false;
          break;
        }
      }

      // 3. Submit result to server to sync
      const res = await fetch(`/api/battle/${roomId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || t("common.error"));
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Kesalahan eksekusi lokal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSurrender = async () => {
    if (submitting || surrendering || done) return;
    if (!confirm(t("leaderboard.ranking") === "Peta" ? "Yakin ingin menyerah?" : "Are you sure you want to surrender?")) return;
    
    setSurrendering(true);
    setError("");
    try {
      const res = await fetch(`/api/battle/${roomId}/surrender`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || t("common.error"));
      }
    } catch (err) {
      setError((err as Error).message || "Gagal menyerah.");
    } finally {
      setSurrendering(false);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-edu-bg">
        <Topbar />
        <div className="flex flex-col items-center justify-center pt-32 animate-pulse">
           <Zap size={48} className="text-edu-primary mb-4 animate-bounce" />
           <div className="text-edu-textSecondary font-black uppercase tracking-widest text-xs">{t("battle.status.connecting")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-edu-bg transition-colors duration-500 overflow-hidden flex flex-col">
      <Topbar />

      {/* Battle Header Stats */}
      <div className="bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 shadow-sm relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
         {/* Player 1 */}
         <div className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${isPlayer1 ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20" : "bg-gray-50 border-gray-100 dark:bg-zinc-900 dark:border-zinc-800"}`}>
            <UserAvatar src={room.player1?.image || ""} size={48} className="rounded-xl shadow-md" />
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase text-gray-400">{t("leaderboard.ranking") === "Peta" ? "Pemain 1" : "Player 1"}</span>
               <span className="text-sm font-black text-gray-900 dark:text-white truncate max-w-[120px]">{room.player1?.name || (t("leaderboard.ranking") === "Peta" ? "Pemain 1" : "Player 1")}</span>
               <div className="flex items-center gap-2 mt-1">
                  {room.player1Done ? (
                    room.player1Result === "success" ? <Check size={14} className="text-emerald-500" /> : <X size={14} className="text-rose-500" />
                  ) : <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />}
                  <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">{room.player1Done ? t("battle.submitted") : t("battle.status.coding")}</span>
               </div>
            </div>
         </div>

         {/* Middle Status */}
         <div className="flex flex-col items-center text-center">
            {room.status === "waiting" ? (
               <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-2xl">
                     <span className="text-xs font-black text-orange-500 font-mono tracking-widest">{roomId}</span>
                     <button onClick={handleCopy} className="text-orange-500 hover:scale-110 active:scale-95 transition-all">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                     </button>
                  </div>
                  <div className="text-[9px] font-black text-edu-textSecondary uppercase tracking-widest animate-pulse">{t("battle.status.waiting")}</div>
               </div>
            ) : room.status === "active" ? (
               <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-4 text-edu-error">
                     <Sword size={24} className="animate-pulse" />
                     <span className="text-2xl font-black italic tracking-tighter">{t("battle.versus")}</span>
                     <Sword size={24} className="scale-x-[-1] animate-pulse" />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                     <div className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-500/20">{t("battle.status.started")}</div>
                     {(isPlayer1 || isPlayer2) && !done && (
                        <button 
                           onClick={handleSurrender} 
                           disabled={submitting || surrendering}
                           className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors"
                        >
                           {t("leaderboard.ranking") === "Peta" ? "Menyerah" : "Surrender"}
                        </button>
                     )}
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center gap-1">
                  <Trophy size={28} className="text-orange-400 mb-1" />
                  <div className="text-lg font-black text-edu-textPrimary">{t("battle.loser")}</div>
                  <Link href="/battle" className="text-[9px] font-black text-edu-primary uppercase tracking-widest hover:underline underline-offset-4">{t("battle.lobby.back")}</Link>
               </div>
            )}
         </div>

         {/* Player 2 */}
         <div className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${isPlayer2 ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20" : "bg-gray-50 border-gray-100 dark:bg-zinc-900 dark:border-zinc-800"}`}>
            <div className="flex flex-col text-right">
               <span className="text-[10px] font-black uppercase text-gray-400">{t("leaderboard.ranking") === "Peta" ? "Pemain 2" : "Player 2"}</span>
               <span className="text-sm font-black text-gray-900 dark:text-white truncate max-w-[120px]">{room.player2?.name || "???"}</span>
               <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">{room.player2Done ? t("battle.submitted") : room.player2 ? t("battle.status.coding") : (t("leaderboard.ranking") === "Peta" ? "Kosong" : "Empty")}</span>
                  {room.player2 ? (
                    room.player2Done ? (
                      room.player2Result === "success" ? <Check size={14} className="text-emerald-500" /> : <X size={14} className="text-rose-500" />
                    ) : <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  ) : <div className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-pulse" />}
               </div>
            </div>
            {room.player2 ? (
              <UserAvatar src={room.player2?.image || ""} size={48} className="rounded-xl shadow-md" />
            ) : (
              <div className="h-12 w-12 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-gray-400">?</div>
            )}
         </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-white dark:bg-black overflow-hidden relative">
         {/* Left Side: Challenge Description */}
         <div className="w-full md:w-1/3 bg-gray-50/50 dark:bg-zinc-900/10 border-r border-gray-100 dark:border-zinc-800/50 overflow-y-auto p-8 custom-scrollbar">
            {challenge ? (
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                        <Info size={20} />
                     </div>
                     <h3 className="text-xl font-black text-edu-textPrimary tracking-tight">{challenge.title}</h3>
                  </div>
                  <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm leading-relaxed text-edu-textSecondary text-sm">
                     {challenge.description}
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={12} className="text-edu-xp" /> Test Cases
                     </h4>
                     <div className="space-y-3">
                        {challenge.testCases.map((tc, idx) => (
                           <div key={idx} className="p-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-800/50 border border-transparent font-mono text-[13px] space-y-2">
                              <div className="flex items-center gap-2">
                                 <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">In:</span> {tc.input}
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">Out:</span> {tc.expectedOutput.trim()}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <Sword size={48} className="text-gray-400" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{t("battle.status.empty")}</p>
               </div>
            )}
         </div>

         {/* Right Side: Code Editor (Hidden on Mobile) */}
         <div className="hidden md:flex flex-1 flex-col min-w-0 bg-edu-codeBg relative group">
            {room.status === "active" ? (
               <>
                  <Editor
                    height="100%"
                    language="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    options={{
                       fontSize: 14,
                       fontFamily: 'JetBrains Mono, Menlo, monospace',
                       minimap: { enabled: false },
                       padding: { top: 32 },
                       scrollBeyondLastLine: false,
                       lineNumbersMinChars: 3,
                       renderLineHighlight: "all",
                    }}
                  />
                  
                  {/* Bottom Action Bar */}
                  <div className="absolute bottom-10 left-10 right-10 z-20">
                     <div className="flex items-center justify-between p-4 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                        <div className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-2">Language: Python 3.10</div>
                        <button 
                           onClick={handleSubmit}
                           disabled={submitting || done}
                           className="flex items-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                           {submitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} 
                           {done ? t("battle.submitted") : t("battle.submit")}
                        </button>
                     </div>
                  </div>
               </>
            ) : room.status === "finished" ? (
               <div className="h-full bg-edu-codeBg flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0,transparent_70%)]" />
                  <div className={`relative z-10 space-y-6 ${room.winnerId === session?.user?.id ? "scale-110" : ""}`}>
                     <div className={`mx-auto h-24 w-24 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-1000 ${room.winnerId === session?.user?.id ? "bg-orange-400 rotate-12" : "bg-gray-700 -rotate-12"}`}>
                        {room.winnerId === session?.user?.id ? <Trophy size={48} className="text-white" /> : <X size={48} className="text-white" />}
                     </div>
                     <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
                           {room.winnerId === session?.user?.id ? t("battle.winner") : t("battle.loser")}
                        </h2>
                        <p className="text-white/60 font-bold uppercase tracking-widest text-xs">
                           {room.winnerId === session?.user?.id 
                               ? (t("leaderboard.ranking") === "Peta" ? "Lawan Anda telah tumbang oleh logika tajam Anda." : "Your opponent has fallen to your sharp logic.")
                               : `${t("leaderboard.ranking") === "Peta" ? "Pemenang" : "Winner"}: ${room.winnerId === room.player1Id ? room.player1?.name : room.player2?.name}`}
                        </p>
                     </div>
                     <Link href="/battle" className="inline-block mt-8 py-4 px-10 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">{t("battle.playAgain")}</Link>
                  </div>
               </div>
            ) : (
               <div className="h-full flex items-center justify-center opacity-20 relative overflow-hidden">
                   <div className="absolute inset-0 bg-grid-white/[0.05]" />
                   <Sword size={200} className="text-white animate-pulse" />
               </div>
            )}
         </div>
         
         {/* Mobile Missing Editor Warning */}
         <div className="flex md:hidden flex-1 bg-edu-codeBg items-center justify-center p-8 text-center border-t border-gray-100 dark:border-zinc-800">
            <div className="text-white/50 text-xs font-black uppercase tracking-[0.2em] space-y-4">
               <Sword size={32} className="mx-auto text-white/20 mb-2" />
               <div>{t("leaderboard.ranking") === "Peta" ? "Gunakan Desktop untuk Menulis Kode" : "Please use desktop to write code"}</div>
            </div>
         </div>
      </div>

      {error && <div className="fixed bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl z-50 animate-bounce">{error}</div>}

      <style jsx>{`
        .bg-grid-white { background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
