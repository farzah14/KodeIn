"use client";

import { useEffect, useState, use } from "react";
import { Topbar } from "@/components/Topbar";
import { UserAvatar } from "@/components/UserAvatar";
import { getLevelInfo } from "@/components/XPBar";
import { Flame, Zap, Trophy, Calendar } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type PublicProfile = {
  id: string;
  name: string;
  image: string;
  stats: {
    xp: number;
    streakCurrent: number;
    streakLongest: number;
    updatedAt: string;
  };
};

export default function PublicProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const { t } = useTranslation();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-edu-bg">
        <Topbar />
        <div className="flex flex-col items-center justify-center pt-32 gap-4">
           <div className="h-12 w-12 border-4 border-edu-primary/30 border-t-edu-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-edu-bg">
        <Topbar />
        <div className="flex flex-col items-center justify-center pt-32 gap-4">
           <div className="text-edu-textSecondary font-bold">User not found</div>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(profile.stats.xp);

  return (
    <div className="min-h-screen bg-edu-bg transition-colors duration-500 pb-20">
      <Topbar />

      <main className="mx-auto max-w-4xl px-6 pt-16 md:pt-24">
        
        {/* Profile Card */}
        <div className="relative mb-12">
          {/* Header BG decoration */}
          <div className="h-48 md:h-64 w-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
             <div className="absolute inset-0 bg-grid-white/[0.05]" />
          </div>

          {/* User Info Overlay */}
          <div className="absolute -bottom-16 left-8 right-8 flex flex-col md:flex-row items-end md:items-center gap-6">
            <div className="relative group">
              <div className="p-1 rounded-[2.5rem] bg-white dark:bg-zinc-950 shadow-2xl">
                <UserAvatar src={profile.image} size={140} className="rounded-[2.2rem] shadow-inner" />
              </div>
              <div className="absolute -top-3 -right-3 h-10 w-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-zinc-950">
                <Zap size={20} className="fill-white" />
              </div>
            </div>

            <div className="flex-1 pb-4">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-2 drop-shadow-sm">{profile.name}</h1>
              <div className="flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20 whitespace-nowrap">
                   {levelInfo.title}
                 </span>
                 <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20 whitespace-nowrap">
                   Level {levelInfo.level}
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* Level & XP Stats */}
        <div className="mt-24 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 group p-8 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">{t("lesson.mastery")}</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">Level {levelInfo.level}</span>
                 </div>
                 <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                    <Trophy size={24} />
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div className="text-sm font-bold text-gray-400">
                      <span className="text-indigo-600 dark:text-indigo-400">{profile.stats.xp}</span> / {levelInfo.max} XP
                   </div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {Math.floor(((profile.stats.xp - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100)}%
                   </div>
                </div>
                <div className="h-4 w-full bg-gray-50 dark:bg-zinc-800 rounded-full border border-gray-100 dark:border-zinc-700 overflow-hidden p-1 shadow-inner">
                   <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      style={{ width: `${Math.floor(((profile.stats.xp - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100)}%` }}
                   />
                </div>
              </div>
           </div>

           <div className="p-8 rounded-[2rem] bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-2xl flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <Flame size={120} />
              </div>
              <div className="z-10">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">{t("topbar.streak")}</div>
                 <div className="text-4xl font-black">{profile.stats.streakCurrent}</div>
              </div>
              <div className="z-10 mt-8 flex flex-col gap-1">
                 <div className="text-[9px] font-black text-white/60 uppercase tracking-widest">Longest Streak</div>
                 <div className="font-bold flex items-center gap-2">
                    {profile.stats.streakLongest} Days
                 </div>
              </div>
           </div>
        </div>

        {/* Global Record */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-xl flex items-center gap-6">
              <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                 <Calendar size={28} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Status Keaktifan</div>
                 <div className="text-sm font-bold text-gray-900 dark:text-white">
                   {profile.stats.updatedAt ? `Aktif ${new Date(profile.stats.updatedAt).toLocaleDateString()}` : "Baru Bergabung"}
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-xl flex items-center gap-6">
              <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
                 <Zap size={28} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Total Poin</div>
                 <div className="text-sm font-bold text-gray-900 dark:text-white">
                   {profile.stats.xp} XP Earned
                 </div>
              </div>
           </div>
        </div>

      </main>
      <style jsx>{`
        .bg-grid-white { background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px; }
      `}</style>
    </div>
  );
}
