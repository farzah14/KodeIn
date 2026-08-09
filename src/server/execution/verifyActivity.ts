import "server-only";
import { content } from "@/lib/content";
import { practiceChallenges } from "@/lib/practiceChallenges";
import { executeCode } from "./piston";
import { hiddenPracticeCases, hiddenStepCases, isFallbackHiddenTestCase } from "../challenges/hiddenCases";

export type VerificationRequest =
  | { kind: "LESSON_STEP"; activityId: string; code?: string }
  | { kind: "PRACTICE"; activityId: string; code: string };

export type VerificationResult =
  | { passed: true; xp: number }
  | { passed: false; reason: "INVALID_ACTIVITY" | "CODE_REQUIRED" | "TEST_FAILED" | "RUNNER_UNAVAILABLE" };

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

      // Map placeholders in hiddenCases to publicCase outputs and drop the
      // hidden case entirely when it cannot be resolved. An unresolved
      // "placeholder" would be graded against the literal string and make the
      // step impossible to pass.
      const resolvedHiddenCases = hiddenCases
        .map((hc) => {
          let output = hc.output;
          if (output === "placeholder") {
            const matchingPublic = publicCases.find(
              (pc: any) => JSON.stringify(pc.input) === JSON.stringify(hc.input)
            );
            if (matchingPublic) {
              output = matchingPublic.output;
            }
          }
          return { input: hc.input, output };
        })
        .filter((hc) => hc.output !== "placeholder");

      const allCases = [...publicCases, ...resolvedHiddenCases];

      // Construct test script
      const testScript = `
import sys
import json
import traceback

# --- USER CODE START ---
${req.code}
# --- USER CODE END ---

def __run_tests():
    cases = ${JSON.stringify(allCases)}
    
    for i, c in enumerate(cases):
        inputs = c["input"]
        expected = c["output"]
        try:
            if '${functionName}' not in globals():
                print(json.dumps({"error": f"Fungsi '${functionName}' tidak ditemukan di global scope."}))
                sys.exit(1)
                
            func = globals()['${functionName}']
            
            # Special class test handling
            if '${functionName}' == 'Calculator':
                obj = func()
                result = obj.add(inputs[0], inputs[1])
            elif '${functionName}' == 'Account':
                obj = func()
                obj.deposit(inputs[0])
                result = obj.balance
            elif '${functionName}' == 'Database':
                obj = func()
                obj.add_item(inputs[0], inputs[1])
                result = obj.get_item(inputs[0])
            else:
                result = func(*inputs)
            
            if isinstance(result, tuple):
                result = list(result)
            
            if result != expected:
                print(json.dumps({
                    "error": f"Test case {i+1} gagal.",
                    "details": f"Input: {inputs} | Expected: {expected} | Got: {result}"
                }))
                sys.exit(1)
        except Exception as e:
            err_msg = "".join(traceback.format_exception_only(type(e), e)).strip()
            print(json.dumps({
                "error": f"Error eksekusi di test case {i+1}.",
                "details": err_msg
            }))
            sys.exit(1)
    print("ALL_PASS")

if __name__ == '__main__':
    __run_tests()
`;

      // Run test script through piston
      const execution = await executeCode("python", testScript);
      if (!execution.success) {
        return { passed: false, reason: execution.error === "TIMEOUT" ? "TEST_FAILED" : "RUNNER_UNAVAILABLE" };
      }

      // Anti-cheat: the grader only emits "ALL_PASS" when every test passed.
      // Accept it only as the exact, whole output of a zero-exit-code process.
      // Checking "includes" allowed student code running before the tests to
      // print "ALL_PASS" and be rewarded for an empty solution.
      const stdout = execution.run.stdout.trim();
      if (stdout === "ALL_PASS" && execution.run.code === 0) {
        return { passed: true, xp: 10 };
      }

      return { passed: false, reason: "TEST_FAILED" };
    }
  } else if (req.kind === "PRACTICE") {
    // 1. Find practice challenge
    const challenge = practiceChallenges.find((c) => c.id === req.activityId);
    if (!challenge) {
      return { passed: false, reason: "INVALID_ACTIVITY" };
    }

    const publicCases = challenge.testCases || [];
    // Unimplemented hidden cases use "fallback-input"/"fallback-output"
    // sentinels. They are not real tests: skip them so the challenge can be
    // completed on its public cases instead of failing forever.
    const hiddenCases = (hiddenPracticeCases[req.activityId] || []).filter(
      (c) => !isFallbackHiddenTestCase(c)
    );

    // We run each case separately
    const allCases = [
      ...publicCases.map((c) => ({ input: c.input, expected: c.expectedOutput })),
      ...hiddenCases.map((c) => ({ input: c.input, expected: c.expectedOutput })),
    ];

    for (const tc of allCases) {
      const execution = await executeCode("python", req.code, tc.input);
      if (!execution.success) {
        return { passed: false, reason: execution.error === "TIMEOUT" ? "TEST_FAILED" : "RUNNER_UNAVAILABLE" };
      }

      if (execution.run.stdout.trim() !== tc.expected.trim()) {
        return { passed: false, reason: "TEST_FAILED" };
      }
    }

    return { passed: true, xp: challenge.xp };
  }

  return { passed: false, reason: "INVALID_ACTIVITY" };
}
