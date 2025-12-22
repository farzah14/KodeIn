"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";

import { resetProgressStore } from "@/lib/progressStore";
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
    <div className="space-y-6">
      {/* Tombol kembali */}
      <div>
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:text-gray-900 active:scale-95 dark:text-zinc-400 dark:hover:text-zinc-100"
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
          className={`fixed bottom-5 right-5 z-[80] rounded-2xl border px-4 py-3 text-sm shadow-sm toast-enter ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
          }`}
        >
          <div className="font-medium">{toast.text}</div>
          <style jsx>{`
            .toast-enter {
              animation: toastIn 180ms ease-out both;
            }
            @keyframes toastIn {
              0% {
                opacity: 0;
                transform: translateY(10px) scale(0.98);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}

      {/* CARD 1: PROFILE DISPLAY & AVATAR SELECTION */}
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              Profile
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-zinc-100">
              Account
            </div>

            <div className="mt-4">
              <div className="text-base font-bold text-gray-900 dark:text-zinc-100">
                {data.email}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.providers.length ? (
                  data.providers.map((p) => <ProviderBadge key={p} provider={p} />)
                ) : (
                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                    No provider
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="relative">
              <Avatar3D
                seed={selectedSeed}
                size={100}
                className="h-[100px] w-[100px] shadow-lg transition-transform hover:scale-105"
                title="Avatar Terpilih"
              />
              <div className="absolute -bottom-2 right-0 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                Active
              </div>
            </div>

            <div className="mt-2">
              <div className="mb-2 text-center text-xs font-medium text-gray-500 dark:text-zinc-400 md:text-right">
                Pilih Gaya:
              </div>
              <div className="flex gap-3">
                {avatarOptions.map((seed, idx) => {
                  const isActive = selectedSeed === seed;
                  return (
                    <button
                      key={seed}
                      onClick={() => setSelectedSeed(seed)}
                      className={`group relative rounded-2xl transition-all ${
                        isActive
                          ? "ring-2 ring-gray-900 ring-offset-2 dark:ring-white dark:ring-offset-black scale-110 z-10"
                          : "hover:scale-105 opacity-70 hover:opacity-100"
                      }`}
                      title={`Pilihan ${idx + 1}`}
                      type="button"
                    >
                      <Avatar3D seed={seed} size={48} className="h-12 w-12" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: EDIT FORM (TANPA BUTTON) */}
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
          Edit Profil
        </div>

        <div className="mt-4 grid gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-white"
            placeholder="Nama tampilan"
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-white"
            placeholder="Address"
          />
        </div>
      </div>

      {/* CARD 3: THEME */}
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
          Theme
        </div>
        <div className="mt-4">
          <select
            value={theme}
            disabled={savingTheme}
            onChange={async (e) => {
              const next = e.target.value as ProfileData["theme"];
              setTheme(next);
              persistTheme(next);
              await saveTheme(next);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900 sm:max-w-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-white"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* CARD 4: ACTIONS (PALING BAWAH) */}
      <div className="rounded-[28px] p-8">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60 dark:bg-white dark:text-black"
            type="button"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}
