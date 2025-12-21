"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { resetProgressStore } from "@/lib/progressStore";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  image: string;
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

  const [data, setData] = useState<ProfileData | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [theme, setTheme] = useState<ProfileData["theme"]>("system");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const initials = useMemo(() => {
    const t = (data?.name || data?.email || "U").trim();
    return (t[0] ?? "U").toUpperCase();
  }, [data?.name, data?.email]);

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

    // Sync theme global saat load profile
    persistTheme(j.theme || "system");
  }

  useEffect(() => {
    load();
  }, []);

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
        body: JSON.stringify({ name: vName, address: vAddress }),
      });

      if (!res.ok) {
        const msg = "Gagal menyimpan profil.";
        setError(msg);
        showError(msg);
        return;
      }

      // Update state lokal (tanpa wajib load)
      setData((d) => (d ? { ...d, name: vName, address: vAddress } : d));

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

      if (!res.ok) {
        const msg = "Gagal menyimpan theme.";
        setError(msg);
        showError(msg);
        return;
      }

      // Jangan load() lagi di sini (ini yang sering bikin ketimpa)
      setData((d) => (d ? { ...d, theme: nextTheme } : d));

      router.refresh();
      showSuccess("Theme berhasil diperbarui");
    } finally {
      setSavingTheme(false);
    }
  }

  async function uploadAvatar(file: File) {
    setError(null);

    try {
      setUploading(true);
      const fd = new FormData();
      fd.set("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const msg = j?.error ? `Upload gagal: ${j.error}` : "Upload gagal.";
        setError(msg);
        showError(msg);
        return;
      }

      // Avatar berubah: paling aman reload
      await load();
      router.refresh();
      showSuccess("Foto profil berhasil diperbarui");
    } finally {
      setUploading(false);
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
      {/* Toast */}
      {toast && (
        <div
          key={toast.key}
          className={`fixed bottom-5 right-5 z-[80] w-[min(360px,92vw)] rounded-2xl border px-4 py-3 text-sm shadow-sm toast-enter ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <div
              className={`grid h-7 w-7 place-items-center rounded-xl ${
                toast.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="font-medium">{toast.text}</div>
          </div>

          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div className="toast-bar h-1 rounded-full bg-black/30 dark:bg-white/30" />
          </div>

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
            .toast-bar {
              width: 0%;
              animation: barFill 1500ms linear forwards;
            }
            @keyframes barFill {
              to {
                width: 100%;
              }
            }
          `}</style>
        </div>
      )}

      {/* CARD 1 */}
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">Profile</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-zinc-100">Akun Anda</div>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.image}
                alt="Avatar"
                className="h-16 w-16 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-zinc-800"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gray-900 text-lg font-semibold text-white dark:bg-white dark:text-black">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">
                {data.email}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.providers.length ? (
                  data.providers.map((p) => <ProviderBadge key={p} provider={p} />)
                ) : (
                  <span className="text-xs text-gray-500 dark:text-zinc-400">No provider detected</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadAvatar(f);
                  e.currentTarget.value = "";
                }}
              />
              {uploading ? "Uploading..." : "Upload Photo"}
            </label>
            <div className="mt-2 text-[11px] text-gray-500 dark:text-zinc-400">PNG/JPG/WEBP, max 2MB</div>
          </div>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Edit Profil</div>

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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {savingProfile ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleSignOut}
              className="rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 dark:border-red-900/40 dark:bg-zinc-950 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* CARD 3 */}
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Theme</div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={theme}
            disabled={savingTheme}
            onChange={async (e) => {
              const next = e.target.value as ProfileData["theme"];

              // instant apply global (tanpa refresh)
              setTheme(next);
              persistTheme(next);

              // simpan ke DB
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
    </div>
  );
}
