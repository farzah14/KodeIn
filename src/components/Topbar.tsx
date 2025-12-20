"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useProgress } from "@/lib/useProgress";

function Pill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
      <span className="text-gray-500">{label}</span>{" "}
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function UserChip({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const text = name?.trim() || email?.trim() || "User";
  const initial = (text[0] ?? "U").toUpperCase();

  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs shadow-sm">
      <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
        {initial}
      </div>
      <div className="max-w-[160px] truncate text-gray-900">{text}</div>
    </div>
  );
}

export function Topbar() {
  const p = useProgress();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-900 text-sm font-semibold text-white shadow-sm">
            DC
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900">DuoCode</div>
            <div className="text-[11px] text-gray-500">Python track (MVP)</div>
          </div>
        </Link>

        {/* Right: Stats + Auth */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Pill label="XP" value={p.xp} />
          <Pill label="Streak" value={p.streak.current} />

          <Link
            href="/learn"
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          >
            Course Map
          </Link>

          {/* Auth Area */}
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse rounded-full border border-gray-200 bg-gray-50" />
          ) : session?.user ? (
            <>
              <UserChip name={session.user.name} email={session.user.email} />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm hover:bg-gray-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white shadow-sm hover:opacity-95"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
