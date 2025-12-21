"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

type MonacoTheme = "vs" | "vs-dark";

export function CodeEditor({
  value,
  onChange,
  invertOnDark = true,
}: {
  value: string;
  onChange: (v: string) => void;
  /**
   * Jika true:
   * - Dark mode => editor PUTIH (vs)
   * - Light mode => editor HITAM (vs-dark)
   */
  invertOnDark?: boolean;
}) {
  const [theme, setTheme] = useState<MonacoTheme>("vs-dark");

  useEffect(() => {
    const compute = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const next: MonacoTheme =
        invertOnDark ? (isDark ? "vs" : "vs-dark") : isDark ? "vs-dark" : "vs";
      setTheme(next);
    };

    compute();

    // Dengarkan event custom Anda (ThemeSync)
    const onTheme = () => compute();
    window.addEventListener("kodeln-theme", onTheme);

    // Backup: observe perubahan class di <html>
    const mo = new MutationObserver(() => compute());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("kodeln-theme", onTheme);
      mo.disconnect();
    };
  }, [invertOnDark]);

  return (
    // Wrapper editor dibuat "netral" agar terlihat rapi di light/dark.
    // Karena Monaco punya background sendiri via theme, wrapper cukup border + radius.
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Editor
        height="360px"
        defaultLanguage="python"
        theme={theme}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          wordWrap: "on",
          tabSize: 4,
        }}
      />
    </div>
  );
}
