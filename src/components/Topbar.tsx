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
    <header className="sticky top-0 z-50 w-full bg-edu-bg border-b border-edu-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LEFT: Branding */}
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-edu-surface1 border border-edu-border text-edu-primary">
            <Code2 size={18} />
          </div>
          <div className="text-xl font-bold tracking-tight text-edu-textPrimary">
            KodeIn
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-end gap-6 text-[14px]">
          {isAuthed && (
            <div className="flex items-center gap-6 mr-4">
               <Link href="/learn" className="text-edu-textSecondary hover:text-edu-textPrimary transition-colors font-medium">
                  Map
               </Link>
               <Link href="/practice" className="text-edu-textSecondary hover:text-edu-textPrimary transition-colors font-medium">
                  Practice
               </Link>
            </div>
          )}

          {/* Gamification Stats */}
          {isAuthed && (
             <div className="flex items-center gap-4 border-l border-edu-divider pl-6">
                <Link href="/profile" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-edu-surface2 border border-edu-primary/30 hover:border-edu-primary transition-colors">
                  <Trophy size={14} className="text-edu-primary" />
                  <span className="text-xs font-semibold text-edu-primary uppercase tracking-wider">Level {getLevelInfo(p.xp).level}</span>
                </Link>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-edu-surface1 border border-edu-border">
                  <Flame size={14} className={p.streak.current > 0 ? "text-edu-streak" : "text-edu-textMuted"} />
                  <span className={`text-xs font-semibold ${p.streak.current > 0 ? "text-edu-streak" : "text-edu-textMuted"}`}>
                    {p.streak.current}
                  </span>
                </div>
             </div>
          )}

          {/* Auth Button */}
          {isAuthLoading ? (
            <div className="h-9 w-9 rounded-full bg-edu-surface2 animate-pulse" />
          ) : isAuthed && session?.user ? (
            <div className="pl-4 ml-2 border-l border-edu-divider">
              <Link href="/profile" className="block active:scale-90 transition-transform">
                <UserAvatar src={userSeed} size={36} className="h-9 w-9 rounded-full" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-4 ml-2 border-l border-edu-divider">
              <Link href="/login" className="px-4 py-2 text-sm font-semibold bg-edu-primary text-white rounded-lg hover:bg-edu-primaryHover transition-colors focus:outline-none focus:ring-2 focus:ring-edu-primary focus:ring-offset-2 focus:ring-offset-edu-bg">
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
           {isAuthed && !isAuthLoading && (
             <Link href="/profile" className="flex items-center gap-1">
               <Flame size={16} className={p.streak.current > 0 ? "text-edu-streak" : "text-edu-textMuted"} />
               <span className={`text-sm font-semibold ${p.streak.current > 0 ? "text-edu-streak" : "text-edu-textMuted"}`}>{p.streak.current}</span>
             </Link>
           )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -mr-2 text-edu-textSecondary hover:text-edu-textPrimary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full bg-edu-surface1 border-b border-edu-border p-4 md:hidden">
          <div className="flex flex-col gap-2">
            
            {isAuthed && session?.user ? (
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-edu-surface2 mb-4">
                <UserAvatar src={userSeed} size={48} className="h-12 w-12 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-edu-textPrimary truncate">{session.user.name || "Student"}</div>
                  <div className="text-xs text-edu-textSecondary truncate">{session.user.email}</div>
                </div>
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full px-4 py-3 text-sm text-center font-semibold bg-edu-primary text-white rounded-lg mb-4">
                Sign In
              </Link>
            )}

            {isAuthed && (
               <>
                 <Link href="/learn" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-edu-textSecondary hover:text-edu-textPrimary hover:bg-edu-surface2 rounded-lg">
                    <Map size={18} /> Course Map
                 </Link>
                 <Link href="/practice" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-edu-textSecondary hover:text-edu-textPrimary hover:bg-edu-surface2 rounded-lg">
                    <Code2 size={18} /> Practice
                 </Link>
                 <div className="h-px bg-edu-border my-2" />
                 <button
                   onClick={handleSignOut}
                   className="flex items-center gap-3 p-3 text-sm font-medium text-edu-error hover:bg-edu-error/10 w-full text-left rounded-lg"
                 >
                   <LogOut size={18} /> Sign Out
                 </button>
               </>
            )}

          </div>
        </div>
      )}
    </header>
  );
}