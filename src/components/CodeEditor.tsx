"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { OnMount, loader } from "@monaco-editor/react";

// Register custom themes globally
if (typeof window !== "undefined") {
  loader.init().then((monaco) => {
    // 1. One Dark Pro
    monaco.editor.defineTheme("dark-pro", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "5c6370", fontStyle: "italic" },
        { token: "keyword", foreground: "c678dd" },
        { token: "string", foreground: "98c379" },
        { token: "number", foreground: "d19a66" },
        { token: "type", foreground: "e5c07b" },
        { token: "function", foreground: "61afef" },
      ],
      colors: {
        "editor.background": "#282c34",
        "editor.foreground": "#abb2bf",
        "editorLineNumber.foreground": "#4b5263",
        "editor.selectionBackground": "#3e4451",
        "editor.lineHighlightBackground": "#2c313a",
        "editorCursor.foreground": "#528bff",
      },
    });

    // 2. Monokai Pro (Dark)
    monaco.editor.defineTheme("monokai-pro", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "727072", fontStyle: "italic" },
        { token: "keyword", foreground: "ff6188" },
        { token: "string", foreground: "ffd866" },
        { token: "number", foreground: "ab9df2" },
        { token: "function", foreground: "a9dc76" },
        { token: "variable", foreground: "fcfcfa" },
      ],
      colors: {
        "editor.background": "#2d2a2e",
        "editor.foreground": "#fcfcfa",
        "editorLineNumber.foreground": "#5b595c",
        "editor.lineHighlightBackground": "#3a383b",
        "editor.selectionBackground": "#403e41",
      },
    });

    // 3. Monokai Pro (Light)
    monaco.editor.defineTheme("monokai-pro-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "939293", fontStyle: "italic" },
        { token: "keyword", foreground: "d32f2f" },
        { token: "string", foreground: "f57f17" },
        { token: "function", foreground: "388e3c" },
      ],
      colors: {
        "editor.background": "#fcfcfa",
        "editor.foreground": "#2d2a2e",
        "editorLineNumber.foreground": "#c1c0c1",
        "editor.lineHighlightBackground": "#f2f2f0",
      },
    });
  });
}

// File-type icon mapping
const LANG_META: Record<string, { icon: string; color: string; ext: string }> = {
  python:     { icon: "🐍", color: "#3b82f6", ext: ".py" },
  javascript: { icon: "⚡", color: "#f59e0b", ext: ".js" },
  typescript: { icon: "🟦", color: "#2563eb", ext: ".ts" },
  sql:        { icon: "🗃️",  color: "#10b981", ext: ".sql" },
  go:         { icon: "🐹", color: "#06b6d4", ext: ".go" },
};

const FILE_NAMES: Record<string, string> = {
  python: "main.py",
  javascript: "index.js",
  typescript: "index.ts",
  sql: "query.sql",
  go: "main.go",
};

export function CodeEditor({
  value,
  onChange,
  language = "python",
  editorTheme,
  invertOnDark = true,
  filename,
}: {
  value: string;
  onChange: (v: string) => void;
  language?: string;
  editorTheme?: string;
  invertOnDark?: boolean;
  filename?: string;
}) {
  const [theme, setTheme] = useState<string>("vs-dark");
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const editorRef = useRef<any>(null);

  const isDarkTheme = theme.includes("dark") || theme === "hc-black" || theme === "monokai-pro";
  
  // Custom Backgrounds Logic
  const getEditorBg = () => {
    if (theme === "dark-pro") return "#282c34";
    if (theme === "monokai-pro") return "#2d2a2e";
    if (theme === "monokai-pro-light") return "#fcfcfa";
    if (isDarkTheme) return "#1e1e1e";
    return "#f3f3f3";
  };
  const langMeta = LANG_META[language] ?? { icon: "📄", color: "#6b7280", ext: "" };
  const displayName = filename ?? FILE_NAMES[language] ?? `main${langMeta.ext}`;

  useEffect(() => {
    if (editorTheme && editorTheme !== "system") {
      setTheme(editorTheme);
      return;
    }

    const compute = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const next = invertOnDark
        ? isDark ? "vs" : "vs-dark"
        : isDark ? "vs-dark" : "vs";
      setTheme(next);
    };

    compute();

    const onTheme = () => compute();
    window.addEventListener("kodeln-theme", onTheme);
    const mo = new MutationObserver(() => compute());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("kodeln-theme", onTheme);
      mo.disconnect();
    };
  }, [invertOnDark, editorTheme]);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });
  };

  // Warna panel berdasarkan tema
  const bg = getEditorBg();
  const tabBg = isDarkTheme ? "#252526" : "#ececec";
  const activeTabBg = isDarkTheme ? "#1e1e1e" : "#ffffff";
  const borderColor = isDarkTheme ? "#444" : "#d4d4d4";
  const titleText = isDarkTheme ? "#cccccc" : "#333";
  const dimText = isDarkTheme ? "#858585" : "#888";
  const statusBarBg = isDarkTheme ? "#007acc" : "#0a84ff";  // VS Code blue status bar
  const windowBg = isDarkTheme ? "#323233" : "#dddddd";

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl"
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        height: "100%",
      }}
    >
      {/* ── VS Code Title Bar (Window Chrome) ── */}
      <div
        style={{
          background: windowBg,
          borderBottom: `1px solid ${borderColor}`,
          padding: "0 12px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {/* Window dots */}
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        </div>

        {/* Centered app name — like VS Code title */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "12px",
            color: dimText,
            fontWeight: 400,
          }}
        >
          {displayName} — KodeIn Editor
        </div>

        {/* Spacer for symmetry */}
        <div style={{ width: 46 }} />
      </div>

      {/* ── Activity Bar + Tab Bar ── */}
      <div
        style={{
          display: "flex",
          background: tabBg,
          borderBottom: `1px solid ${borderColor}`,
          height: "35px",
          alignItems: "stretch",
          flexShrink: 0,
        }}
      >
        {/* Active File Tab */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: activeTabBg,
            borderRight: `1px solid ${borderColor}`,
            borderTop: `2px solid ${statusBarBg}`,
            padding: "0 14px 0 12px",
            fontSize: "12.5px",
            color: titleText,
            whiteSpace: "nowrap",
            cursor: "default",
          }}
        >
          <span style={{ fontSize: "14px" }}>{langMeta.icon}</span>
          <span>{displayName}</span>
          {/* Dirty dot — faked as always saved */}
          <span style={{ color: dimText, marginLeft: 2, fontSize: "16px", lineHeight: 1 }}>·</span>
        </div>

        {/* "New Tab" button ghost */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            color: dimText,
            fontSize: "18px",
            cursor: "default",
            flexShrink: 0,
          }}
        >
          +
        </div>
      </div>

      {/* ── Editor Body ── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          onMount={handleEditorMount}
          options={{
            // VS Code exact defaults
            minimap: { enabled: true, side: "right", renderCharacters: false, maxColumn: 60 },
            fontSize: 14,
            fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
            fontLigatures: true,
            lineHeight: 22,
            letterSpacing: 0.5,
            scrollBeyondLastLine: false,
            padding: { top: 8, bottom: 8 },
            wordWrap: "on",
            tabSize: 4,
            insertSpaces: true,
            renderWhitespace: "selection",
            renderLineHighlight: "all",
            roundedSelection: false,
            selectOnLineNumbers: true,
            glyphMargin: true,
            folding: true,
            foldingHighlight: true,
            showFoldingControls: "mouseover",
            matchBrackets: "always",
            autoIndent: "full",
            formatOnType: false,
            formatOnPaste: false,
            suggestOnTriggerCharacters: true,
            quickSuggestions: { other: true, comments: false, strings: false },
            smoothScrolling: true,
            cursorBlinking: "blink",
            cursorSmoothCaretAnimation: "on",
            cursorStyle: "line",
            cursorWidth: 2,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: true,
            },
            overviewRulerLanes: 3,
          }}
        />
      </div>

      {/* ── VS Code Status Bar ── */}
      <div
        style={{
          background: statusBarBg,
          color: "#fff",
          fontSize: "11.5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          height: "22px",
          flexShrink: 0,
          userSelect: "none",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span>⎇ main</span>
          <span>⚠ 0</span>
          <span>⊘ 0</span>
        </div>

        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>UTF-8</span>
          <span style={{ textTransform: "capitalize" }}>{language === "javascript" ? "JavaScript" : language.charAt(0).toUpperCase() + language.slice(1)}</span>
          <span>Spaces: 4</span>
        </div>
      </div>
    </div>
  );
}
