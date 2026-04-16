"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/Topbar";
import { UserAvatar } from "@/components/UserAvatar";
import { Flame, Zap, RefreshCw, Crown, Trophy as TrophyIcon, CheckCircle } from "lucide-react";
import { getLevelInfo } from "@/components/XPBar";
import { useTranslation } from "@/lib/i18n";

type LeaderboardEntry = {
  id: string;
  name: string;
  image: string;
  xp: number;
  streak: number;
  solvedPractice: number;
};

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"xp" | "practice">("xp");

  async function fetchLeaderboard() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setData(j);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (activeTab === "xp") return b.xp - a.xp;
      return b.solvedPractice - a.solvedPractice;
    }).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [data, activeTab]);

  const topThree = useMemo(() => sortedData.slice(0, 3), [sortedData]);

  const currentUserId = session?.user?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-edu-bg">
        <Topbar />
        <div className="flex flex-col items-center justify-center pt-32 gap-4">
           <div className="h-12 w-12 border-4 border-edu-primary/30 border-t-edu-primary rounded-full animate-spin" />
           <div className="text-edu-textSecondary font-bold uppercase tracking-widest text-xs">{t("leaderboard.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-edu-bg transition-colors duration-500">
      <Topbar />

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20 lg:py-24">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
           <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-edu-xp/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-edu-xp border border-edu-xp/20">
                <TrophyIcon size={12} strokeWidth={3} /> {t("leaderboard.ranking")}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-edu-textPrimary leading-none">
                 {t("leaderboard.title").split(" ").map((word, i, arr) => (
                   i === arr.length - 1 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-edu-primary via-edu-streak to-edu-xp">{word}</span> : word + " "
                 ))}
              </h1>
              
              {/* CATEGORY SWITCHER */}
              <div className="flex items-center justify-center md:justify-start gap-1 p-1 bg-edu-surface2 border border-edu-border rounded-xl w-fit mx-auto md:mx-0">
                 <button 
                   onClick={() => setActiveTab("xp")}
                   className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'xp' ? 'bg-edu-primary text-white shadow-md' : 'text-edu-textSecondary hover:text-edu-textPrimary'}`}
                 >
                   {t("leaderboard.tabs.xp")}
                 </button>
                 <button 
                   onClick={() => setActiveTab("practice")}
                   className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'practice' ? 'bg-edu-primary text-white shadow-md' : 'text-edu-textSecondary hover:text-edu-textPrimary'}`}
                 >
                   {t("leaderboard.tabs.practice")}
                 </button>
              </div>
           </div>
           
           <button 
             onClick={fetchLeaderboard}
             disabled={refreshing}
             className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-edu-surface1 border border-edu-border text-edu-textPrimary font-bold text-xs uppercase tracking-widest hover:bg-edu-surface2 transition-all active:scale-95 disabled:opacity-50"
           >
             <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> {t("leaderboard.refresh")}
           </button>
        </div>

        {/* PODIUM SECTION */}
        {topThree.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 mb-20 md:mb-24">
            
            {/* Rank 2 */}
            {topThree[1] && (
               <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center">
                  <Link href={`/profile/${topThree[1].id}`} className="relative group mb-4 block active:scale-95 transition-transform">
                     <UserAvatar src={topThree[1].image} size={80} className="rounded-full shadow-2xl border-4 border-gray-300 dark:border-zinc-500 ring-8 ring-transparent group-hover:ring-gray-300/10 transition-all" />
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-300 dark:bg-zinc-500 text-white font-black text-[10px] px-3 py-0.5 rounded-full shadow-lg h-6 flex items-center justify-center">#2</div>
                  </Link>
                  <div className="text-center mb-6">
                    <Link href={`/profile/${topThree[1].id}`} className="font-black text-edu-textPrimary truncate max-w-[150px] hover:text-edu-primary transition-colors block">{topThree[1].name}</Link>
                    <div className="text-[10px] font-bold text-edu-textSecondary uppercase tracking-widest">{getLevelInfo(topThree[1].xp).title}</div>
                  </div>
                  <div className="w-full max-w-[180px] h-[100px] bg-gradient-to-t from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-t-3xl flex flex-col items-center justify-center gap-1 shadow-lg border-x border-t border-gray-200 dark:border-zinc-700">
                     <div className="flex items-center gap-1.5 text-edu-textPrimary font-black">
                        {activeTab === 'xp' ? (
                           <>
                              <Zap size={14} className="text-edu-primary" /> {topThree[1].xp}
                           </>
                        ) : (
                           <>
                              <CheckCircle size={14} className="text-emerald-500" /> {topThree[1].solvedPractice}
                           </>
                        )}
                     </div>
                     <span className="text-[9px] font-bold text-edu-textSecondary uppercase tracking-widest">{activeTab === 'xp' ? t("leaderboard.experience") : t("leaderboard.stats.solved")}</span>
                  </div>
               </div>
            )}

            {/* Rank 1 */}
            {topThree[0] && (
               <div className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center z-10">
                  <Link href={`/profile/${topThree[0].id}`} className="relative group mb-4 block active:scale-95 transition-transform">
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-orange-400 animate-bounce">
                        <Crown size={40} strokeWidth={2.5} />
                     </div>
                     <UserAvatar src={topThree[0].image} size={110} className="rounded-full shadow-2xl border-4 border-orange-400 ring-8 ring-transparent group-hover:ring-orange-400/10 transition-all scale-110 md:scale-125" />
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white font-black text-xs px-4 py-1 rounded-full shadow-lg h-7 flex items-center justify-center">#1</div>
                  </Link>
                  <div className="text-center pt-4 mb-6">
                    <Link href={`/profile/${topThree[0].id}`} className="font-black text-edu-textPrimary text-lg truncate max-w-[200px] hover:text-orange-400 transition-colors block">{topThree[0].name}</Link>
                    <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{getLevelInfo(topThree[0].xp).title}</div>
                  </div>
                  <div className="w-full max-w-[220px] h-[160px] bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-2xl relative overflow-hidden group">
                     {/* Decorative Shine */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                     
                     <div className="flex items-center gap-2 text-white text-xl font-black">
                        {activeTab === 'xp' ? (
                           <>
                              <Zap size={20} className="text-white fill-white/20" /> {topThree[0].xp}
                           </>
                        ) : (
                           <>
                              <CheckCircle size={20} className="text-white fill-white/20" /> {topThree[0].solvedPractice}
                           </>
                        )}
                     </div>
                     <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{activeTab === 'xp' ? t("leaderboard.master") : t("leaderboard.stats.elite")}</span>
                  </div>
               </div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
               <div className="w-full md:w-1/3 order-3 flex flex-col items-center">
                  <Link href={`/profile/${topThree[2].id}`} className="relative group mb-4 block active:scale-95 transition-transform">
                     <UserAvatar src={topThree[2].image} size={80} className="rounded-full shadow-2xl border-4 border-orange-700/50 dark:border-orange-900/50 ring-8 ring-transparent group-hover:ring-orange-800/10 transition-all" />
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-800 text-white font-black text-[10px] px-3 py-0.5 rounded-full shadow-lg h-6 flex items-center justify-center">#3</div>
                  </Link>
                  <div className="text-center mb-6">
                    <Link href={`/profile/${topThree[2].id}`} className="font-black text-edu-textPrimary truncate max-w-[150px] hover:text-orange-700 transition-colors block">{topThree[2].name}</Link>
                    <div className="text-[10px] font-bold text-edu-textSecondary uppercase tracking-widest">{getLevelInfo(topThree[2].xp).title}</div>
                  </div>
                  <div className="w-full max-w-[180px] h-[80px] bg-gradient-to-t from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-t-3xl flex flex-col items-center justify-center gap-1 shadow-lg border-x border-t border-gray-200 dark:border-zinc-700">
                     <div className="flex items-center gap-1.5 text-edu-textPrimary font-black text-sm">
                        {activeTab === 'xp' ? (
                           <>
                              <Zap size={14} className="text-edu-primary" /> {topThree[2].xp}
                           </>
                        ) : (
                           <>
                              <CheckCircle size={14} className="text-emerald-500" /> {topThree[2].solvedPractice}
                           </>
                        )}
                     </div>
                     <span className="text-[9px] font-bold text-edu-textSecondary uppercase tracking-widest">{activeTab === 'xp' ? t("leaderboard.progress") : t("leaderboard.stats.solved")}</span>
                  </div>
               </div>
            )}

          </div>
        )}

        {/* LIST SECTION */}
        <div className="bg-edu-surface1 border border-edu-border rounded-[2rem] overflow-hidden shadow-xl mb-24">
          <div className="px-8 py-6 border-b border-edu-border bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-edu-textPrimary uppercase tracking-widest">{t("leaderboard.ranking")}</h3>
            <span className="text-[10px] font-bold text-edu-textSecondary uppercase tracking-[0.2em]">{data.length} {t("leaderboard.totalUsers")}</span>
          </div>

          <div className="divide-y divide-edu-border">
            {sortedData.length > 0 ? sortedData.map((u) => {
              const info = getLevelInfo(u.xp);
              const isUser = u.id === currentUserId || u.name === session?.user?.name;

              return (
                <div 
                  key={u.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-6 transition-all ${isUser ? "bg-edu-primary/5 dark:bg-edu-primary/10" : "hover:bg-gray-50/50 dark:hover:bg-zinc-900/50"}`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-8 text-center text-sm font-black text-edu-textMuted font-mono">#{u.rank}</div>
                    <Link href={`/profile/${u.id}`} className="block active:scale-95 transition-transform">
                      <UserAvatar src={u.image} size={48} className="rounded-xl shadow-md border-2 border-edu-border" />
                    </Link>
                    <div>
                      <div className="font-bold text-edu-textPrimary flex items-center gap-2">
                        <Link href={`/profile/${u.id}`} className="hover:text-edu-primary transition-colors">{u.name}</Link>
                        {isUser && <span className="bg-edu-primary/10 text-edu-primary text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{t("leaderboard.you")}</span>}
                      </div>
                      <div className="text-[10px] font-bold text-edu-textSecondary uppercase tracking-wider flex items-center gap-2">
                        {info.title} <span className="text-edu-border">•</span> Level {info.level}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 pl-14 sm:pl-0">
                    <div className="hidden sm:flex flex-col items-end">
                       <span className="text-[9px] font-black text-edu-textSecondary uppercase tracking-widest leading-none mb-1">
                         {activeTab === 'xp' ? t("leaderboard.points") : t("leaderboard.stats.solved")}
                       </span>
                       <div className="text-lg font-black text-edu-textPrimary leading-none">
                         {activeTab === 'xp' ? u.xp : u.solvedPractice}
                       </div>
                    </div>
                    <div className="flex flex-col items-end min-w-[70px]">
                       <span className="text-[9px] font-black text-edu-textSecondary uppercase tracking-widest leading-none mb-1">Streak</span>
                       <div className="flex items-center gap-1.5 text-edu-streak font-black text-lg leading-none">
                          <Flame size={16} fill="currentColor" /> {u.streak}
                       </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-edu-textSecondary font-medium">{t("leaderboard.empty")}</div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
