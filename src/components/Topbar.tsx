"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useProgress } from "@/lib/useProgress";
import { resetProgressStore } from "@/lib/progressStore";
import { Avatar3D } from "@/components/Avatar3D";

function Pill({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string | number;
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
      <span className="text-gray-500 dark:text-zinc-400">{label}</span>{" "}
      {isLoading ? (
        <span className="inline-block h-4 w-8 animate-pulse rounded bg-gray-100 align-middle dark:bg-zinc-800" />
      ) : (
        <span className="font-semibold text-gray-900 dark:text-zinc-100">{value}</span>
      )}
    </div>
  );
}

// UPDATE 1: Tambahkan prop 'image' dan jadikan prioritas seed
function AvatarButton3D({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  // Jika 'image' ada (dari database), gunakan itu sebagai seed.
  // Jika tidak, fallback ke email atau name.
  const seed = (image?.trim() || email?.trim() || name?.trim() || "anonymous") as string;

  return (
    <Link
      href="/profile"
      title="Profile"
      className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
    >
      <Avatar3D seed={seed} size={36} className="h-9 w-9" title="Avatar" />
    </Link>
  );
}

export function Topbar() {
  const p = useProgress();
  const { data: session, status } = useSession();

  const isAuthed = status === "authenticated";
  const isAuthLoading = status === "loading";
  const showProgressLoading = isAuthLoading;

  async function handleSignOut() {
    resetProgressStore();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-900 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-black">
            KI
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              KodeIn
            </div>
            <div className="text-[11px] text-gray-500 dark:text-zinc-400">
              Learn coding by doing
            </div>
          </div>
        </Link>

        {/* Right: Stats + Auth */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Pill label="XP" value={p.xp} isLoading={showProgressLoading} />
          <Pill label="Streak" value={p.streak.current} isLoading={showProgressLoading} />

          <Link
            href="/learn"
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Course Map
          </Link>

          {/* Auth Area */}
          {isAuthLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900" />
          ) : isAuthed && session?.user ? (
            <>
              {/* UPDATE 2: Pass session.user.image ke komponen */}
              <AvatarButton3D 
                name={session.user.name} 
                email={session.user.email} 
                image={session.user.image} 
              />

              <button
                onClick={handleSignOut}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white shadow-sm hover:opacity-95 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}