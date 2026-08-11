import { describe, it, expect, vi, beforeEach } from "vitest";
import { executeCode } from "./piston";
import { EXECUTION_LIMITS } from "./types";

describe("executeCode Piston adapter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.PISTON_BASE_URL = "http://localhost:2000";
    process.env.PISTON_AUTH_TOKEN = "test-token";
  });

  it("rejects an unsupported language", async () => {
    const result = await executeCode("invalid-lang" as any, "print(1)");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("UNSUPPORTED_LANGUAGE");
    }
  });

  it("rejects source code over 20,000 UTF-8 bytes", async () => {
    const largeSource = "a".repeat(EXECUTION_LIMITS.sourceBytes + 1);
    const result = await executeCode("python", largeSource);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("PAYLOAD_TOO_LARGE");
    }
  });

  it("does not call fetch when PISTON_BASE_URL is absent", async () => {
    delete process.env.PISTON_BASE_URL;
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const result = await executeCode("python", "print(1)");

    expect(result).toEqual({ success: false, error: "RUNNER_NOT_CONFIGURED" });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("maps upstream failures to RUNNER_UNAVAILABLE without response-body leakage", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Sensitive Internal Server Error Stack Trace",
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await executeCode("python", "print(1)");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("RUNNER_UNAVAILABLE");
    }
  });
});
