"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Sword, Plus, DoorOpen, Loader2 } from "lucide-react";

export default function BattleLobby() {
  const router = useRouter();
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
        setError("Gagal membuat room. Silakan coba lagi.");
      }
    } catch (e) {
      setError("Kesalahan koneksi.");
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
        setError(err.error || "Gagal bergabung. Periksa ID Room.");
      }
    } catch (e) {
      setError("Kesalahan koneksi.");
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
              <Sword size={14} /> 1v1 Battle Arena
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-edu-textPrimary tracking-tight">Kalahkan Lawan Dengan <span className="text-edu-primary">Kecepatan Logika</span></h1>
           <p className="text-edu-textSecondary max-w-xl mx-auto font-medium">Buktikan kemampuan coding Anda dalam pertempuran real-time. Siapa yang lebih cepat dan akurat?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
           {/* Create Section */}
           <div className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl flex flex-col items-center text-center group hover:border-edu-primary/30 transition-all">
              <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
                 <Plus size={40} />
              </div>
              <h2 className="text-2xl font-black text-edu-textPrimary mb-4">Mulai Tantangan</h2>
              <p className="text-sm text-edu-textSecondary mb-8 leading-relaxed">Buat room baru dan bagikan ID-nya kepada teman Anda untuk mulai bertanding secara langsung.</p>
              <button 
                onClick={handleCreate}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Buat Room Baru"}
              </button>
           </div>

           {/* Join Section */}
           <div className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl flex flex-col items-center text-center group hover:border-edu-streak/30 transition-all">
              <div className="h-20 w-20 bg-orange-50 dark:bg-orange-900/20 rounded-[2rem] flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform">
                 <DoorOpen size={40} />
              </div>
              <h2 className="text-2xl font-black text-edu-textPrimary mb-4">Masuk Arena</h2>
              <p className="text-sm text-edu-textSecondary mb-8 leading-relaxed">Punya ID Room dari teman? Masukkan di bawah ini untuk bergabung ke dalam pertempuran.</p>
              <div className="w-full space-y-4">
                 <input 
                   type="text" 
                   value={roomId}
                   onChange={(e) => setRoomId(e.target.value)}
                   placeholder="Masukkan ID Room..." 
                   className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl text-center font-bold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 ring-orange-400 transition-all"
                 />
                 <button 
                   onClick={handleJoin}
                   disabled={loading || !roomId}
                   className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="animate-spin mx-auto" /> : "Bergabung Sekarang"}
                 </button>
              </div>
           </div>
        </div>

        {error && <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-bold text-sm">{error}</div>}

      </main>
    </div>
  );
}
