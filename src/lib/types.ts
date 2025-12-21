export type Language = "python" | "javascript" | "sql";

export type StepType = "explain" | "code";

/**
 * JSONValue untuk testcases (aman untuk diserialisasi).
 * Cocok untuk input/output runner karena biasanya berbasis JSON.
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type PublicCase = {
  input: JsonValue[];   // sebelumnya: any[]
  output: JsonValue;    // sebelumnya: any
};

export type LessonStep =
  | {
      id: string;
      type: "explain";
      title: string;
      markdown: string;
    }
  | {
      id: string;
      type: "code";
      title: string;
      prompt: string;
      starterCode: string;
      functionName: string;
      hints: string[];
      publicCases: PublicCase[]; // sebelumnya: Array<{ input: any[]; output: any }>
    };

export type Lesson = {
  id: string;
  title: string;
  unitId: string;
  order: number;
  steps: LessonStep[];
};

export type Unit = {
  id: string;
  title: string;
  order: number;
  lessonIds: string[];
};

export type Course = {
  id: string;
  title: string;
  language: Language;
  unitIds: string[];
};

export type Content = {
  course: Course;
  units: Record<string, Unit>;
  lessons: Record<string, Lesson>;
};

export type RunnerRequest = {
  language: Language;
  code: string;
  functionName: string;
  publicCases: PublicCase[]; // sebelumnya: Array<{ input: any[]; output: any }>
  timeoutMs: number;
};

export type RunnerResponse =
  | { status: "pass"; stdout?: string; stderr?: string }
  | {
      status: "fail" | "error" | "timeout";
      stdout?: string;
      stderr?: string;
      friendlyMessage: string;
      hintIndexSuggested?: number;
    };
