"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Sword, Plus, DoorOpen, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function BattleLobby() {
  const router = useRouter();
  const { t } = useTranslation();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/battle/create", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        router.push(`/battle/${data.roomId}`);
      } else {
        setError(t("common.error"));
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!roomId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/battle/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId })
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/battle/${data.roomId}`);
      } else {
        const err = await res.json();
        setError(err.error || t("common.error"));
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-edu-bg transition-colors duration-500">
      <Topbar />

      <main className="mx-auto max-w-4xl px-6 py-20 lg:py-32">
        <div className="text-center mb-16 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-edu-error/10 text-edu-error border border-edu-error/20 rounded-full text-xs font-black uppercase tracking-widest">
              <Sword size={14} /> {t("battle.arena")}
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-edu-textPrimary tracking-tight">
              {t("battle.hero.title").split(" ").map((word, i, arr) => (
                 i >= arr.length - 2 ? <span key={i} className="text-edu-primary">{word} </span> : word + " "
              ))}
           </h1>
           <p className="text-edu-textSecondary max-w-xl mx-auto font-medium">{t("battle.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
           {/* Create Section */}
           <div className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl flex flex-col items-center text-center group hover:border-edu-primary/30 transition-all">
              <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
                 <Plus size={40} />
              </div>
              <h2 className="text-2xl font-black text-edu-textPrimary mb-4">{t("battle.lobby.create")}</h2>
              <p className="text-sm text-edu-textSecondary mb-8 leading-relaxed">{t("battle.lobby.desc")}</p>
              <button 
                onClick={handleCreate}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : t("battle.lobby.create")}
              </button>
           </div>

           {/* Join Section */}
           <div className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl flex flex-col items-center text-center group hover:border-edu-streak/30 transition-all">
              <div className="h-20 w-20 bg-orange-50 dark:bg-orange-900/20 rounded-[2rem] flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform">
                 <DoorOpen size={40} />
              </div>
              <h2 className="text-2xl font-black text-edu-textPrimary mb-4">{t("battle.lobby.join")}</h2>
              <p className="text-sm text-edu-textSecondary mb-8 leading-relaxed">{t("battle.lobby.joinDesc")}</p>
              <div className="w-full space-y-4">
                 <input 
                   type="text" 
                   value={roomId}
                   onChange={(e) => setRoomId(e.target.value)}
                   placeholder={t("battle.lobby.placeholder")} 
                   className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl text-center font-bold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 ring-orange-400 transition-all"
                 />
                 <button 
                   onClick={handleJoin}
                   disabled={loading || !roomId}
                   className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="animate-spin mx-auto" /> : t("battle.lobby.join")}
                 </button>
              </div>
           </div>
        </div>

        {error && <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-bold text-sm">{error}</div>}

      </main>
    </div>
  );
}
