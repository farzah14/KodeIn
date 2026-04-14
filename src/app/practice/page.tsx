"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { practiceChallenges } from "@/lib/practiceChallenges";
import { Trophy, Zap, Code2, ArrowRight, Star, Search, Filter, Check } from "lucide-react";
import Link from "next/link";

export default function PracticeListPage() {
  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          // The API returns normalized data in completedStepIds
          const practice = data.completedStepIds?.practice || [];
          setCompletedIds(practice);
        }
      } catch (e) {
        console.error("Failed to fetch progress");
      }
    };
    fetchProgress();
  }, []);

  const filteredChallenges = practiceChallenges.filter(c => {
    const matchesFilter = filter === "All" || c.difficulty === filter || c.category === filter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-edu-bg transition-colors duration-500 flex flex-col">
      <Topbar />

      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[3rem] bg-indigo-600 p-10 md:p-16 mb-12 shadow-2xl shadow-indigo-600/20 group">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
           <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                 <Trophy size={14} className="text-orange-400" /> Level Up Your Logic
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                 Asah Kemampuan <br/> <span className="text-indigo-200">Competitive Programming</span> Kamu.
              </h1>
              <p className="text-indigo-100/70 font-medium leading-relaxed mb-8">
                 Selesaikan tantangan algoritma harian untuk mendapatkan XP tambahan dan naiki peringkat di leaderboard global.
              </p>
              <div className="flex flex-wrap gap-8">
                 <div className="flex flex-col">
                    <span className="text-3xl font-black text-white">{practiceChallenges.length}</span>
                    <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Soal Tersedia</span>
                 </div>
                 <div className="w-px h-10 bg-white/20" />
                 <div className="flex flex-col">
                    <span className="text-3xl font-black text-white">{practiceChallenges.filter(c => c.difficulty === 'Easy').length}</span>
                    <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Easy Level</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
           <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm w-full md:w-auto">
              <div className="pl-4 text-gray-400"><Search size={18} /></div>
              <input 
                type="text" 
                placeholder="Cari tantangan..."
                className="bg-transparent border-none outline-none px-2 py-2 text-sm font-bold w-full md:w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {["All", "Easy", "Medium", "Logic", "Array", "String"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-zinc-900 text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-zinc-800'}`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredChallenges.map(challenge => (
             <Link 
               href={`/practice/${challenge.id}`} 
               key={challenge.id}
               className="group relative flex flex-col p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-500 overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -rotate-12 translate-x-4 -translate-y-4">
                   <Code2 size={120} className="text-indigo-600/5" />
                </div>

                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${challenge.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-500 border-emerald-500/10' : 'bg-amber-50 text-amber-500 border-amber-500/10'}`}>
                         {challenge.difficulty}
                      </div>
                      {completedIds.includes(challenge.id) && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-300">
                           <Check size={10} strokeWidth={4} /> Done
                        </div>
                      )}
                   </div>
                   <div className="flex items-center gap-1.5 text-edu-xp font-black">
                      <Zap size={14} fill="currentColor" />
                      <span className="text-xs">{challenge.xp} XP</span>
                   </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                   {challenge.title}
                </h3>
                <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium leading-relaxed mb-8 line-clamp-2">
                   {challenge.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{challenge.category}</span>
                   <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                      Mulai <ArrowRight size={14} />
                   </div>
                </div>
             </Link>
           ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 opacity-50 grayscale">
             <Filter size={64} className="text-gray-300" />
             <div>
                <p className="text-lg font-black text-gray-900 dark:text-white">Tidak ada tantangan ditemukan</p>
                <p className="text-sm font-medium text-gray-500">Coba ubah filter atau pencarianmu.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
