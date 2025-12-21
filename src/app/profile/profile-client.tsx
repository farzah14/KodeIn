"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  image: string;
  providers: string[];
};

type ToastState =
  | { type: "success" | "error"; text: string; key: number }
  | null;

function ProviderBadge({ provider }: { provider: string }) {
  const label =
    provider === "google" ? "Google" : provider === "github" ? "GitHub" : provider;

  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm">
      {label}
    </span>
  );
}

export default function ProfileClient() {
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
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
  }

  useEffect(() => {
    load();
  }, []);

  async function saveName() {
    setError(null);
    const v = name.trim();

    if (v.length < 2) {
      const msg = "Nama minimal 2 karakter.";
      setError(msg);
      showError(msg);
      return;
    }

    try {
      setSavingName(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: v }),
      });

      if (!res.ok) {
        const msg = "Gagal menyimpan nama.";
        setError(msg);
        showError(msg);
        return;
      }

      await load();
      router.refresh();
      showSuccess("Nama berhasil diperbarui");
    } finally {
      setSavingName(false);
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

      await load();
      router.refresh();
      showSuccess("Foto profil berhasil diperbarui");
    } finally {
      setUploading(false);
    }
  }

  if (!data) {
    return (
      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
        <div className="mt-6 h-24 animate-pulse rounded-2xl bg-gray-50" />
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
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
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

          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/5">
            <div className="toast-bar h-1 rounded-full bg-black/30" />
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

      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-xs font-medium text-gray-500">Profile</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">Akun Anda</div>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.image}
                alt="Avatar"
                className="h-16 w-16 rounded-2xl object-cover ring-1 ring-gray-200"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gray-900 text-lg font-semibold text-white">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{data.email}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.providers.length ? (
                  data.providers.map((p) => <ProviderBadge key={p} provider={p} />)
                ) : (
                  <span className="text-xs text-gray-500">No provider detected</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
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
            <div className="mt-2 text-[11px] text-gray-500">PNG/JPG/WEBP, max 2MB</div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-sm font-semibold text-gray-900">Edit Nama</div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-900"
            placeholder="Nama tampilan"
          />
          <button
            onClick={saveName}
            disabled={savingName}
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {savingName ? "Saving..." : "Save"}
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
