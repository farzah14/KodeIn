"use client";

import { Topbar } from "@/components/Topbar";
import { PathMap } from "@/components/PathMap";
import { CourseProgressHeader } from "@/components/CourseProgressHeader";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function LearnPage() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8FAFC] dark:bg-[#09090b]">
      {/* Background Pattern */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="pointer-events-none fixed top-0 right-0 z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-indigo-500/8 via-cyan-500/5 to-transparent blur-[120px] dark:from-indigo-500/4 dark:via-cyan-500/3"></div>
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-purple-500/6 to-transparent blur-[100px] dark:from-purple-500/3"></div>

      <Topbar />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10">
        <div className="space-y-8">
          {/* Course Progress Dashboard */}
          <CourseProgressHeader />

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/practice"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <Code2 size={16} className="text-indigo-500" />
              {t("practice.sandbox")}
            </Link>
          </div>

          {/* Path Map */}
          <PathMap />
        </div>
      </main>
    </div>
  );
}
