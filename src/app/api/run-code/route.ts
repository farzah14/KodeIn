import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mapping bahasa ke versi spesifik Piston (opsional, Piston bisa menggunakan '*' untuk latest)
    const languageMap: Record<string, string> = {
      python: "3.10.0",
      javascript: "18.15.0",
      sql: "sqlite3",
      sqlite: "sqlite3",
      go: "1.16.2",
      typescript: "5.0.3"
    };

    const targetLanguage = body.language === "sql" ? "sqlite3" : body.language;

    const payload = {
      language: targetLanguage,
      version: languageMap[body.language] || "*",
      files: body.files,
      stdin: body.stdin || "",
      args: body.args || [],
      compile_timeout: body.compile_timeout || 10000,
      run_timeout: body.run_timeout || 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    };

    // Panggil Official Piston API (EMKC)
    // Ini menghilangkan ketergantungan pada Python/Node lokal di server (Vercel)
    const pistonRes = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!pistonRes.ok) {
      const errorText = await pistonRes.text();
      return NextResponse.json(
        { error: "Piston API Error", details: errorText },
        { status: pistonRes.status }
      );
    }

    const result = await pistonRes.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Run Code API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
