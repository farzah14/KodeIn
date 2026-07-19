import { EXECUTION_LIMITS, LANGUAGE_VERSIONS, SupportedLanguage, ExecutionResult } from "./types";

export async function executeCode(
  language: SupportedLanguage,
  source: string,
  stdin: string = ""
): Promise<ExecutionResult> {
  const version = LANGUAGE_VERSIONS[language];
  if (!version) {
    return { success: false, error: "UNSUPPORTED_LANGUAGE" };
  }

  // Enforce source code/stdin size limits
  const sourceByteLength = Buffer.byteLength(source, "utf-8");
  if (sourceByteLength > EXECUTION_LIMITS.sourceBytes) {
    return { success: false, error: "PAYLOAD_TOO_LARGE" };
  }

  const stdinByteLength = Buffer.byteLength(stdin, "utf-8");
  if (stdinByteLength > EXECUTION_LIMITS.stdinBytes) {
    return { success: false, error: "PAYLOAD_TOO_LARGE" };
  }

  const baseUrl = process.env.PISTON_BASE_URL || "https://emkc.org";
  const url = `${baseUrl.replace(/\/$/, "")}/api/v2/piston/execute`;

  const payload = {
    language,
    version,
    files: [
      {
        content: source,
      },
    ],
    stdin,
    compile_timeout: EXECUTION_LIMITS.compileTimeoutMs,
    run_timeout: EXECUTION_LIMITS.runTimeoutMs,
    compile_memory_limit: EXECUTION_LIMITS.memoryBytes,
    run_memory_limit: EXECUTION_LIMITS.memoryBytes,
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.PISTON_AUTH_TOKEN) {
    headers["Authorization"] = process.env.PISTON_AUTH_TOKEN;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(EXECUTION_LIMITS.upstreamTimeoutMs),
    });

    if (!res.ok) {
      console.error(`Piston runner reported HTTP ${res.status}`);
      return { success: false, error: "RUNNER_UNAVAILABLE" };
    }

    const data = await res.json();

    if (
      !data ||
      typeof data !== "object" ||
      !data.run ||
      typeof data.run !== "object" ||
      typeof data.run.stdout !== "string" ||
      typeof data.run.stderr !== "string" ||
      typeof data.run.code !== "number"
    ) {
      console.error("Invalid response structure from Piston runner");
      return { success: false, error: "RUNNER_UNAVAILABLE" };
    }

    const stdout = data.run.stdout.slice(0, EXECUTION_LIMITS.outputBytes);
    const stderr = data.run.stderr.slice(0, EXECUTION_LIMITS.outputBytes);
    const output = data.run.output ? data.run.output.slice(0, EXECUTION_LIMITS.outputBytes) : (stdout + stderr);
    const signal = typeof data.run.signal === "string" ? data.run.signal : null;

    return {
      success: true,
      run: {
        stdout,
        stderr,
        code: data.run.code,
        signal,
        output,
      },
    };
  } catch (error: any) {
    console.error("Piston execution failed:", error);
    if (error.name === "TimeoutError" || error.name === "AbortError" || error.message?.includes("timeout")) {
      return { success: false, error: "TIMEOUT" };
    }
    return { success: false, error: "RUNNER_UNAVAILABLE" };
  }
}
