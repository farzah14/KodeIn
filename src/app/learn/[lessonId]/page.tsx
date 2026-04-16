"use client";

import { use } from "react";
import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { content } from "@/lib/content";
import { LessonPlayer } from "@/components/LessonPlayer";
import { useTranslation } from "@/lib/i18n";

export default function LessonPage({
  params: paramsPromise,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(paramsPromise);
  const { t } = useTranslation();
  const lesson = content.lessons[lessonId];

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Topbar />
        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
              {t("lesson.notFound")}
            </div>
            <Link
              className="mt-3 inline-block text-sm text-gray-700 underline dark:text-zinc-200"
              href="/learn"
            >
              {t("common.back")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Topbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4">
          <Link className="text-sm text-gray-700 underline dark:text-zinc-200" href="/learn">
            ← {t("common.back")}
          </Link>
        </div>
        <LessonPlayer lesson={lesson} />
      </main>
    </div>
  );
}
