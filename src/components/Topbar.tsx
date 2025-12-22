"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, Map } from "lucide-react";

import { useProgress } from "@/lib/useProgress";
import { resetProgressStore } from "@/lib/progressStore";
import { Avatar3D } from "@/components/Avatar3D";

// --- Components Kecil ---

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

function AvatarButton3D({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  // Prioritas seed: Image (DB) -> Email -> Name -> Anonymous
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

// --- Main Component ---

export function Topbar() {
  const p = useProgress();
  const { data: session, status } = useSession();
  
  // State untuk hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthed = status === "authenticated";
  const isAuthLoading = status === "loading";
  const showProgressLoading = isAuthLoading;

  async function handleSignOut() {
    resetProgressStore();
    await signOut({ callbackUrl: "/" });
  }

  // Helper untuk mendapatkan seed avatar yang konsisten dengan ProfileClient
  const userSeed = (session?.user?.image?.trim() || session?.user?.email?.trim() || session?.user?.name?.trim() || "anonymous") as string;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        
        {/* LEFT: Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              KodeIn
            </div>
            <div className="text-[11px] text-gray-500 dark:text-zinc-400">
              Learn coding by doing
            </div>
          </div>
        </Link>

        {/* RIGHT (DESKTOP): Tampil hanya di layar md ke atas */}
        <div className="hidden items-center justify-end gap-2 md:flex">
          <Pill label="XP" value={p.xp} isLoading={showProgressLoading} />
          <Pill label="Streak" value={p.streak.current} isLoading={showProgressLoading} />

          {/* Auth Area Desktop */}
          {isAuthLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900" />
          ) : isAuthed && session?.user ? (
            <>
              <AvatarButton3D 
                name={session.user.name} 
                email={session.user.email} 
                image={session.user.image} 
              />
              <button
                onClick={handleSignOut}
                className="rounded-full border border-red-200 bg-white px-3 py-1 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 dark:border-red-900/40 dark:bg-zinc-950 dark:text-red-400 dark:hover:bg-red-900/20"
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

        {/* RIGHT (MOBILE): Hamburger Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-xl md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4">
            
            {/* 1. Profile Section */}
            {isAuthed && session?.user ? (
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-black dark:ring-zinc-800">
                     {/* Avatar3D akan otomatis menyesuaikan visual berdasarkan 'userSeed' (termasuk variasi baju/rambut) */}
                    <Avatar3D seed={userSeed} size={64} className="h-16 w-16" />
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-gray-900 dark:text-zinc-100">
                    {session.user.name || "User"}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-zinc-400">
                    {session.user.email}
                  </div>
                  {/* UPDATE: Ukuran text diperbesar ke text-xs */}
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-1.5 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            ) : (
              // Jika belum login
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                 <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-block w-full rounded-xl bg-gray-900 py-2 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-black"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* 2. Menu Items */}
            <div className="grid gap-2">
               <Link
                href="/learn"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm active:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:active:bg-zinc-900"
              >
                <Map size={18} className="text-gray-400" />
                Course Map
              </Link>

               {/* Stats (Mobile Only View) */}
               <div className="flex gap-2">
                  <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">XP</div>
                    <div className="font-bold text-gray-900 dark:text-zinc-100">{p.xp}</div>
                  </div>
                  <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Streak</div>
                    <div className="font-bold text-gray-900 dark:text-zinc-100">{p.streak.current}</div>
                  </div>
               </div>
            </div>

            {/* 3. Sign Out Button */}
            {isAuthed && (
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 py-3 text-sm font-medium text-red-600 active:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:active:bg-red-900/20"
              >
                <LogOut size={16} />
                Sign out
              </button>
            )}

          </div>
        </div>
      )}
    </header>
  );
}