"use client";

import Editor from "@monaco-editor/react";

export function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <Editor
        height="360px"
        defaultLanguage="python"
        theme="vs-dark"
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
