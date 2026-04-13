"use client";

import { useMemo } from "react";
import { Zap, Flame, Trophy } from "lucide-react";

export function getLevelInfo(xp: number) {
  if (xp < 100) return { level: 1, min: 0, max: 100, title: "Novice" };
  if (xp < 250) return { level: 2, min: 100, max: 250, title: "Learner" };
  if (xp < 500) return { level: 3, min: 250, max: 500, title: "Coder" };
  if (xp < 1000) return { level: 4, min: 500, max: 1000, title: "Developer" };
  if (xp < 2000) return { level: 5, min: 1000, max: 2000, title: "Engineer" };
  return { level: 6, min: 2000, max: 2000, title: "Master" };
}

export function XPBar({ xp, streak }: { xp: number, streak: number }) {
  const { level, min, max, title } = useMemo(() => getLevelInfo(xp), [xp]);
  
  const pct = max === min ? 100 : Math.max(0, Math.min(100, ((xp - min) / (max - min)) * 100));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* XP & Progress Section */}
      <div className="md:col-span-2 bg-edu-surface1 border border-edu-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-edu-surface2 border border-edu-primary rounded-full">
              <Trophy size={16} className="text-edu-primary" />
              <div className="text-sm font-semibold text-edu-primary uppercase tracking-wider">Level {level}</div>
            </div>
            <div className="text-edu-textSecondary text-sm font-medium">{title}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-edu-textSecondary" />
            <div className="text-lg font-bold text-edu-textPrimary">{xp} <span className="text-sm font-normal text-edu-textSecondary">XP</span></div>
          </div>
        </div>

        <div className="w-full bg-edu-surface2 rounded-full h-3 mb-2 overflow-hidden border border-edu-border">
          <div 
            className="bg-edu-xp h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs font-semibold text-edu-textMuted uppercase tracking-widest mt-3">
          <span>{min} XP</span>
          {max > min ? <span>{max} XP Next</span> : <span>Max Level</span>}
        </div>
      </div>

      {/* Streak Section */}
      <div className="md:col-span-1 bg-edu-surface1 border border-edu-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 ${streak > 0 ? "bg-edu-streak/10 text-edu-streak" : "bg-edu-surface2 text-edu-textMuted"}`}>
           <Flame size={32} />
        </div>
        <div className="text-3xl font-bold text-edu-textPrimary mb-1">{streak}</div>
        <div className="text-xs font-semibold text-edu-textSecondary uppercase tracking-widest">Day Streak</div>
      </div>
    </div>
  );
}
