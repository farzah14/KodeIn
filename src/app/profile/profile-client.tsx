"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ArrowLeft, User, Palette, Sun, Moon, Monitor, LogOut, Camera, Upload, Trash2 } from "lucide-react";

import { resetProgressStore } from "@/lib/progressStore";
import { useProgress } from "@/lib/useProgress";
import { UserAvatar } from "@/components/UserAvatar";
import { XPBar } from "@/components/XPBar";
import { Avatar3D } from "@/components/Avatar3D";

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

function persistTheme(next: ProfileData["theme"]) {
  try {
    localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new Event("kodeln-theme"));
  } catch {
    // ignore
  }
}

export default function ProfileClient() {
  const router = useRouter();
  const { update } = useSession();
  const p = useProgress();

  const [data, setData] = useState<ProfileData | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [theme, setTheme] = useState<ProfileData["theme"]>("system");

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
      setTheme(j.theme || "system");
      setSelectedSeed(j.image || j.email || "user");

      persistTheme(j.theme || "system");
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

  async function saveTheme(nextTheme: ProfileData["theme"]) {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: nextTheme }),
      });
      if (!res.ok) throw new Error("Failed to save theme");

      await update();

      setData((d) => (d ? { ...d, theme: nextTheme } : d));
      router.refresh();
      showSuccess("Theme preferences updated");
    } catch {
      showError("Failed to save theme setting.");
    }
  }

  async function handleSignOut() {
    resetProgressStore();
    await signOut({ callbackUrl: "/" });
  }

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
          Back to Map
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
                        <Upload size={16} /> Update Photo
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
                    <div className="text-xs font-bold text-edu-textSecondary uppercase tracking-widest">Avatar Styles</div>
                    {selectedSeed.startsWith("data:") && (
                      <button 
                        onClick={() => setSelectedSeed(data.email)}
                        className="text-[10px] font-bold text-edu-error uppercase tracking-widest flex items-center gap-1 hover:underline"
                      >
                        <Trash2 size={12} /> Remove custom
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
         </div>

         {/* RIGHT COLUMN: Settings & Save */}
         <div className="lg:col-span-3 space-y-8">
            {/* Profile Form Panel */}
            <div className="bg-edu-surface1 border border-edu-border rounded-xl p-8">
               <div className="flex items-center gap-3 mb-8 border-b border-edu-border pb-4">
                  <User size={22} className="text-edu-primary" />
                  <h3 className="text-xl font-bold text-edu-textPrimary">Profile Settings</h3>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-edu-textSecondary uppercase tracking-widest mb-2">Display Name</label>
                     <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-edu-surface2 border border-edu-border rounded-lg px-4 py-3 text-sm font-medium text-edu-textPrimary placeholder:text-edu-textMuted focus:outline-none focus:ring-2 focus:ring-edu-primary focus:border-transparent transition-all"
                        placeholder="Your cool name..."
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-edu-textSecondary uppercase tracking-widest mb-2">Location</label>
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
                    {savingProfile ? "Saving Details..." : "Save Changes"}
                  </button>
               </div>
            </div>

            {/* UI Theme Panel */}
            <div className="bg-edu-surface1 border border-edu-border rounded-xl p-8">
               <div className="flex items-center gap-3 mb-8 border-b border-edu-border pb-4">
                  <Palette size={22} className="text-edu-streak" />
                  <h3 className="text-xl font-bold text-edu-textPrimary">App Appearance</h3>
               </div>

               <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light Mode", icon: <Sun size={20} /> },
                    { id: "dark", label: "Dark Mode", icon: <Moon size={20} /> },
                    { id: "system", label: "System Sync", icon: <Monitor size={20} /> },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={async () => {
                        const next = t.id as typeof theme;
                        setTheme(next);
                        persistTheme(next);
                        await saveTheme(next);
                      }}
                      className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border transition-all ${
                        theme === t.id ? "bg-edu-primary/10 border-edu-primary text-edu-primary shadow-sm" : "bg-edu-surface2 border-edu-border text-edu-textSecondary hover:text-edu-textPrimary hover:bg-edu-surface2/80"
                      }`}
                    >
                      {t.icon}
                      <span className="text-xs font-bold uppercase tracking-widest">{t.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Logout Panel */}
            <div className="bg-edu-surface1 border border-edu-error/30 rounded-xl p-8">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                     <h3 className="text-lg font-bold text-edu-error flex items-center gap-2">
                        Account Session
                     </h3>
                     <p className="mt-1 text-sm font-medium text-edu-textSecondary">Are you sure you want to log out? Your progress will wait for you.</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-edu-error text-edu-error font-semibold hover:bg-edu-error hover:text-white transition-all"
                  >
                     <LogOut size={18} /> Log Out
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
