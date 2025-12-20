"use client";

export function ExplainStep({ title, markdown }: { title: string; markdown: string }) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-lg font-semibold text-gray-900">{title}</div>

      <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-800">
        {markdown}
      </div>
    </div>
  );
}
