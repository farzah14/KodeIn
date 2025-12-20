import { Content } from "./types";

export const content: Content = {
  course: {
    id: "course-python-beginner",
    title: "Python Fundamentals (MVP)",
    language: "python",
    unitIds: ["unit-1", "unit-2", "unit-3"],
  },
  units: {
    "unit-1": {
      id: "unit-1",
      title: "Unit 1 — Basics",
      order: 1,
      lessonIds: ["py-l1", "py-l2", "py-l3"],
    },
    "unit-2": {
      id: "unit-2",
      title: "Unit 2 — Conditionals (Coming Soon)",
      order: 2,
      lessonIds: [],
    },
    "unit-3": {
      id: "unit-3",
      title: "Unit 3 — Loops (Coming Soon)",
      order: 3,
      lessonIds: [],
    },
  },
  lessons: {
    "py-l1": {
      id: "py-l1",
      unitId: "unit-1",
      order: 1,
      title: "L1 — Return Values",
      steps: [
        {
          id: "py-l1-s1",
          type: "explain",
          title: "Return",
          markdown:
            "Di MVP ini kita fokus **function-based**.\n\nGunakan `return` untuk mengembalikan nilai.\n\nContoh:\n```py\ndef double(n):\n    return n * 2\n```",
        },
        {
          id: "py-l1-s2",
          type: "code",
          title: "Buat fungsi double",
          prompt: "Tulis fungsi `double(n)` yang mengembalikan `n * 2`.",
          starterCode: "def double(n):\n    # TODO: return n * 2\n    pass\n",
          functionName: "double",
          hints: ["Gunakan `return`.", "Kalikan `n` dengan 2."],
          publicCases: [
            { input: [2], output: 4 },
            { input: [-3], output: -6 },
          ],
        },
      ],
    },
    "py-l2": {
      id: "py-l2",
      unitId: "unit-1",
      order: 2,
      title: "L2 — Modulo",
      steps: [
        {
          id: "py-l2-s1",
          type: "explain",
          title: "Modulo (%)",
          markdown:
            "`a % b` adalah sisa pembagian.\n\nContoh: `7 % 2 == 1`.\n\nKita pakai ini untuk cek genap/ganjil.",
        },
        {
          id: "py-l2-s2",
          type: "code",
          title: "Cek genap",
          prompt: "Tulis fungsi `is_even(n)` yang mengembalikan `True` jika `n` genap.",
          starterCode: "def is_even(n):\n    # TODO\n    pass\n",
          functionName: "is_even",
          hints: ["Gunakan `n % 2`.", "Genap berarti sisanya 0."],
          publicCases: [
            { input: [2], output: true },
            { input: [3], output: false },
            { input: [0], output: true },
          ],
        },
      ],
    },
    "py-l3": {
      id: "py-l3",
      unitId: "unit-1",
      order: 3,
      title: "L3 — String",
      steps: [
        {
          id: "py-l3-s1",
          type: "explain",
          title: "String",
          markdown:
            "String adalah teks.\n\nKita bisa menggabungkan string dengan `+`.\n\nContoh:\n```py\n\"Hello, \" + name\n```",
        },
        {
          id: "py-l3-s2",
          type: "code",
          title: "Greet",
          prompt: "Tulis fungsi `greet(name)` yang mengembalikan `\"Hello, {name}\"`.",
          starterCode: "def greet(name):\n    # TODO\n    pass\n",
          functionName: "greet",
          hints: ["Gunakan f-string: `f\"Hello, {name}\"`."],
          publicCases: [
            { input: ["Ayu"], output: "Hello, Ayu" },
            { input: ["Budi"], output: "Hello, Budi" },
          ],
        },
      ],
    },
  },
};
