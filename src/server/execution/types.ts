export const EXECUTION_LIMITS = {
  sourceBytes: 20_000,
  stdinBytes: 4_000,
  outputBytes: 20_000,
  compileTimeoutMs: 5_000,
  runTimeoutMs: 3_000,
  upstreamTimeoutMs: 8_000,
  memoryBytes: 128 * 1024 * 1024,
} as const;

export const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  javascript: "18.15.0",
  typescript: "5.0.3",
  go: "1.16.2",
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_VERSIONS;

export type ExecutionResult =
  | { 
      success: true; 
      run: { 
        stdout: string; 
        stderr: string; 
        code: number; 
        signal: string | null; 
        output: string; 
      };
    }
  | { 
      success: false; 
      error: "UNSUPPORTED_LANGUAGE" | "PAYLOAD_TOO_LARGE" | "RUNNER_UNAVAILABLE" | "TIMEOUT" | "UNKNOWN_ERROR";
    };
