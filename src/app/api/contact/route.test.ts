import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { sendContactEmail } from "@/lib/email";
import { checkDbRateLimit } from "@/server/rate-limit/dbRateLimit";

vi.mock("@/lib/email", () => ({ sendContactEmail: vi.fn() }));
vi.mock("@/server/rate-limit/dbRateLimit", () => ({
  checkDbRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
  clientIp: vi.fn().mockReturnValue("test-ip"),
  CONTACT_MAX_PER_IP: 5,
  CONTACT_WINDOW_MS: 600_000,
}));

function request(body: unknown) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  const originalRecipient = process.env.CONTACT_TO_EMAIL;

  beforeEach(() => {
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    vi.clearAllMocks();
    vi.mocked(checkDbRateLimit).mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    vi.mocked(sendContactEmail).mockResolvedValue(true);
  });

  afterEach(() => {
    if (originalRecipient === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = originalRecipient;
  });

  it("accepts valid contact and sends it to the configured recipient", async () => {
    const response = await POST(request({ name: "Ada", email: "ada@example.com", message: "Hello" }));

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ message: "CONTACT_ACCEPTED" });
    expect(sendContactEmail).toHaveBeenCalledWith({
      toEmail: "owner@example.com",
      fromName: "Ada",
      replyTo: "ada@example.com",
      message: "Hello",
    });
  });

  it("rejects empty and non-string values", async () => {
    expect((await POST(request({ name: {}, email: [], message: "Hello" }))).status).toBe(400);
    expect((await POST(request({ name: "Ada", email: "", message: "Hello" }))).status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 429 when the shared contact limit blocks the request", async () => {
    vi.mocked(checkDbRateLimit).mockResolvedValue({ allowed: false, retryAfterSeconds: 42 });

    const response = await POST(request({ name: "Ada", email: "ada@example.com", message: "Hello" }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("does not report success without recipient configuration or delivery", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    expect((await POST(request({ name: "Ada", email: "ada@example.com", message: "Hello" }))).status).toBe(503);

    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    vi.mocked(sendContactEmail).mockRejectedValue(new Error("smtp unavailable"));
    expect((await POST(request({ name: "Ada", email: "ada@example.com", message: "Hello" }))).status).toBe(503);
  });
});
