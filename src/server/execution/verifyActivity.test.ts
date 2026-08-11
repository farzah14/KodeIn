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

  it("does not ship fallback or placeholder hidden-test data", () => {
    const serialized = JSON.stringify({ hiddenPracticeCases, hiddenStepCases });
    expect(serialized).not.toContain("fallback-input");
    expect(serialized).not.toContain("fallback-output");
    expect(serialized).not.toContain("placeholder");
  });

  it("keeps reviewed hidden cases aligned with known activities", () => {
    for (const challenge of practiceChallenges) {
      for (const testCase of hiddenPracticeCases[challenge.id] || []) {
        expect(testCase.input).toEqual(expect.any(String));
        expect(testCase.expectedOutput).toEqual(expect.any(String));
      }
    }

    for (const lesson of Object.values(content.lessons)) {
      for (const step of lesson.steps) {
        for (const testCase of hiddenStepCases[step.id] || []) {
          expect(testCase.input).toEqual(expect.any(Array));
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

  it("accepts a lesson when every isolated case returns the expected JSON", async () => {
    vi.mocked(executeCode).mockResolvedValue({
      success: true,
      run: { stdout: JSON.stringify("Hello World"), stderr: "", code: 0, signal: null, output: "" },
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

  it("does not add unreviewed hidden cases to a lesson script", async () => {
    let builtScript = "";
    let call = 0;
    vi.mocked(executeCode).mockImplementation(async (_lang, source) => {
      builtScript = source;
      const stdout = ["25", "8"][call++];
      return {
        success: true,
        run: { stdout, stderr: "", code: 0, signal: null, output: stdout },
      };
    });

    const result = await verifyActivity({
      kind: "LESSON_STEP",
      activityId: "py-l3-s2", // calculate_power — public cases use inputs like [5, 2]
      code: "def calculate_power(a, b):\n    return a ** b",
    });

    expect(builtScript).not.toContain("placeholder");
    expect(result.passed).toBe(true);
  });

  it("keeps lesson expected outputs out of the learner process", async () => {
    const scripts: string[] = [];
    vi.mocked(executeCode).mockImplementation(async (_lang, source) => {
      scripts.push(source);
      return {
        success: true,
        run: { stdout: "25", stderr: "", code: 0, signal: null, output: "25" },
      };
    });

    await verifyActivity({
      kind: "LESSON_STEP",
      activityId: "py-l3-s2",
      code: "def calculate_power(a, b):\n    return a ** b",
    });

    expect(scripts).not.toHaveLength(0);
    expect(scripts.every((script) => !script.includes('"output":25'))).toBe(true);
  });

  it("runs public cases when no reviewed hidden cases exist", async () => {
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
