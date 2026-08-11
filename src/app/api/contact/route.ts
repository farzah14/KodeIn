import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { isRecord, nonEmptyString } from "@/server/http/validation";
import {
  checkDbRateLimit,
  clientIp,
  CONTACT_MAX_PER_IP,
  CONTACT_WINDOW_MS,
} from "@/server/rate-limit/dbRateLimit";
import { rateLimited } from "@/server/rate-limit/responses";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request): Promise<NextResponse> {
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_CONTACT_INPUT" }, { status: 400 });
  }

  if (!isRecord(rawBody)) {
    return NextResponse.json({ error: "INVALID_CONTACT_INPUT" }, { status: 400 });
  }

  const name = nonEmptyString(rawBody.name);
  const email = nonEmptyString(rawBody.email);
  const message = nonEmptyString(rawBody.message);
  if (!name || !email || !message || !emailPattern.test(email)) {
    return NextResponse.json({ error: "INVALID_CONTACT_INPUT" }, { status: 400 });
  }

  const check = await checkDbRateLimit(`contact:${clientIp(req)}`, {
    windowMs: CONTACT_WINDOW_MS,
    max: CONTACT_MAX_PER_IP,
  });
  if (!check.allowed) return rateLimited(check.retryAfterSeconds);

  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  if (!toEmail) {
    return NextResponse.json({ error: "CONTACT_DELIVERY_UNAVAILABLE" }, { status: 503 });
  }

  try {
    await sendContactEmail({ toEmail, fromName: name, replyTo: email, message });
    return NextResponse.json({ message: "CONTACT_ACCEPTED" }, { status: 202 });
  } catch (error) {
    console.error("Contact email delivery failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "CONTACT_DELIVERY_UNAVAILABLE" }, { status: 503 });
  }
}
