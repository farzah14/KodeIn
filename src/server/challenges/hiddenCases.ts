import "server-only";

export type TestCase = {
  input: string;
  expectedOutput: string;
};

export type StepTestCase = {
  input: any[];
  output: any;
};

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
  "max-in-array": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "factorial": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "is-anagram": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "fibonacci": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "two-sum": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "count-words": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "power-of-two": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "remove-duplicates": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "celsius-to-fahrenheit": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "is-prime": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "string-uppercase": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "min-max-diff": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "count-char": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "flatten-array": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "gcd": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "valid-parentheses": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "longest-common-prefix": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "missing-number": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "reverse-words": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "move-zeros": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "second-largest": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "roman-to-integer": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "frequency-map": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "binary-search": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "pangram": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "intersection-arrays": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "rotate-array": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "title-case": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "sum-digits": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "longest-word": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "count-occurrences": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "is-sorted": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "even-odd-split": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "string-compression": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "product-except-self": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "count-primes": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "balanced-string": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "matrix-diagonal": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "zigzag-array": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "number-to-binary": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "longest-substring": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "transpose-matrix": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "sum-of-squares": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "group-anagrams": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
  "max-subarray": [
    { input: "fallback-input", expectedOutput: "fallback-output" },
  ],
};

export const hiddenStepCases: Record<string, StepTestCase[]> = {
  "py-l1-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l2-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l3-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l4-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l5-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l6-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l7-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l8-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l9-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l10-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l11-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l12-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l13-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l14-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l15-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l16-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l17-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l18-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l19-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l20-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l21-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l22-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l23-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l24-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l25-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l26-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l27-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l28-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l29-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l30-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l31-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l32-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l33-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l34-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l35-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l36-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l37-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l38-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l39-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l40-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l41-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l42-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l43-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l44-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l45-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l46-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l47-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l48-s2": [
    { input: [], output: "placeholder" },
  ],
  "py-l49-s2": [
    { input: [], output: "placeholder" },
  ],
};
