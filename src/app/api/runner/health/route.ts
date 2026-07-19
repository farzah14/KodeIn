import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Admin check - require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const baseUrl = process.env.PISTON_BASE_URL || "https://emkc.org";
    const url = `${baseUrl.replace(/\/$/, "")}/api/v2/piston/runtimes`;

    const headers: Record<string, string> = {};
    if (process.env.PISTON_AUTH_TOKEN) {
      headers["Authorization"] = process.env.PISTON_AUTH_TOKEN;
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "RUNNER_UNAVAILABLE" }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Runner health check failed:", error);
    return NextResponse.json({ ok: false, error: "RUNNER_UNAVAILABLE" }, { status: 503 });
  }
}
