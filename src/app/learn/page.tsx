import { Topbar } from "@/components/Topbar";
import { PathMap } from "@/components/PathMap";
import { CourseProgressHeader } from "@/components/CourseProgressHeader";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 space-y-4">
          <CourseProgressHeader />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Course Map</h2>
            <p className="mt-1 text-sm text-gray-600">Selesaikan Course Anda Sekarang.</p>
          </div>
        </div>
        <PathMap />
      </main>
    </div>
  );
}
