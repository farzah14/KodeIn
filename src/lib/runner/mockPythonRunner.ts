import { RunnerRequest, RunnerResponse } from "../types";

export async function mockPythonRunner(req: RunnerRequest): Promise<RunnerResponse> {
  const { code, functionName } = req;

  const hasDef = new RegExp(`def\\s+${functionName}\\s*\\(`).test(code);
  if (!hasDef) {
    return {
      status: "fail",
      friendlyMessage: `Saya tidak menemukan fungsi \`${functionName}(...)\`. Pastikan formatnya: def ${functionName}(...):`,
      hintIndexSuggested: 0,
    };
  }

  if (!/return\s+/.test(code)) {
    return {
      status: "fail",
      friendlyMessage: "Fungsi Anda belum mengembalikan nilai. Gunakan `return ...`.",
      hintIndexSuggested: 0,
    };
  }

  // Mock pass
  return { status: "pass" };
}
