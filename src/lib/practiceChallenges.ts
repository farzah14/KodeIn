export type PracticeChallenge = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Array" | "String" | "Math" | "Logic";
  xp: number;
  starterCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
};

export const practiceChallenges: PracticeChallenge[] = [
  {
    id: "fizz-buzz",
    title: "FizzBuzz Classic",
    description: "Tulis fungsi `fizz_buzz(n)` yang mengembalikan string 'Fizz' jika n habis dibagi 3, 'Buzz' jika habis dibagi 5, dan 'FizzBuzz' jika habis dibagi keduanya. Jika tidak keduanya, kembalikan angka tersebut sebagai string.",
    difficulty: "Easy",
    category: "Logic",
    xp: 50,
    starterCode: `def fizz_buzz(n):\n    # Tulis kodemu di sini\n    pass\n\n# Jangan ubah kode di bawah ini\nimport sys\nn = int(sys.stdin.read().strip())\nprint(fizz_buzz(n))`,
    testCases: [
      { input: "3", expectedOutput: "Fizz" },
      { input: "5", expectedOutput: "Buzz" },
      { input: "15", expectedOutput: "FizzBuzz" },
      { input: "7", expectedOutput: "7" },
    ]
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description: "Tulis fungsi `reverse_string(s)` yang membalikkan urutan karakter dalam sebuah string.",
    difficulty: "Easy",
    category: "String",
    xp: 50,
    starterCode: `def reverse_string(s):\n    # Tulis kodemu di sini\n    pass\n\n# Jangan ubah kode di bawah ini\nimport sys\ns = sys.stdin.read().strip()\nprint(reverse_string(s))`,
    testCases: [
      { input: "kodein", expectedOutput: "niedok" },
      { input: "hello", expectedOutput: "olleh" },
      { input: "python", expectedOutput: "nohtyp" },
    ]
  },
  {
    id: "sum-array",
    title: "Total Array",
    description: "Tulis fungsi `sum_array(arr)` yang menjumlahkan semua angka di dalam sebuah list/array.",
    difficulty: "Easy",
    category: "Array",
    xp: 75,
    starterCode: `import json\n\ndef sum_array(arr):\n    # Tulis kodemu di sini\n    pass\n\n# Jangan ubah kode di bawah ini\nimport sys\narr = json.loads(sys.stdin.read().strip())\nprint(sum_array(arr))`,
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "15" },
      { input: "[-1, 10, 5]", expectedOutput: "14" },
      { input: "[]", expectedOutput: "0" },
    ]
  },
  {
    id: "is-palindrome",
    title: "Cek Palindrom",
    description: "Tentukan apakah sebuah string adalah palindrom (dibaca sama dari depan maupun belakang). Mengembalikan 'True' atau 'False'.",
    difficulty: "Medium",
    category: "String",
    xp: 100,
    starterCode: `def is_palindrome(s):\n    # Tulis kodemu di sini\n    pass\n\n# Jangan ubah kode di bawah ini\nimport sys\ns = sys.stdin.read().strip()\nprint(is_palindrome(s))`,
    testCases: [
      { input: "radar", expectedOutput: "True" },
      { input: "level", expectedOutput: "True" },
      { input: "kodein", expectedOutput: "False" },
      { input: "a", expectedOutput: "True" },
    ]
  }
];
