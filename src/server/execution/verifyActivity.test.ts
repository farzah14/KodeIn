import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyActivity } from "./verifyActivity";
import { executeCode } from "./piston";
import { content } from "@/lib/content";
import { practiceChallenges } from "@/lib/practiceChallenges";
import { hiddenPracticeCases, hiddenStepCases } from "../challenges/hiddenCases";

vi.mock("server-only", () => ({}));

vi.mock("./piston", () => ({
  executeCode: vi.fn(),
}));

describe("verifyActivity verifier", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("asserts every code activity has a hidden-case entry", () => {
    // Check practice challenges
    for (const challenge of practiceChallenges) {
      expect(hiddenPracticeCases[challenge.id]).toBeDefined();
      expect(hiddenPracticeCases[challenge.id].length).toBeGreaterThan(0);
    }

    // Check lesson code steps
    for (const lesson of Object.values(content.lessons)) {
      for (const step of lesson.steps) {
        if (step.type === "code") {
          expect(hiddenStepCases[step.id]).toBeDefined();
          expect(hiddenStepCases[step.id].length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("rejects a code step completion when no code is supplied", async () => {
    const result = await verifyActivity({
      kind: "LESSON_STEP",
      activityId: "py-l1-s2",
    });
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.reason).toBe("CODE_REQUIRED");
    }
  });

  it("rejects a practice completion when server tests fail", async () => {
    vi.mocked(executeCode).mockResolvedValue({
      success: true,
      run: { stdout: "Wrong Output", stderr: "", code: 0, signal: null, output: "Wrong Output" },
    });

    const result = await verifyActivity({
      kind: "PRACTICE",
      activityId: "fizz-buzz",
      code: "def fizz_buzz(n): return n",
    });
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.reason).toBe("TEST_FAILED");
    }
  });

  it("awards completion only after server verification passes", async () => {
    vi.mocked(executeCode).mockImplementation(async (lang, code, stdin) => {
      let stdout = "";
      if (stdin === "3") stdout = "Fizz";
      else if (stdin === "5") stdout = "Buzz";
      else if (stdin === "15") stdout = "FizzBuzz";
      else if (stdin === "7") stdout = "7";
      else if (stdin === "30") stdout = "FizzBuzz";
      else if (stdin === "98") stdout = "98";
      else stdout = "placeholder";

      return {
        success: true,
        run: { stdout, stderr: "", code: 0, signal: null, output: stdout },
      };
    });

    const result = await verifyActivity({
      kind: "PRACTICE",
      activityId: "fizz-buzz",
      code: "some-correct-code",
    });

    expect(result.passed).toBe(true);
    if (result.passed) {
      expect(result.xp).toBe(50);
    }
  });
});
