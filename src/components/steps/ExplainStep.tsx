"use client";

import ReactMarkdown from "react-markdown";

export function ExplainStep({ title, markdown }: { title: string; markdown: string }) {
  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Decorative header accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      
      <div className="p-8 sm:p-12">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
            {title}
          </h2>
          <div className="text-xl leading-relaxed text-gray-700 dark:text-zinc-300 [&>p]:mb-8 [&>ul]:mb-8 [&>li]:mb-4 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-gray-900 dark:[&>h3]:text-white [&>h3]:mt-10 [&>pre]:rounded-xl [&>pre]:border [&>pre]:border-gray-100 dark:[&>pre]:border-zinc-800 [&>code]:bg-gray-100 dark:[&>code]:bg-zinc-800 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-indigo-600 dark:[&>code]:text-indigo-400">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
