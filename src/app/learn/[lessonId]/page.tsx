import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { content } from "@/lib/content";
import { LessonPlayer } from "@/components/LessonPlayer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const lesson = content.lessons[lessonId];

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar />
        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6">
            <div className="text-lg font-semibold">Lesson tidak ditemukan</div>
            <Link className="mt-3 inline-block underline" href="/learn">
              Kembali ke Course Map
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4">
          <Link className="text-sm underline" href="/learn">
            ← Kembali
          </Link>
        </div>
        <LessonPlayer lesson={lesson} />
      </main>
    </div>
  );
}
