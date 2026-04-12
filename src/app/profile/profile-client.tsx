"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ArrowLeft, User, MapPin, Palette, Save, LogOut, Mail, Monitor, Moon, Sun, CheckCircle2 } from "lucide-react";

import { resetProgressStore } from "@/lib/progressStore";
import { useProgress } from "@/lib/useProgress";
import { Avatar3D } from "@/components/Avatar3D";
import { XPBar } from "@/components/XPBar";

// ... (types and persists omitted as they are top-level and unmodified, but we're replacing the whole component)

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

function ProviderBadge({ provider }: { provider: string }) {
  const label =
    provider === "google" ? "Google" : provider === "github" ? "GitHub" : provider;

  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      {label}
    </span>
  );
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
  const [savingTheme, setSavingTheme] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  function showSuccess(text: string) {
    setToast({ type: "success", text, key: Date.now() });
    window.setTimeout(() => setToast(null), 1600);
  }

  function showError(text: string) {
    setToast({ type: "error", text, key: Date.now() });
    window.setTimeout(() => setToast(null), 2200);
  }

  async function load() {
    setError(null);

    const res = await fetch("/api/profile", { cache: "no-store" });
    if (!res.ok) {
      const msg = "Gagal load profile.";
      setError(msg);
      showError(msg);
      return;
    }

    const j = (await res.json()) as ProfileData;

    setData(j);
    setName(j.name || "");
    setAddress(j.address || "");
    setTheme(j.theme || "system");

    // Default avatar
    setSelectedSeed(j.image || j.email || "user");

    persistTheme(j.theme || "system");
  }

  useEffect(() => {
    load();
  }, []);

  // Opsi Avatar (V1, V2, V3) berdasarkan email
  const avatarOptions = useMemo(() => {
    const base = data?.email || "user";
    return [base, `${base}-v2`, `${base}-v3`];
  }, [data?.email]);

  async function saveProfile() {
    setError(null);

    const vName = name.trim();
    const vAddress = address.trim();

    if (vName.length < 2) {
      const msg = "Nama minimal 2 karakter.";
      setError(msg);
      showError(msg);
      return;
    }

    if (vAddress.length > 200) {
      const msg = "Address maksimal 200 karakter.";
      setError(msg);
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
        const msg = "Gagal menyimpan profil.";
        setError(msg);
        showError(msg);
        return;
      }

      await update();

      setData((d) =>
        d ? { ...d, name: vName, address: vAddress, image: selectedSeed } : d
      );

      router.refresh();
      showSuccess("Profile berhasil diperbarui");
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveTheme(nextTheme: ProfileData["theme"]) {
    setError(null);
    try {
      setSavingTheme(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: nextTheme }),
      });
      if (!res.ok) throw new Error("Gagal save theme");

      await update();

      setData((d) => (d ? { ...d, theme: nextTheme } : d));
      router.refresh();
      showSuccess("Theme diperbarui");
    } catch {
      showError("Gagal menyimpan theme.");
    } finally {
      setSavingTheme(false);
    }
  }

  async function handleSignOut() {
    resetProgressStore();
    await signOut({ callbackUrl: "/" });
  }

  if (!data) {
    return (
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-100 dark:bg-zinc-800" />
        <div className="mt-6 h-24 animate-pulse rounded-2xl bg-gray-50 dark:bg-zinc-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Background Orbs */}
      <div className="absolute top-40 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-96 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -z-10 mix-blend-screen pointer-events-none"></div>

      {/* Tombol kembali */}
      <div>
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-white hover:shadow-sm dark:hover:bg-zinc-900 transition-all active:scale-95 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span>Kembali</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold shadow-2xl toast-enter backdrop-blur-md ${
            toast.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
          }`}
        >
           {toast.type === "success" && <CheckCircle2 size={18} />}
          <div>{toast.text}</div>
          <style jsx>{`
            .toast-enter {
              animation: toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes toastSlideUp {
              0% { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
              100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* GAMIFICATION STATS */}
      <XPBar xp={p.xp} streak={p.streak.current} />

      {/* CARD 1: PROFILE & AVATAR */}
      <div className="overflow-hidden rounded-[32px] border border-gray-200/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/60">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          {/* Info Kiri */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <User size={12} strokeWidth={3} /> Info Akun Utama
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Identitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Digitalmu</span>
            </h2>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-50/50 p-4 border border-gray-100 dark:bg-zinc-900/40 dark:border-zinc-800">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-black">
                  <Mail size={18} className="text-gray-400" />
               </div>
               <div>
                 <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Terdaftar</div>
                 <div className="text-base font-bold text-gray-900 dark:text-zinc-100">
                   {data.email}
                 </div>
               </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2 mr-2">Login Via:</span>
              {data.providers.length ? (
                data.providers.map((p) => <ProviderBadge key={p} provider={p} />)
              ) : (
                <span className="text-xs text-gray-500 dark:text-zinc-400">
                  No provider
                </span>
              )}
            </div>
          </div>

          {/* Avatar Kanan */}
          <div className="flex flex-col items-center gap-6 md:items-end">
            <div className="relative">
              {/* Glow Ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-cyan-500/20 blur-xl animate-pulse dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-cyan-500/10"></div>
              <div className="relative">
                <Avatar3D
                  seed={selectedSeed}
                  size={140}
                  className="h-[140px] w-[140px] ring-[6px] ring-white shadow-2xl dark:ring-zinc-900"
                  title="Avatar Terpilih"
                />
              </div>
              <div className="absolute -bottom-2 right-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg ring-4 ring-white dark:ring-zinc-950">
                Online
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-2 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800">
              <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Pilih Varian Avatar
              </div>
              <div className="flex gap-2">
                {avatarOptions.map((seed, idx) => {
                  const isActive = selectedSeed === seed;
                  return (
                    <button
                      key={seed}
                      onClick={() => setSelectedSeed(seed)}
                      className={`group relative rounded-[20px] transition-all duration-300 ${
                        isActive
                          ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-black scale-110 z-10 shadow-lg shadow-indigo-500/20 bg-white dark:bg-black"
                          : "hover:scale-105 opacity-60 hover:opacity-100 bg-transparent"
                      }`}
                      title={`Pilihan ${idx + 1}`}
                      type="button"
                    >
                      <Avatar3D seed={seed} size={48} className="h-12 w-12 rounded-[18px]" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
         
         {/* Form Kolom Kiri (Lebih Lebar) */}
         <div className="md:col-span-3 space-y-6">
            
            {/* CARD 2: EDIT NAMA & ADDRESS */}
            <div className="rounded-[32px] border border-gray-200/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/60">
              <div className="mb-6 flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400">
                    <User size={18} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detail Profil</h3>
              </div>

              <div className="space-y-4">
                 <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                       <User size={16} />
                    </div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white/50 py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-indigo-500"
                      placeholder="Nama Lengkap"
                    />
                 </div>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                       <MapPin size={16} />
                    </div>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white/50 py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-indigo-500"
                      placeholder="Asal Kota / Negara"
                    />
                 </div>
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </div>
            )}
            
            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between">
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="group relative overflow-hidden rounded-2xl bg-gray-900 px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/25 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:shadow-white/20"
                type="button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center gap-2">
                   {savingProfile ? (
                       <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                   ) : (
                       <Save size={18} />
                   )}
                   {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                </div>
              </button>
            </div>
         </div>

         {/* Form Kolom Kanan (Lebih Kecil) */}
         <div className="md:col-span-2 space-y-6">
            
            {/* CARD 3: THEME */}
            <div className="rounded-[32px] border border-gray-200/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/60">
               <div className="mb-6 flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400">
                    <Palette size={18} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tema UI</h3>
              </div>
              
              <div className="grid gap-3">
                {[
                  { id: "light", label: "Light Mode", icon: <Sun size={16} /> },
                  { id: "dark", label: "Dark Mode", icon: <Moon size={16} /> },
                  { id: "system", label: "Ikuti Sistem", icon: <Monitor size={16} /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    disabled={savingTheme}
                    onClick={async () => {
                      const next = t.id as typeof theme;
                      setTheme(next);
                      persistTheme(next);
                      await saveTheme(next);
                    }}
                    className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 transition-all ${
                      theme === t.id
                        ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-inner dark:border-indigo-500/50 dark:bg-indigo-900/20 dark:text-indigo-400"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {t.icon}
                    <span className="text-sm font-bold">{t.label}</span>
                    {theme === t.id && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CARD 4: DANGER ZONE */}
            <div className="rounded-[32px] border border-red-100 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-red-900/20 dark:bg-zinc-950/60">
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Akses Akun</h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-zinc-500">
                Data *Progress Map* milikmu akan tetap aman.
              </p>
              <button
                onClick={handleSignOut}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 active:bg-red-200 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </div>

         </div>

      </div>
    </div>
  );
}
