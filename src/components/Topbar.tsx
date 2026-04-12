"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, Map, Flame, Trophy, TerminalSquare, Code2 } from "lucide-react";

import { useProgress } from "@/lib/useProgress";
import { resetProgressStore } from "@/lib/progressStore";
import { Avatar3D } from "@/components/Avatar3D";
import { getLevelInfo } from "@/components/XPBar";

function PremiumPill({
  icon,
  label,
  value,
  isLoading,
  colorClass
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLoading?: boolean;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white/50 px-3 py-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:bg-zinc-900">
      <div className={colorClass}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">{label}</span>
        {isLoading ? (
          <span className="mt-1 h-3 w-8 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
        ) : (
          <span className="text-sm font-black text-gray-900 leading-none mt-0.5 dark:text-white">{value}</span>
        )}
      </div>
    </div>
  );
}

export function Topbar() {
  const p = useProgress();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthed = status === "authenticated";
  const isAuthLoading = status === "loading";
  const showProgressLoading = isAuthLoading;

  async function handleSignOut() {
    resetProgressStore();
    await signOut({ callbackUrl: "/" });
  }

  const userSeed = (session?.user?.image?.trim() || session?.user?.email?.trim() || session?.user?.name?.trim() || "anonymous") as string;
  const lvl = getLevelInfo(p.xp);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/70 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* LEFT: Premium Brand */}
        <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
            <TerminalSquare size={22} strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
              KodeIn
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              Learn coding by doing
            </div>
          </div>
        </Link>

        {/* RIGHT DESKTOP */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          
          {/* Quick Nav */}
          {isAuthed && (
            <div className="flex mr-4 gap-2">
               <Link href="/learn" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors">
                  <Map size={16} /> Course
               </Link>
               <Link href="/practice" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400 transition-colors">
                  <Code2 size={16} /> Playground
               </Link>
            </div>
          )}

          {/* Gamification Stats */}
          {isAuthed && (
             <div className="flex gap-2">
                <Link href="/profile">
                  <PremiumPill 
                    icon={<Trophy size={16} />} 
                    label="Lvl" 
                    value={lvl.level} 
                    isLoading={showProgressLoading}
                    colorClass="text-indigo-500"
                  />
                </Link>
                <PremiumPill 
                  icon={<Flame size={16} />} 
                  label="Streak" 
                  value={p.streak.current} 
                  isLoading={showProgressLoading}
                  colorClass={p.streak.current > 0 ? "text-orange-500" : "text-gray-300"}
                />
             </div>
          )}

          {/* Auth Button */}
          {isAuthLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800" />
          ) : isAuthed && session?.user ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-zinc-800">
              <Link
                href="/profile"
                className="group relative h-10 w-10 hover:scale-105 transition-transform"
              >
                <Avatar3D seed={userSeed} size={40} className="h-10 w-10 ring-2 ring-transparent group-hover:ring-indigo-500" />
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20 transition-all hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-black dark:shadow-white/10 dark:hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* RIGHT MOBILE */}
        <div className="flex items-center gap-3 md:hidden">
           {isAuthed && !isAuthLoading && (
             <Link href="/profile" className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 dark:border-orange-900/30 dark:bg-orange-900/10">
               <Flame size={14} className="text-orange-500" />
               <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{p.streak.current}</span>
             </Link>
           )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100 text-gray-600 transition-transform active:scale-95 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-gray-200 bg-white/95 px-4 py-6 shadow-2xl backdrop-blur-xl md:hidden dark:border-zinc-800 dark:bg-black/95">
          <div className="flex flex-col gap-6">
            
            {isAuthed && session?.user ? (
              <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-gray-50/50 p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Avatar3D seed={userSeed} size={56} className="h-14 w-14 shadow-sm" />
                </Link>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white">{session.user.name || "User"}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400">{session.user.email}</div>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="mt-1 inline-block text-xs font-bold text-indigo-500">Lihat Profile &rarr;</Link>
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full rounded-2xl bg-gray-900 py-3 text-center font-bold text-white shadow-lg dark:bg-white dark:text-black">
                Sign In
              </Link>
            )}

            <div className="grid grid-cols-2 gap-3">
               <Link href="/learn" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm active:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:active:bg-zinc-900">
                  <Map size={24} className="text-indigo-500" />
                  <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">Course Map</span>
               </Link>
               <Link href="/practice" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm active:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:active:bg-zinc-900">
                  <Code2 size={24} className="text-cyan-500" />
                  <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">Playground</span>
               </Link>
            </div>

            {isAuthed && (
               <div className="flex justify-between gap-3 px-2">
                 <div className="text-center">
                    <div className="text-[10px] font-bold uppercase text-gray-400">Level</div>
                    <div className="text-lg font-black text-indigo-500">{lvl.level}</div>
                 </div>
                 <div className="text-center">
                    <div className="text-[10px] font-bold uppercase text-gray-400">Total XP</div>
                    <div className="text-lg font-black text-amber-500">{p.xp}</div>
                 </div>
                 <div className="text-center">
                    <div className="text-[10px] font-bold uppercase text-gray-400">Streak</div>
                    <div className="text-lg font-black text-orange-500">{p.streak.current}</div>
                 </div>
               </div>
            )}

            {isAuthed && (
              <button
                onClick={handleSignOut}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-sm font-bold text-red-600 active:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:active:bg-red-900/20"
              >
                <LogOut size={18} /> Sign Out
              </button>
            )}

          </div>
        </div>
      )}
    </header>
  );
}