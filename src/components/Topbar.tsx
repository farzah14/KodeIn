"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, Map, Flame, Trophy, Code2 } from "lucide-react";

import { useProgress } from "@/lib/useProgress";
import { resetProgressStore } from "@/lib/progressStore";
import { UserAvatar } from "@/components/UserAvatar";
import { getLevelInfo } from "@/components/XPBar";

export function Topbar() {
  const p = useProgress();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthed = status === "authenticated";
  const isAuthLoading = status === "loading";

  async function handleSignOut() {
    resetProgressStore();
    await signOut({ callbackUrl: "/" });
  }

  const userSeed = (session?.user?.image?.trim() || session?.user?.email?.trim() || session?.user?.name?.trim() || "anonymous") as string;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 transition-colors duration-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LEFT: Branding */}
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
            <Code2 size={22} className="text-white" />
          </div>
          <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            KodeIn
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-end gap-8">
          {isAuthed && (
            <div className="flex items-center gap-8 mr-4">
               <Link href="/learn" className="text-sm font-bold text-gray-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
                  Map
               </Link>
               <Link href="/practice" className="text-sm font-bold text-gray-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
                  Practice
               </Link>
            </div>
          )}

          {/* Premium Gamification Stats */}
          {isAuthed && (
             <div className="flex items-center gap-6 border-l border-gray-100 dark:border-zinc-800 pl-8">
                <Link href="/profile" className="flex items-center gap-2 group">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 group-hover:scale-110 transition-transform">
                    <Trophy size={16} className="text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Level</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{getLevelInfo(p.xp).level}</span>
                  </div>
                </Link>

                <div className="flex items-center gap-2 group">
                  <div className={`p-2 rounded-xl border transition-transform group-hover:scale-110 ${p.streak.current > 0 ? "bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/50" : "bg-gray-50 border-gray-100 dark:bg-zinc-800 dark:border-zinc-700"}`}>
                    <Flame size={16} className={p.streak.current > 0 ? "text-orange-500" : "text-gray-400"} />
                  </div>
                   <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Streak</span>
                    <span className={`text-sm font-black leading-none ${p.streak.current > 0 ? "text-orange-500" : "text-gray-400"}`}>{p.streak.current}</span>
                  </div>
                </div>
             </div>
          )}

          {/* Auth Button */}
          {isAuthLoading ? (
            <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-zinc-800 animate-pulse" />
          ) : isAuthed && session?.user ? (
            <div className="pl-6 ml-2 border-l border-gray-100 dark:border-zinc-800">
              <Link href="/profile" className="block active:scale-90 transition-transform p-0.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500">
                <div className="p-0.5 bg-white dark:bg-zinc-950 rounded-[calc(1rem-2px)]">
                  <UserAvatar src={userSeed} size={36} className="h-9 w-9 rounded-[calc(1rem-4px)] shadow-sm" />
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-6 ml-2 border-l border-gray-100 dark:border-zinc-800">
              <Link href="/login" className="px-6 py-2.5 text-xs font-black bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all uppercase tracking-widest active:scale-95">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
           {isAuthed && !isAuthLoading && (
             <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50">
               <Flame size={16} className={p.streak.current > 0 ? "text-orange-500" : "text-gray-400"} />
               <span className={`text-sm font-black ${p.streak.current > 0 ? "text-orange-500" : "text-gray-400"}`}>{p.streak.current}</span>
             </Link>
           )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 text-gray-500 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Modern Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 p-6 md:hidden shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            
            {isAuthed && session?.user ? (
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-zinc-900/50 mb-4 border border-gray-100 dark:border-zinc-800">
                <UserAvatar src={userSeed} size={48} className="h-14 w-14 rounded-2xl shadow-md" />
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight">{session.user.name || "Student"}</div>
                  <div className="text-xs font-medium text-gray-400 truncate">{session.user.email}</div>
                </div>
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full px-4 py-4 text-sm text-center font-black bg-indigo-600 text-white rounded-3xl mb-4 shadow-lg shadow-indigo-600/20 uppercase tracking-widest">
                Get Started
              </Link>
            )}

            {isAuthed && (
               <>
                 <Link href="/learn" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 text-sm font-black text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-2xl transition-colors uppercase tracking-widest">
                    <Map size={20} /> Course Map
                 </Link>
                 <Link href="/practice" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 text-sm font-black text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-2xl transition-colors uppercase tracking-widest">
                    <Code2 size={20} /> Practice
                 </Link>
                 <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2" />
                 <button
                   onClick={handleSignOut}
                   className="flex items-center gap-4 p-4 text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-full text-left rounded-2xl transition-colors uppercase tracking-widest"
                 >
                   <LogOut size={20} /> Sign Out
                 </button>
               </>
            )}

          </div>
        </div>
      )}
    </header>
  );
}