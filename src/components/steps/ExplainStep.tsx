"use client";

export function ExplainStep({ title, markdown }: { title: string; markdown: string }) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{title}</div>

      <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-zinc-300">
        {markdown}
      </div>
    </div>
  );
}
