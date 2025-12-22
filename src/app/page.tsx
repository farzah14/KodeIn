import Link from "next/link";
import { Topbar } from "@/components/Topbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Topbar />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-[28px] border border-gray-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <span className="font-semibold">Python track</span> 
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-tight text-gray-900 dark:text-zinc-100">
            KodeIn
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-700 dark:text-zinc-300">
            Belajar Coding Gampang Kok😂
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="focus-ring rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 dark:bg-white dark:text-black"
            >
              Mulai Belajar
            </Link>

            <Link
              href="/learn"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Lihat Course Map
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
