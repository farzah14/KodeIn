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

  it("rejects lesson code that prints ALL_PASS without passing the tests", async () => {
    vi.mocked(executeCode).mockResolvedValue({
      success: true,
      run: {
        // Student code smuggled out "ALL_PASS" before a test failed.
        stdout: "ALL_PASS\n{error: \"Test case 1 gagal.\"}",
        stderr: "",
        code: 1,
        signal: null,
        output: "",
      },
    });

    const result = await verifyActivity({
      kind: "LESSON_STEP",
      activityId: "py-l1-s2",
      code: "def hello_world():\n    return \"nope\"\nprint(\"ALL_PASS\")",
    });
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.reason).toBe("TEST_FAILED");
    }
  });

  it("accepts a lesson only for an exact ALL_PASS marker on a zero exit code", async () => {
    vi.mocked(executeCode).mockResolvedValue({
      success: true,
      run: { stdout: "ALL_PASS", stderr: "", code: 0, signal: null, output: "" },
    });

    const result = await verifyActivity({
      kind: "LESSON_STEP",
      activityId: "py-l1-s2",
      code: "def hello_world():\n    return \"Hello World\"",
    });
    expect(result.passed).toBe(true);
    if (result.passed) {
      expect(result.xp).toBe(10);
    }
  });

  it("drops unresolved placeholder hidden cases for parameterized lesson steps", async () => {
    let builtScript = "";
    vi.mocked(executeCode).mockImplementation(async (_lang, source) => {
      builtScript = source;
      return {
        success: true,
        run: { stdout: "ALL_PASS", stderr: "", code: 0, signal: null, output: "" },
      };
    });

    const result = await verifyActivity({
      kind: "LESSON_STEP",
      activityId: "py-l3-s2", // calculate_power — public cases use inputs like [5, 2]
      code: "def calculate_power(a, b):\n    return a ** b",
    });

    expect(builtScript).not.toContain('"placeholder"');
    expect(result.passed).toBe(true);
  });

  it("skips fallback-sentinel hidden cases in practice challenges", async () => {
    const stdins: string[] = [];
    vi.mocked(executeCode).mockImplementation(async (lang, code, stdin) => {
      stdins.push(stdin ?? "");
      const outputs: Record<string, string> = {
        "5": "120",
        "0": "1",
        "10": "3628800",
      };
      return {
        success: true,
        run: {
          stdout: outputs[stdin ?? ""] ?? "sentinel-answer",
          stderr: "",
          code: 0,
          signal: null,
          output: "",
        },
      };
    });

    const result = await verifyActivity({
      kind: "PRACTICE",
      activityId: "factorial",
      code: "def factorial(n):\n    return 1",
    });

    expect(stdins).not.toContain("fallback-input");
    expect(result.passed).toBe(true);
  });
});
