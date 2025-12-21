import { Topbar } from "@/components/Topbar";

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Topbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">
          Practice
        </h1>
      </main>
    </div>
  );
}
