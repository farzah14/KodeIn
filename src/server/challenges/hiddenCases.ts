import "server-only";

export type TestCase = {
  input: string;
  expectedOutput: string;
};

export type StepTestCase = {
  input: any[];
  output: any;
};

// Only fully specified cases belong here. Challenges without reviewed hidden
// cases use their public cases until real private cases are authored.
export const hiddenPracticeCases: Record<string, TestCase[]> = {
  "fizz-buzz": [
    { input: "30", expectedOutput: "FizzBuzz" },
    { input: "98", expectedOutput: "98" },
  ],
  "reverse-string": [
    { input: "hello world", expectedOutput: "dlrow olleh" },
  ],
  "sum-array": [
    { input: "[100,200,300]", expectedOutput: "600" },
  ],
  "is-palindrome": [
    { input: "step on no pets", expectedOutput: "True" },
  ],
  "count-vowels": [
    { input: "Beautiful Day", expectedOutput: "5" },
  ],
};

export const hiddenStepCases: Record<string, StepTestCase[]> = {};
