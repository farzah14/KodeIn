"use client";

import ReactMarkdown from "react-markdown";

export function ExplainStep({ title, markdown }: { title: string; markdown: string }) {
  return (
    <div className="pixel-border border-4 bg-white p-6 sm:p-10 dark:bg-zinc-900 shadow-none">
      <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert font-pixel">
        <h2 className="text-xl sm:text-2xl text-retro-primary border-b-4 border-black/5 pb-4 mb-8">
          {title}
        </h2>
        <div className="font-pixel text-[10px] leading-relaxed text-gray-700 dark:text-gray-300 [&>p]:mb-6 [&>ul]:mb-6 [&>li]:mb-2">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
