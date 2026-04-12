"use client";

import { useMemo } from "react";
import { Zap, Flame, Trophy } from "lucide-react";

export function getLevelInfo(xp: number) {
  if (xp < 100) return { level: 1, min: 0, max: 100, title: "Novice Coder" };
  if (xp < 250) return { level: 2, min: 100, max: 250, title: "Code Learner" };
  if (xp < 500) return { level: 3, min: 250, max: 500, title: "Script Kiddie" };
  if (xp < 1000) return { level: 4, min: 500, max: 1000, title: "Logic Builder" };
  if (xp < 2000) return { level: 5, min: 1000, max: 2000, title: "Algorithm Master" };
  return { level: 6, min: 2000, max: 2000, title: "KodeIn Legend" };
}

export function XPBar({ xp, streak }: { xp: number, streak: number }) {
  const { level, min, max, title } = useMemo(() => getLevelInfo(xp), [xp]);
  
  const pct = max === min ? 100 : Math.max(0, Math.min(100, ((xp - min) / (max - min)) * 100));

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Kolom 1: Level & XP Bar (Ambil 2 kolom) */}
      <div className="col-span-2 rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg text-2xl font-black ring-4 ring-indigo-50 dark:ring-indigo-900/40">
              {level}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">Level {level}</div>
              <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{title}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-black text-gray-900 dark:text-white flex items-center justify-end gap-1">
              <Zap size={20} className="text-amber-500" />
              {xp}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mt-1">Total XP</div>
          </div>
        </div>

        <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-900">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold text-gray-400 dark:text-zinc-500">
          <span>{min} XP</span>
          {max > min ? <span>{max} XP</span> : <span>MAX LEVEL</span>}
        </div>
      </div>

      {/* Kolom 2: Streak Mini Card */}
      <div className="col-span-1 rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-center items-center text-center">
        <div className={`flex h-16 w-16 mb-4 items-center justify-center rounded-[24px] shadow-sm ${streak > 0 ? "bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400" : "bg-gray-100 text-gray-400 dark:bg-zinc-900"}`}>
           <Flame size={32} strokeWidth={streak > 0 ? 2.5 : 2} />
        </div>
        <div className="text-3xl font-black text-gray-900 dark:text-white">{streak}</div>
        <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-1">Day Streak</div>
      </div>
    </div>
  );
}
