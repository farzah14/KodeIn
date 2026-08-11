import { NextResponse } from "next/server";

/**
 * Shared 429 response for the fixed 1-minute execution quota. All quota
 * routes previously hand-rolled the same message + Retry-After header.
 */
export function executionQuotaExceeded(): NextResponse {
  return NextResponse.json(
    { error: "Too many execution requests. Please try again after 1 minute." },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}

/**
 * Shared 429 response for per-IP/auth rate limits with a dynamic retry hint.
 */
export function rateLimited(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${retryAfterSeconds} detik.` },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}