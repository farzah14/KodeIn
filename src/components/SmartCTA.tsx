"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Code2 } from "lucide-react";

/**
 * Tombol CTA yang pintar:
 * - Kalau sudah login → arahkan ke /learn
 * - Kalau belum login → arahkan ke /login
 */
export function HeroCTA() {
  const { status } = useSession();
  const dest = status === "authenticated" ? "/learn" : "/login";

  return (
    <div className="anim-slide-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '300ms' }}>
      <Link
        href={dest}
        className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gray-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-gray-800 hover:ring-4 hover:ring-gray-200 dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:hover:ring-zinc-800"
      >
        Mulai Belajar Sekarang
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </Link>
      
      <Link
        href="/learn"
        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
      >
        Intip Course Map
      </Link>
    </div>
  );
}

export function BottomCTA() {
  const { status } = useSession();
  const dest = status === "authenticated" ? "/learn" : "/login";

  return (
    <div className="mt-10">
      <Link
        href={dest}
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-gray-100"
      >
        <Code2 size={24} />
        Gas Ngoding!
      </Link>
    </div>
  );
}
