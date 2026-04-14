export type BattleChallenge = {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  language: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
};

export const battleChallenges: BattleChallenge[] = [
  {
    id: "sum-array",
    title: "Sum of Array",
    description: "Write a function `solve(arr)` that returns the sum of all numbers in the array `arr`.",
    starterCode: "def solve(arr):\n    # Write your code here\n    pass\n\n# Do not change below code\nimport sys\nimport json\narr = json.loads(sys.stdin.read())\nprint(solve(arr))",
    language: "python",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "15\n" },
      { input: "[-1, 10, 5]", expectedOutput: "14\n" }
    ]
  },
  {
    id: "is-palindrome",
    title: "Palindrome Check",
    description: "Write a function `solve(s)` that returns `True` if string `s` is a palindrome, and `False` otherwise.",
    starterCode: "def solve(s):\n    # Write your code here\n    pass\n\n# Do not change below code\nimport sys\ns = sys.stdin.read().strip()\nprint(solve(s))",
    language: "python",
    testCases: [
      { input: "racecar", expectedOutput: "True\n" },
      { input: "hello", expectedOutput: "False\n" }
    ]
  },
  {
    id: "fizz-buzz",
    title: "Fizz Buzz Single",
    description: "Write a function `solve(n)` that returns 'Fizz' if `n` is divisible by 3, 'Buzz' if divisible by 5, 'FizzBuzz' if both, or the number `n` as string if none.",
    starterCode: "def solve(n):\n    # Write your code here\n    pass\n\n# Do not change below code\nimport sys\nn = int(sys.stdin.read())\nprint(solve(n))",
    language: "python",
    testCases: [
      { input: "3", expectedOutput: "Fizz\n" },
      { input: "5", expectedOutput: "Buzz\n" },
      { input: "15", expectedOutput: "FizzBuzz\n" },
      { input: "7", expectedOutput: "7\n" }
    ]
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description: "Write a function `solve(s)` that returns the reverse of string `s`.",
    starterCode: "def solve(s):\n    # Write your code here\n    pass\n\n# Do not change below code\nimport sys\ns = sys.stdin.read().strip()\nprint(solve(s))",
    language: "python",
    testCases: [
      { input: "kodein", expectedOutput: "niedok\n" },
      { input: "python", expectedOutput: "nohtyp\n" }
    ]
  }
];

export function getRandomChallenge() {
  const index = Math.floor(Math.random() * battleChallenges.length);
  return battleChallenges[index];
}
