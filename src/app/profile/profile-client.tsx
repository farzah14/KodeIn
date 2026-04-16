"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ArrowLeft, User, LogOut, Camera, Upload, Trash2, Layout, CheckCircle, Zap } from "lucide-react";
import { practiceChallenges } from "@/lib/practiceChallenges";

import { resetProgressStore } from "@/lib/progressStore";
import { useProgress } from "@/lib/useProgress";
import { UserAvatar } from "@/components/UserAvatar";
import { XPBar } from "@/components/XPBar";
import { Avatar3D } from "@/components/Avatar3D";
import { useTranslation } from "@/lib/i18n";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  image?: string;
  providers: string[];
  address: string;
  theme: "light" | "dark" | "system";
};

type ToastState =
  | { type: "success" | "error"; text: string; key: number }
  | null;

const THEME_KEY = "kodeln_theme";


export default function ProfileClient() {
  const router = useRouter();
  const { t } = useTranslation();
  const { update } = useSession();
  const p = useProgress();

  const [data, setData] = useState<ProfileData | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSeed, setSelectedSeed] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showSuccess(text: string) {
    setToast({ type: "success", text, key: Date.now() });
    window.setTimeout(() => setToast(null), 2000);
  }

  function showError(text: string) {
    setToast({ type: "error", text, key: Date.now() });
    window.setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) {
        showError("Failed to load profile data.");
        return;
      }

      const j = (await res.json()) as ProfileData;

      setData(j);
      setName(j.name || "");
      setAddress(j.address || "");
      setSelectedSeed(j.image || j.email || "user");
    }

    load();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      showError("Image too large (max 1.5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedSeed(base64);
    };
    reader.readAsDataURL(file);
  };

  const avatarOptions = useMemo(() => {
    const base = data?.email || "user";
    return [base, `${base}-v2`, `${base}-v3`];
  }, [data?.email]);

  async function saveProfile() {
    const vName = name.trim();
    const vAddress = address.trim();

    if (vName.length < 2) {
      const msg = "Name must be at least 2 characters.";
      showError(msg);
      return;
    }

    if (vAddress.length > 200) {
      const msg = "Address maximum 200 characters.";
      showError(msg);
      return;
    }

    try {
      setSavingProfile(true);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: vName,
          address: vAddress,
          image: selectedSeed,
        }),
      });

      if (!res.ok) {
        const msg = "Failed to save profile changes.";
        showError(msg);
        return;
      }

      await update();

      setData((d) =>
        d ? { ...d, name: vName, address: vAddress, image: selectedSeed } : d
      );

      router.refresh();
      showSuccess("Profile successfully updated");
    } finally {
      setSavingProfile(false);
    }
  }


  const handleSignOut = async () => {
    resetProgressStore();
    await signOut({ callbackUrl: "/" });
  };

  const solvedPractice = (p.completedStepIds.practice as string[]) || [];

  if (!data) {
    return (
      <div className="rounded-xl border border-edu-border bg-edu-surface1 p-8">
        <div className="h-6 w-48 animate-pulse rounded bg-edu-surface2 mb-8" />
        <div className="h-32 animate-pulse rounded-2xl bg-edu-surface2" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 relative">
      <div>
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 rounded-lg bg-edu-surface1 text-edu-textSecondary hover:text-edu-textPrimary font-semibold px-4 py-2 border border-edu-border transition-colors focus:ring-2 focus:ring-edu-primary focus:outline-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t("topbar.map")}
        </button>
      </div>

      <div>
        <XPBar xp={p.xp} streak={p.streak.current} />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
         {/* LEFT COLUMN: Identity & Avatar */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-edu-surface1 border border-edu-border rounded-xl p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative inline-block mb-6 pt-2 group">
                     <UserAvatar
                        src={selectedSeed}
                        size={160}
                        className="rounded-full shadow-lg ring-4 ring-edu-surface2 transition-transform group-hover:scale-[1.02]"
                     />
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-edu-primary p-3 rounded-full text-white shadow-xl hover:bg-edu-primaryHover transition-all focus:ring-4 focus:ring-edu-bg border-4 border-edu-surface1"
                        title="Upload Profile Picture"
                     >
                        <Camera size={20} />
                     </button>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-edu-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                        Online
                     </div>
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                  />

                  <div className="mb-6 space-y-1 text-center w-full min-w-0">
                    <h2 className="text-xl font-bold text-edu-textPrimary truncate">{name || "Student"}</h2>
                    <p className="text-xs text-edu-textSecondary font-medium truncate">{data.email}</p>
                  </div>

                  <div className="space-y-4 w-full">
                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-edu-surface2 border border-edu-border text-edu-textPrimary font-semibold hover:bg-edu-border transition-colors text-sm"
                     >
                        <Upload size={16} /> {t("profile.details.updatePhoto")}
                     </button>
                     
                     <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {data.providers.map((pr) => (
                           <div key={pr} className="px-3 py-1 rounded-md bg-edu-surface2 border border-edu-border text-edu-textSecondary text-[10px] font-bold uppercase tracking-wider">
                              {pr}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="mt-10 pt-8 border-t border-edu-border">
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div className="text-xs font-bold text-edu-textSecondary uppercase tracking-widest">{t("profile.avatar.styles")}</div>
                    {selectedSeed.startsWith("data:") && (
                      <button 
                        onClick={() => setSelectedSeed(data.email)}
                        className="text-[10px] font-bold text-edu-error uppercase tracking-widest flex items-center gap-1 hover:underline"
                      >
                        <Trash2 size={12} /> {t("profile.avatar.remove")}
                      </button>
                    )}
                  </div>
                  <div className="flex justify-center gap-4">
                     {avatarOptions.map((seed) => {
                        const isActive = selectedSeed === seed;
                        return (
                           <button
                              key={seed}
                              onClick={() => setSelectedSeed(seed)}
                              className={`rounded-full transition-all focus:outline-none ${
                                 isActive ? "ring-4 ring-edu-primary ring-offset-4 ring-offset-edu-surface1 scale-110" : "hover:ring-2 hover:ring-edu-border hover:ring-offset-2 hover:ring-offset-edu-surface1 hover:scale-105"
                              }`}
                           >
                              <Avatar3D seed={seed} size={56} className="rounded-full" />
                           </button>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Logout Panel */}
            <div className="bg-edu-surface1 border border-edu-error/20 rounded-xl p-8 shadow-sm">
               <div className="flex flex-col items-center sm:items-start gap-4">
                  <div>
                     <h3 className="text-sm font-black text-edu-error uppercase tracking-widest flex items-center gap-2">
                        {t("profile.session.title")}
                     </h3>
                     <p className="mt-1 text-[10px] font-bold text-edu-textSecondary uppercase tracking-wider">{t("profile.session.desc")}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-edu-error text-edu-error font-black text-[10px] uppercase tracking-widest hover:bg-edu-error hover:text-white transition-all active:scale-95"
                  >
                     <LogOut size={16} /> {t("profile.session.logout")}
                  </button>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: Stats & Settings */}
         <div className="lg:col-span-3 space-y-8">
            
            {/* PRACTICE STATS PANEL (LeetCode Style) */}
            <div className="bg-edu-surface1 border border-edu-border rounded-2xl p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Layout size={20} />
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-edu-textPrimary leading-tight">{t("profile.practice.dashboard")}</h3>
                        <p className="text-[10px] font-bold text-edu-textSecondary uppercase tracking-widest">{t("profile.stats.avg")}</p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[20px] font-black text-edu-textPrimary leading-none">{solvedPractice.length}</span>
                     <span className="text-[9px] font-bold text-edu-textSecondary uppercase tracking-widest leading-none mt-1">{t("profile.stats.practice")}</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Side: Circular Summary */}
                  <div className="flex flex-col items-center justify-center p-6 bg-edu-bg/50 rounded-[2rem] border border-edu-border/50 relative overflow-hidden group">
                     <div className="relative h-32 w-32 flex items-center justify-center">
                        {/* Background Ring */}
                        <svg className="h-full w-full -rotate-90">
                           <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-edu-surface2" />
                           <circle 
                             cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                             className="text-indigo-500 transition-all duration-1000 ease-out"
                             strokeDasharray={364}
                             strokeDashoffset={364 - (364 * (solvedPractice.length / practiceChallenges.length))}
                           />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                           <span className="text-2xl font-black text-edu-textPrimary leading-none">
                              {Math.round((solvedPractice.length / practiceChallenges.length) * 100)}%
                           </span>
                           <span className="text-[8px] font-black text-edu-textSecondary uppercase tracking-widest mt-1">{t("profile.stats.mastery")}</span>
                        </div>
                     </div>
                     <div className="mt-4 text-center">
                        <p className="text-xs font-bold text-edu-textSecondary">
                           {t("profile.stats.solvedDesc").replace("{solved}", solvedPractice.length.toString()).replace("{total}", practiceChallenges.length.toString())}
                        </p>
                     </div>
                  </div>

                  {/* Right Side: Difficulty Bars */}
                  <div className="space-y-6 flex flex-col justify-center">
                     {[
                        { label: "Easy", color: "text-emerald-500", bg: "bg-emerald-500", total: practiceChallenges.filter(c => c.difficulty === "Easy").length, solved: practiceChallenges.filter(c => c.difficulty === "Easy" && solvedPractice.includes(c.id)).length },
                        { label: "Medium", color: "text-amber-500", bg: "bg-amber-500", total: practiceChallenges.filter(c => c.difficulty === "Medium").length, solved: practiceChallenges.filter(c => c.difficulty === "Medium" && solvedPractice.includes(c.id)).length }
                     ].map((stat) => (
                        <div key={stat.label} className="space-y-2">
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className={stat.color}>{stat.label}</span>
                              <span className="text-edu-textSecondary">
                                 <span className="text-edu-textPrimary">{stat.solved}</span>/{stat.total}
                              </span>
                           </div>
                           <div className="h-2 w-full bg-edu-surface2 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full ${stat.bg} transition-all duration-1000`} 
                                 style={{ width: `${(stat.solved / stat.total) * 100}%` }}
                              />
                           </div>
                        </div>
                     ))}
                     
                     <div className="pt-2 flex items-center gap-4 border-t border-edu-border mt-2">
                        <div className="flex-1 p-3 rounded-xl bg-edu-surface2/50 border border-edu-border/50 text-center">
                           <div className="text-[10px] font-black text-edu-textSecondary uppercase tracking-widest mb-1">{t("profile.stats.xp")}</div>
                           <div className="flex items-center justify-center gap-1 text-edu-xp font-black">
                              <Zap size={12} fill="currentColor" /> {p.xp}
                           </div>
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-edu-surface2/50 border border-edu-border/50 text-center">
                           <div className="text-[10px] font-black text-edu-textSecondary uppercase tracking-widest mb-1">{t("profile.stats.bestStreak")}</div>
                           <div className="flex items-center justify-center gap-1 text-edu-streak font-black">
                              <CheckCircle size={12} /> {p.streak.longest}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Profile Form Panel */}
            <div className="bg-edu-surface1 border border-edu-border rounded-xl p-8">
               <div className="flex items-center gap-3 mb-8 border-b border-edu-border pb-4">
                  <User size={22} className="text-edu-primary" />
                  <h3 className="text-xl font-bold text-edu-textPrimary">{t("profile.details.title")}</h3>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-edu-textSecondary uppercase tracking-widest mb-2">{t("profile.details.name")}</label>
                     <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-edu-surface2 border border-edu-border rounded-lg px-4 py-3 text-sm font-medium text-edu-textPrimary placeholder:text-edu-textMuted focus:outline-none focus:ring-2 focus:ring-edu-primary focus:border-transparent transition-all"
                        placeholder="Your cool name..."
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-edu-textSecondary uppercase tracking-widest mb-2">{t("profile.details.location")}</label>
                     <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-edu-surface2 border border-edu-border rounded-lg px-4 py-3 text-sm font-medium text-edu-textPrimary placeholder:text-edu-textMuted focus:outline-none focus:ring-2 focus:ring-edu-primary focus:border-transparent transition-all"
                        placeholder="Earth..."
                     />
                  </div>
               </div>

               <div className="mt-8 flex justify-end">
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-edu-primary text-white font-semibold hover:bg-edu-primaryHover focus:ring-2 focus:ring-offset-2 focus:ring-offset-edu-surface1 focus:ring-edu-primary transition-all disabled:opacity-50"
                  >
                    {savingProfile ? t("profile.details.saving") : t("profile.details.save")}
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
           <div className={`px-6 py-3 rounded-full flex items-center gap-3 shadow-lg border ${
             toast.type === "success" 
                ? "bg-edu-surface2 text-edu-success border-edu-success/30" 
                : "bg-edu-surface2 text-edu-error border-edu-error/30"
           }`}>
             {toast.type === "success" && <span className="flex items-center justify-center w-5 h-5 rounded-full bg-edu-success text-white text-xs">✓</span>}
             <span className="text-sm font-semibold">{toast.text}</span>
           </div>
        </div>
      )}
    </div>
  );
}
