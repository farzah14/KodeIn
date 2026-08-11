import "server-only";
import { content } from "@/lib/content";
import { practiceChallenges } from "@/lib/practiceChallenges";
import { executeCode } from "./piston";
import { hiddenPracticeCases, hiddenStepCases } from "../challenges/hiddenCases";

export type VerificationRequest =
  | { kind: "LESSON_STEP"; activityId: string; code?: string }
  | { kind: "PRACTICE"; activityId: string; code: string };

export type VerificationResult =
  | { passed: true; xp: number }
  | { passed: false; reason: "INVALID_ACTIVITY" | "CODE_REQUIRED" | "TEST_FAILED" | "RUNNER_NOT_CONFIGURED" | "RUNNER_UNAVAILABLE" };

function buildLessonHarness(userCode: string, functionName: string, input: unknown[]): string {
  const payload = JSON.stringify(JSON.stringify({ input }));
  const name = JSON.stringify(functionName);

  return `${userCode}
import json

payload = json.loads(${payload})
inputs = payload["input"]
function_name = ${name}
if function_name not in globals():
    raise RuntimeError(f"Fungsi {function_name} tidak ditemukan di global scope.")

func = globals()[function_name]
if function_name == "Calculator":
    obj = func()
    result = obj.add(inputs[0], inputs[1])
elif function_name == "Account":
    obj = func()
    obj.deposit(inputs[0])
    result = obj.balance
elif function_name == "Database":
    obj = func()
    obj.add_item(inputs[0], inputs[1])
    result = obj.get_item(inputs[0])
else:
    result = func(*inputs)

if isinstance(result, tuple):
    result = list(result)
print(json.dumps(result))
`;
}

export async function verifyActivity(req: VerificationRequest): Promise<VerificationResult> {
  if (req.kind === "LESSON_STEP") {
    // 1. Find step
    let foundStep: any = null;
    for (const lesson of Object.values(content.lessons)) {
      const step = lesson.steps.find((s) => s.id === req.activityId);
      if (step) {
        foundStep = step;
        break;
      }
    }

    if (!foundStep) {
      return { passed: false, reason: "INVALID_ACTIVITY" };
    }

    if (foundStep.type === "explain") {
      return { passed: true, xp: 2 };
    }

    if (foundStep.type === "code") {
      if (!req.code) {
        return { passed: false, reason: "CODE_REQUIRED" };
      }

      const functionName = foundStep.functionName;
      const publicCases = foundStep.publicCases || [];
      const hiddenCases = hiddenStepCases[req.activityId] || [];

      const allCases = [...publicCases, ...hiddenCases];

      for (const testCase of allCases) {
        const execution = await executeCode(
          "python",
          buildLessonHarness(req.code, functionName, testCase.input)
        );
        if (!execution.success) {
          return {
            passed: false,
            reason: execution.error === "TIMEOUT"
              ? "TEST_FAILED"
              : execution.error === "RUNNER_NOT_CONFIGURED"
                ? "RUNNER_NOT_CONFIGURED"
                : "RUNNER_UNAVAILABLE",
          };
        }

        if (execution.run.code !== 0) {
          return { passed: false, reason: "TEST_FAILED" };
        }

        let actual: unknown;
        try {
          actual = JSON.parse(execution.run.stdout.trim());
        } catch {
          return { passed: false, reason: "TEST_FAILED" };
        }

        if (JSON.stringify(actual) !== JSON.stringify(testCase.output)) {
          return { passed: false, reason: "TEST_FAILED" };
        }
      }

      return { passed: true, xp: 10 };
    }
  } else if (req.kind === "PRACTICE") {
    // 1. Find practice challenge
    const challenge = practiceChallenges.find((c) => c.id === req.activityId);
    if (!challenge) {
      return { passed: false, reason: "INVALID_ACTIVITY" };
    }

    const publicCases = challenge.testCases || [];
    const hiddenCases = hiddenPracticeCases[req.activityId] || [];

    // We run each case separately
    const allCases = [
      ...publicCases.map((c) => ({ input: c.input, expected: c.expectedOutput })),
      ...hiddenCases.map((c) => ({ input: c.input, expected: c.expectedOutput })),
    ];

    for (const tc of allCases) {
      const execution = await executeCode("python", req.code, tc.input);
      if (!execution.success) {
        return {
          passed: false,
          reason: execution.error === "TIMEOUT"
            ? "TEST_FAILED"
            : execution.error === "RUNNER_NOT_CONFIGURED"
              ? "RUNNER_NOT_CONFIGURED"
              : "RUNNER_UNAVAILABLE",
        };
      }

      if (execution.run.stdout.trim() !== tc.expected.trim()) {
        return { passed: false, reason: "TEST_FAILED" };
      }
    }

    return { passed: true, xp: challenge.xp };
  }

  return { passed: false, reason: "INVALID_ACTIVITY" };
}
