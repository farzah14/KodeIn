import { Content } from "./types";

export const content: Content = {
  course: {
    id: "course-python-beginner",
    title: "Python Mastery Path",
    language: "python",
    unitIds: ["unit-1", "unit-2", "unit-3", "unit-4", "unit-5", "unit-6", "unit-7", "unit-8", "unit-9", "unit-10"],
  },
  units: {
    "unit-1": {
      id: "unit-1",
      title: "Unit 1 — Basics",
      order: 1,
      lessonIds: ["py-l1", "py-l2", "py-l3", "py-l4", "py-l5"],
    },
    "unit-2": {
      id: "unit-2",
      title: "Unit 2 — Conditionals",
      order: 2,
      lessonIds: ["py-l6", "py-l7", "py-l8", "py-l9", "py-l10", "py-l11"],
    },
    "unit-3": {
      id: "unit-3",
      title: "Unit 3 — Loops",
      order: 3,
      lessonIds: ["py-l12", "py-l13", "py-l14", "py-l15", "py-l16", "py-l17"],
    },
    "unit-4": {
      id: "unit-4",
      title: "Unit 4 — List & Tuple",
      order: 4,
      lessonIds: ["py-l18", "py-l19", "py-l20", "py-l21", "py-l22", "py-l23"],
    },
    "unit-5": {
      id: "unit-5",
      title: "Unit 5 — Dictionary & Set",
      order: 5,
      lessonIds: ["py-l24", "py-l25", "py-l26", "py-l27"],
    },
    "unit-6": {
      id: "unit-6",
      title: "Unit 6 — Fungsi Lanjutan",
      order: 6,
      lessonIds: ["py-l28", "py-l29", "py-l30", "py-l31", "py-l32"],
    },
    "unit-7": {
      id: "unit-7",
      title: "Unit 7 — String Lanjutan",
      order: 7,
      lessonIds: ["py-l33", "py-l34", "py-l35"],
    },
    "unit-8": {
      id: "unit-8",
      title: "Unit 8 — Error Handling",
      order: 8,
      lessonIds: ["py-l36", "py-l37", "py-l38"],
    },
    "unit-9": {
      id: "unit-9",
      title: "Unit 9 — OOP (Object-Oriented Programming)",
      order: 9,
      lessonIds: ["py-l39", "py-l40", "py-l41", "py-l42", "py-l43", "py-l44"],
    },
    "unit-10": {
      id: "unit-10",
      title: "Unit 10 — Mini Projects (Capstone)",
      order: 10,
      lessonIds: ["py-l45", "py-l46", "py-l47", "py-l48", "py-l49"],
    },
  },
  lessons: {
    "py-l1": {
      id: "py-l1",
      unitId: "unit-1",
      order: 1,
      title: "L1 — Python Syntax & Comments",
      steps: [
        {
          id: "py-l1-s1",
          type: "explain",
          title: "Sintaks & Komentar",
          markdown:
            "Selamat datang di dunia Python! 🐍\n\nPython adalah bahasa yang sangat populer karena **mudah dibaca** dan **kekuataannya**. Salah satu ciri khas utamanya adalah penggunaan **Indentasi**.\n\n### 1. Indentasi (Spasi)\nDi bahasa lain, kita sering melihat `{ }`. Di Python, kita menggunakan spasi di awal baris untuk menentukan 'milik siapa' sebuah kode tersebut.\n```py\ndef perkenalan():\n    # Kode ini masuk ke dalam fungsi perkenalan karena menjorok\n    print(\"Halo, aku Python!\")\n```\n\n### 2. Komentar\nKomentar dimulai dengan simbol `#`. Semua yang ada setelah simbol ini di baris tersebut akan **diabaikan** oleh komputer. Gunakan ini untuk menjelaskan isi kodemu agar tidak lupa!",
        },
        {
          id: "py-l1-s2",
          type: "code",
          title: "Indentasi & Komentar",
          prompt: "Buatlah fungsi `hello_world()` yang:\n1. Memiliki satu baris komentar bebas.\n2. Mengembalikan string `\"Hello World\"`.\n\nPastikan indentasi (spasi) di dalam fungsi sudah benar!",
          starterCode: "def hello_world():\n# Tulis komentar di sini\n# Kembalikan \"Hello World\"\npass",
          functionName: "hello_world",
          hints: ["Gunakan 4 spasi untuk indentasi di dalam fungsi.", "Komentar dimulai dengan `#`.", "Jangan lupa tanda petik untuk string."],
          publicCases: [
            { input: [], output: "Hello World" },
          ],
        },
      ],
    },
    "py-l2": {
      id: "py-l2",
      unitId: "unit-1",
      order: 2,
      title: "L2 — Python Variables",
      steps: [
        {
          id: "py-l2-s1",
          type: "explain",
          title: "Variabel & Penamaan",
          markdown:
            "Variabel adalah **wadah** bayangan untuk menyimpan nilai. Bayangkan variabel sebagai sebuah kotak dengan label nama di luarnya.\n\n### Aturan Main Nama Variabel:\n*   **Mulai dengan huruf** (`a-z`) atau garis bawah (`_`).\n*   **Tidak boleh** mulai dengan angka.\n*   **Case-Sensitive**: `nama` dan `Nama` adalah dua kotak yang berbeda!\n\n### Trik Cepat: Multiple Assignment\nKamu bisa mengisi banyak kotak sekaligus hanya dalam satu baris:\n```py\nx, y, z = \"Merah\", \"Kuning\", \"Hijau\"\n```\nIni membuat kodemu terlihat lebih bersih dan profesional! ✨",
        },
        {
          id: "py-l2-s2",
          type: "code",
          title: "Multiple Assignment",
          prompt: "Buatlah fungsi `get_fruit()` yang:\n1. Mengisi variabel `a, b, c` sekaligus dengan nilai `\"Apel\"`, `\"Pisang\"`, dan `\"Ceri\"` dalam **satu baris**.\n2. Mengembalikan variabel `b` (yang berisi `\"Pisang\"`).",
          starterCode: "def get_fruit():\n    # TODO: Assign a, b, c dalam satu baris\n    # return b\n    pass",
          functionName: "get_fruit",
          hints: ["Gunakan format `a, b, c = \"...\", \"...\", \"...\"`.", "Pastikan urutannya benar sesuai permintaan."],
          publicCases: [
            { input: [], output: "Pisang" },
          ],
        },
      ],
    },
    "py-l3": {
      id: "py-l3",
      unitId: "unit-1",
      order: 3,
      title: "L3 — Data Types & Numbers",
      steps: [
        {
          id: "py-l3-s1",
          type: "explain",
          title: "Tipe Data & Angka",
          markdown:
            "Python sangat pintar mengenali jenis data yang kamu simpan. Berikut adalah 'pemeran utama' dalam tipe data:\n\n*   **int**: Bilangan bulat (contoh: `10`, `-5`).\n*   **float**: Bilangan desimal (contoh: `3.14`, `1.0`).\n*   **str**: Teks atau String (harus diapit tanda kutip `\"` atau `'`).\n*   **bool**: Logika benar/salah (`True` atau `False`).\n\n### Operator Matematika Canggih:\nSelain `+` dan `-`, perhatikan ini:\n- `**` : Pangkat (Contoh: `5 ** 2` hasilnya 25).\n- `%` : Modulo (Sisa bagi, contoh: `10 % 3` hasilnya 1).\n- `//` : Floor Division (Pembagian bulat, mengabaikan koma).",
        },
        {
          id: "py-l3-s2",
          type: "code",
          title: "Operator Pangkat & Sisa",
          prompt: "Buatlah fungsi `calculate_power(a, b)` yang mengembalikan **pangkat** dari `a` terhadap `b` (a pangkat b).",
          starterCode: "def calculate_power(a, b):\n    # TODO: return a pangkat b\n    pass",
          functionName: "calculate_power",
          hints: ["Gunakan operator `**`.", "Contoh: `a ** b`."],
          publicCases: [
            { input: [5, 2], output: 25 },
            { input: [2, 3], output: 8 },
          ],
        },
      ],
    },
    "py-l4": {
      id: "py-l4",
      unitId: "unit-1",
      order: 4,
      title: "L4 — Python Strings & Slicing",
      steps: [
        {
          id: "py-l4-s1",
          type: "explain",
          title: "String & Slicing",
          markdown:
            "String adalah susunan karakter yang diapit tanda kutip. Kamu bisa mengakses karakter tertentu menggunakan kurung siku `[]` (dimulai dari 0).\n\n**Slicing (Memotong):**\nKamu bisa mengambil rentang karakter dengan format `[start:end]`.\n- `a[2:5]`: Karakter dari index 2 sampai 4 (5 tidak termasuk).\n- `a[:5]`: Dari awal sampai index 4.\n- `a[2:]`: Dari index 2 sampai akhir.",
        },
        {
          id: "py-l4-s2",
          type: "code",
          title: "Potong String",
          prompt: "Buatlah fungsi `get_first_five(text)` yang mengembalikan **5 karakter pertama** dari parameter `text`.",
          starterCode: "def get_first_five(text):\n    # TODO: return 5 karakter pertama\n    pass",
          functionName: "get_first_five",
          hints: ["Gunakan slicing: `[:5]`.", "Pastikan index akhir adalah 5."],
          publicCases: [
            { input: ["Hello World"], output: "Hello" },
            { input: ["Pythonista"], output: "Pytho" },
          ],
        },
      ],
    },
    "py-l5": {
      id: "py-l5",
      unitId: "unit-1",
      order: 5,
      title: "L5 — String Methods & Formatting",
      steps: [
        {
          id: "py-l5-s1",
          type: "explain",
          title: "Metode String & F-Strings",
          markdown:
            "Python memiliki banyak fungsi bawaan untuk memanipulasi teks.\n\n**Metode Populer:**\n- `a.upper()`: Mengubah teks jadi huruf kapital.\n- `a.lower()`: Menjadi huruf kecil.\n- `a.replace(\"H\", \"J\")`: Mengganti karakter.\n\n**String Formatting (F-Strings):**\nCara termudah untuk menggabungkan variabel ke dalam string:\n```py\nnama = \"Budi\"\npesan = f\"Halo, {nama}!\"\n```",
        },
        {
          id: "py-l5-s2",
          type: "code",
          title: "Format Pesan",
          prompt: "Buatlah fungsi `loud_shout(name)` yang menghasilkan pesan: `\"HELLO {NAME}!\"`.\n\nContoh: `name=\"Ayu\"` -> `\"HELLO AYU!\"`.\n\nTips: Gunakan f-string dan method `.upper()`.",
          starterCode: "def loud_shout(name):\n    # TODO: return HELLO {NAME}!\n    pass",
          functionName: "loud_shout",
          hints: ["Gunakan f-string: `f\"HELLO {name.upper()}!\"`.", "Jangan lupa tanda seru di akhir."],
          publicCases: [
            { input: ["Ayu"], output: "HELLO AYU!" },
            { input: ["budi"], output: "HELLO BUDI!" },
          ],
        },
      ],
    },
    "py-l6": {
      id: "py-l6",
      unitId: "unit-2",
      order: 6,
      title: "L6 — If...Else Basics",
      steps: [
        {
          id: "py-l6-s1",
          type: "explain",
          title: "Percabangan Dasar",
          markdown:
            "Python mendukung kondisi logis dari matematika:\n- `a == b` (Sama dengan)\n- `a != b` (Tidak sama dengan)\n- `a > b` (Lebih besar)\n\nBlok `if` akan dijalankan jika kondisinya benar. Jika salah, kamu bisa menggunakan `else`.",
        },
        {
          id: "py-l6-s2",
          type: "code",
          title: "Cek Angka Positif",
          prompt: "Buatlah fungsi `check_positive(n)` yang mengembalikan string `\"Positif\"` jika `n` lebih besar dari 0, dan `\"Bukan Positif\"` untuk sisanya.",
          starterCode: "def check_positive(n):\n    # TODO: if n > 0...\n    pass",
          functionName: "check_positive",
          hints: ["Gunakan `if n > 0:`", "Jangan lupa tanda titik dua `:` di akhir kondisi."],
          publicCases: [
            { input: [5], output: "Positif" },
            { input: [-1], output: "Bukan Positif" },
          ],
        },
      ],
    },
    "py-l7": {
      id: "py-l7",
      unitId: "unit-2",
      order: 7,
      title: "L7 — Elif & Multi-Conditions",
      steps: [
        {
          id: "py-l7-s1",
          type: "explain",
          title: "Menggunakan Elif",
          markdown:
            "Kata kunci `elif` adalah cara Python untuk mengatakan \"jika kondisi sebelumnya tidak benar, coba kondisi ini\".\n\n```py\nif a > b:\n    print(\"a besar\")\nelif a == b:\n    print(\"sama\")\nelse:\n    print(\"b besar\")\n```",
        },
        {
          id: "py-l7-s2",
          type: "code",
          title: "Bandingkan Angka",
          prompt: "Buatlah fungsi `compare(a, b)` yang mengembalikan:\n- `\"A\"` jika a > b\n- `\"B\"` jika b > a\n- `\"Equal\"` jika keduanya sama.",
          starterCode: "def compare(a, b):\n    # TODO: gunakan if, elif, else\n    pass",
          functionName: "compare",
          hints: ["Gunakan `elif a == b:` untuk mengecek kesamaan.", "Pastikan huruf kapital tepat."],
          publicCases: [
            { input: [10, 5], output: "A" },
            { input: [5, 10], output: "B" },
            { input: [7, 7], output: "Equal" },
          ],
        },
      ],
    },
    "py-l8": {
      id: "py-l8",
      unitId: "unit-2",
      order: 8,
      title: "L8 — Logical Operators",
      steps: [
        {
          id: "py-l8-s1",
          type: "explain",
          title: "And, Or, Not",
          markdown:
            "Gunakan operator logika untuk menggabungkan pernyataan kondisional:\n- `and`: Benar jika **keduanya** benar.\n- `or`: Benar jika **salah satu** benar.\n- `not`: Membalikkan hasil (Benar jadi Salah).",
        },
        {
          id: "py-l8-s2",
          type: "code",
          title: "Syarat Beasiswa",
          prompt: "Buatlah fungsi `is_eligible(gpa, active)` yang mengembalikan `True` jika `gpa` >= 3.5 **DAN** `active` adalah `True`.",
          starterCode: "def is_eligible(gpa, active):\n    # TODO\n    pass",
          functionName: "is_eligible",
          hints: ["Gunakan keyword `and`.", "Contoh: `if gpa >= 3.5 and active:`"],
          publicCases: [
            { input: [3.8, true], output: true },
            { input: [3.8, false], output: false },
            { input: [3.0, true], output: false },
          ],
        },
      ],
    },
    "py-l9": {
      id: "py-l9",
      unitId: "unit-2",
      order: 9,
      title: "L9 — Nested If",
      steps: [
        {
          id: "py-l9-s1",
          type: "explain",
          title: "If di dalam If",
          markdown:
            "Kamu bisa menempatkan pernyataan `if` di dalam pernyataan `if` lainnya. Ini disebut *nested if*.\n\n```py\nif x > 10:\n    if x > 20:\n        print(\"Sangat Besar\")\n```",
        },
        {
          id: "py-l9-s2",
          type: "code",
          title: "Verifikasi Umur",
          prompt: "Buatlah fungsi `verify(age)`:\n1. Jika `age` >= 18:\n   - Jika `age` >= 60, return `\"Senior\"`.\n   - Jika tidak, return `\"Adult\"`.\n2. Jika `age` < 18, return `\"Minor\"`.",
          starterCode: "def verify(age):\n    # TODO\n    pass",
          functionName: "verify",
          hints: ["Gunakan `if age >= 18:` lalu di dalamnya tambahkan `if age >= 60:`."],
          publicCases: [
            { input: [25], output: "Adult" },
            { input: [65], output: "Senior" },
            { input: [15], output: "Minor" },
          ],
        },
      ],
    },
    "py-l10": {
      id: "py-l10",
      unitId: "unit-2",
      order: 10,
      title: "L10 — The Pass Statement",
      steps: [
        {
          id: "py-l10-s1",
          type: "explain",
          title: "Keyword Pass",
          markdown:
            "Pernyataan `if` tidak boleh kosong. Jika karena suatu alasan kamu memiliki pernyataan `if` tanpa konten, masukkan pernyataan `pass` agar tidak terjadi error.",
        },
        {
          id: "py-l10-s2",
          type: "code",
          title: "Placeholder Fungsi",
          prompt: "Gunakan `pass` di dalam fungsi `todo_function()` agar kode ini bisa dijalankan tanpa error meskipun belum ada logika di dalamnya.",
          starterCode: "def todo_function():\n    # Masukkan pass di sini\n    ",
          functionName: "todo_function",
          hints: ["Cukup ketik `pass` dengan indentasi yang benar di dalam fungsi."],
          publicCases: [
            { input: [], output: null },
          ],
        },
      ],
    },
    "py-l11": {
      id: "py-l11",
      unitId: "unit-2",
      order: 11,
      title: "L11 — Match Case Basics",
      steps: [
        {
          id: "py-l11-s1",
          type: "explain",
          title: "Pencocokan Pola",
          markdown:
            "Sejak Python 3.10, kita bisa menggunakan `match` untuk membandingkan nilai dengan lebih rapi daripada menggunakan banyak `elif`.\n\n```py\nmatch x:\n    case \"A\": print(\"Satu\")\n    case _:\n        print(\"Lainnya\")\n```",
        },
        {
          id: "py-l11-s2",
          type: "code",
          title: "Status HTTP",
          prompt: "Buatlah fungsi `get_status(code)` menggunakan `match`:\n- 200: \"OK\"\n- 404: \"Not Found\"\n- _: \"General Error\"",
          starterCode: "def get_status(code):\n    # TODO\n    pass",
          functionName: "get_status",
          hints: ["Gunakan `match code:` lalu ikuti dengan `case 200:`, `case 404:`, dst."],
          publicCases: [
            { input: [200], output: "OK" },
            { input: [404], output: "Not Found" },
            { input: [500], output: "General Error" },
          ],
        },
      ],
    },
    "py-l12": {
      id: "py-l12",
      unitId: "unit-3",
      order: 12,
      title: "L12 — While Loops",
      steps: [
        {
          id: "py-l12-s1",
          type: "explain",
          title: "Perulangan While",
          markdown:
            "Dengan loop `while`, kita dapat mengeksekusi sekumpulan pernyataan selama kondisinya benar.\n\n```py\ni = 1\nwhile i < 6:\n    print(i)\n    i += 1\n```\n**Penting:** Ingatlah untuk menaikkan variabel `i`, jika tidak loop akan berjalan selamanya!",
        },
        {
          id: "py-l12-s2",
          type: "code",
          title: "Hitung Hingga N",
          prompt: "Buatlah fungsi `sum_until(n)` yang menggunakan `while` loop untuk menjumlahkan semua angka dari 1 hingga `n`.\nContoh: `n=3` -> 1+2+3 = 6.",
          starterCode: "def sum_until(n):\n    total = 0\n    i = 1\n    # TODO: while i <= n...\n    return total",
          functionName: "sum_until",
          hints: ["Gunakan `while i <= n:`", "Jangan lupa tambahkan `i += 1` di dalam loop."],
          publicCases: [
            { input: [3], output: 6 },
            { input: [5], output: 15 },
          ],
        },
      ],
    },
    "py-l13": {
      id: "py-l13",
      unitId: "unit-3",
      order: 13,
      title: "L13 — For Loops & Range",
      steps: [
        {
          id: "py-l13-s1",
          type: "explain",
          title: "Perulangan For",
          markdown:
            "Loop `for` digunakan untuk mengulang suatu urutan (seperti list, tuple, atau string).\n\nFungsi `range()` mengembalikan urutan angka, dimulai dari 0 secara default, dan bertambah 1 secara default.\n```py\nfor x in range(6):\n    print(x) # 0 sampai 5\n```",
        },
        {
          id: "py-l13-s2",
          type: "code",
          title: "Iterasi List",
          prompt: "Buatlah fungsi `double_list(items)` yang mengembalikan list baru di mana setiap angka dikalikan dua.",
          starterCode: "def double_list(items):\n    res = []\n    # TODO: for item in items...\n    return res",
          functionName: "double_list",
          hints: ["Gunakan `for item in items:`", "Gunakan `res.append(item * 2)`."],
          publicCases: [
            { input: [[1, 2]], output: [2, 4] },
            { input: [[10]], output: [20] },
          ],
        },
      ],
    },
    "py-l14": {
      id: "py-l14",
      unitId: "unit-3",
      order: 14,
      title: "L14 — Break & Continue",
      steps: [
        {
          id: "py-l14-s1",
          type: "explain",
          title: "Menghentikan Loop",
          markdown:
            "- `break`: Kita dapat menghentikan loop meskipun kondisi while adalah benar atau for belum selesai.\n- `continue`: Kita dapat menghentikan iterasi saat ini, dan melanjutkan dengan yang berikutnya.",
        },
        {
          id: "py-l14-s2",
          type: "code",
          title: "Lewati Angka 3",
          prompt: "Buatlah fungsi `skip_three(n)` yang mengembalikan list angka dari 0 hingga `n-1`, tetapi **lewati** angka 3 menggunakan `continue`.",
          starterCode: "def skip_three(n):\n    res = []\n    for i in range(n):\n        # TODO: if i == 3: continue\n        res.append(i)\n    return res",
          functionName: "skip_three",
          hints: ["Gunakan `if i == 3: continue`."],
          publicCases: [
            { input: [5], output: [0, 1, 2, 4] },
            { input: [3], output: [0, 1, 2] },
          ],
        },
      ],
    },
    "py-l15": {
      id: "py-l15",
      unitId: "unit-3",
      order: 15,
      title: "L15 — Else in Loops",
      steps: [
        {
          id: "py-l15-s1",
          type: "explain",
          title: "Blok Else di Loop",
          markdown:
            "Kata kunci `else` dalam loop fungsi untuk menentukan blok kode yang akan dieksekusi ketika loop selesai.\n\n```py\nfor x in range(6):\n    print(x)\nelse:\n    print(\"Selesai!\")\n```",
        },
        {
          id: "py-l15-s2",
          type: "code",
          title: "Cari Angka Negatif",
          prompt: "Buatlah fungsi `has_negative(items)` yang mengembalikan `True` jika ada angka negatif dalam list. Jika loop selesai dan tidak ada, kembalikan `False` (gunakan alur logika loop).",
          starterCode: "def has_negative(items):\n    for x in items:\n        if x < 0:\n            return True\n    return False",
          functionName: "has_negative",
          hints: ["Iterasi list `for x in items:`", "Kembalikan `False` di luar loop."],
          publicCases: [
            { input: [[1, 2, -1]], output: true },
            { input: [[1, 2, 3]], output: false },
          ],
        },
      ],
    },
    "py-l16": {
      id: "py-l16",
      unitId: "unit-3",
      order: 16,
      title: "L16 — Nested Loops",
      steps: [
        {
          id: "py-l16-s1",
          type: "explain",
          title: "Loop di dalam Loop",
          markdown:
            "Loop bersarang adalah loop di dalam loop.\n\n\"Loop dalam\" akan dieksekusi satu kali untuk setiap iterasi dari \"loop luar\".\n\n```py\nfor x in [\"red\", \"big\"]:\n    for y in [\"apple\", \"banana\"]:\n        print(x, y)\n```",
        },
        {
          id: "py-l16-s2",
          type: "code",
          title: "Kombinasi Warna",
          prompt: "Buatlah fungsi `get_combinations(adj, fruits)` yang menggabungkan setiap kata di `adj` dengan setiap kata di `fruits` menjadi string `\"adj fruit\"` dan menyimpannya dalam list.",
          starterCode: "def get_combinations(adj, fruits):\n    res = []\n    # TODO: nested loops\n    return res",
          functionName: "get_combinations",
          hints: ["Gunakan loop luar untuk `adj` dan loop dalam untuk `fruits`.", "Gunakan f-string: `f\"{a} {f}\"`."],
          publicCases: [
            { input: [["red"], ["apple", "banana"]], output: ["red apple", "red banana"] },
          ],
        },
      ],
    },
    "py-l17": {
      id: "py-l17",
      unitId: "unit-3",
      order: 17,
      title: "L17 — Looping Strings",
      steps: [
        {
          id: "py-l17-s1",
          type: "explain",
          title: "Iterasi Karakter",
          markdown:
            "Karena string adalah objek yang dapat diiterasi, kita bisa melakukan loop pada setiap karakter dalam string.\n\n```py\nfor x in \"banana\":\n    print(x)\n```",
        },
        {
          id: "py-l17-s2",
          type: "code",
          title: "Hitung Karakter 'a'",
          prompt: "Buatlah fungsi `count_a(text)` yang menghitung berapa kali huruf 'a' (kecil saja) muncul dalam `text`.",
          starterCode: "def count_a(text):\n    count = 0\n    # TODO: loop text\n    return count",
          functionName: "count_a",
          hints: ["Gunakan `for char in text:`", "Gunakan `if char == 'a':`."],
          publicCases: [
            { input: ["banana"], output: 3 },
            { input: ["apple"], output: 1 },
            { input: ["sky"], output: 0 },
          ],
        },
      ],
    },
    "py-l18": {
      id: "py-l18",
      unitId: "unit-4",
      order: 18,
      title: "L18 — Python Lists Basics",
      steps: [
        {
          id: "py-l18-s1",
          type: "explain",
          title: "Mengenal List",
          markdown:
            "List digunakan untuk menyimpan banyak item dalam satu variabel. Item list diurutkan, dapat diubah, dan memungkinkan nilai duplikat.\n\n```py\nmylist = [\"apple\", \"banana\", \"cherry\"]\nprint(len(mylist)) # 3\n```",
        },
        {
          id: "py-l18-s2",
          type: "code",
          title: "Akses Item List",
          prompt: "Buatlah fungsi `get_last_item(items)` yang mengembalikan **item terakhir** dari sebuah list.\n\nTips: Gunakan index negatif `-1`.",
          starterCode: "def get_last_item(items):\n    # TODO\n    pass",
          functionName: "get_last_item",
          hints: ["Indeks `-1` merujuk ke item terakhir."],
          publicCases: [
            { input: [[10, 20, 30]], output: 30 },
            { input: [["A", "B"]], output: "B" },
          ],
        },
      ],
    },
    "py-l19": {
      id: "py-l19",
      unitId: "unit-4",
      order: 19,
      title: "L19 — Add List Items",
      steps: [
        {
          id: "py-l19-s1",
          type: "explain",
          title: "Menambah Item",
          markdown:
            "Untuk menambahkan item ke akhir list, gunakan metode `append()`.\nUntuk menambahkan item pada indeks tertentu, gunakan metode `insert()`.\n\n```py\nmylist = [\"apple\", \"banana\"]\nmylist.append(\"orange\")\nmylist.insert(1, \"cherry\")\n```",
        },
        {
          id: "py-l19-s2",
          type: "code",
          title: "Tambah Angka",
          prompt: "Buatlah fungsi `add_to_list(mylist, value)` yang menambahkan `value` ke akhir `mylist` lalu mengembalikan list tersebut.",
          starterCode: "def add_to_list(mylist, value):\n    # TODO\n    return mylist",
          functionName: "add_to_list",
          hints: ["Gunakan `mylist.append(value)`."],
          publicCases: [
            { input: [[1, 2], 3], output: [1, 2, 3] },
          ],
        },
      ],
    },
    "py-l20": {
      id: "py-l20",
      unitId: "unit-4",
      order: 20,
      title: "L20 — Remove List Items",
      steps: [
        {
          id: "py-l20-s1",
          type: "explain",
          title: "Menghapus Item",
          markdown:
            "- `remove(n)`: Menghapus item tertentu.\n- `pop(n)`: Menghapus indeks tertentu (jika kosong, hapus yang terakhir).\n- `clear()`: Mengosongkan list.",
        },
        {
          id: "py-l20-s2",
          type: "code",
          title: "Buang Item Terakhir",
          prompt: "Buatlah fungsi `remove_last(mylist)` yang menghapus item terakhir dari list lalu mengembalikan list tersebut.",
          starterCode: "def remove_last(mylist):\n    # TODO\n    return mylist",
          functionName: "remove_last",
          hints: ["Gunakan `mylist.pop()`."],
          publicCases: [
            { input: [[1, 2, 3]], output: [1, 2] },
          ],
        },
      ],
    },
    "py-l21": {
      id: "py-l21",
      unitId: "unit-4",
      order: 21,
      title: "L21 — List Comprehension",
      steps: [
        {
          id: "py-l21-s1",
          type: "explain",
          title: "Sintaks Pendek",
          markdown:
            "List comprehension menawarkan sintaks yang lebih pendek ketika kamu ingin membuat list baru berdasarkan nilai dari list yang sudah ada.\n\n```py\n# Tanpa comprehension\nnewlist = [x for x in fruits if \"a\" in x]\n```",
        },
        {
          id: "py-l21-s2",
          type: "code",
          title: "Hanya Angka Genap",
          prompt: "Gunakan list comprehension untuk membuat fungsi `only_evens(items)` yang mengembalikan list berisi hanya angka genap dari `items`.",
          starterCode: "def only_evens(items):\n    # return [x for x in items if ...]\n    pass",
          functionName: "only_evens",
          hints: ["Gunakan `if x % 2 == 0`."],
          publicCases: [
            { input: [[1, 2, 3, 4]], output: [2, 4] },
          ],
        },
      ],
    },
    "py-l22": {
      id: "py-l22",
      unitId: "unit-4",
      order: 22,
      title: "L22 — Sort Lists",
      steps: [
        {
          id: "py-l22-s1",
          type: "explain",
          title: "Mengurutkan List",
          markdown:
            "Objek list memiliki metode `sort()` yang akan mengurutkan list secara alfanumerik, menaik, secara default.\n\n```py\nfruits.sort()\n# Untuk menurun:\nfruits.sort(reverse = True)\n```",
        },
        {
          id: "py-l22-s2",
          type: "code",
          title: "Urutkan Terbalik",
          prompt: "Buatlah fungsi `sort_desc(items)` yang mengurutkan list secara **menurun** (descending) lalu mengembalikan list tersebut.",
          starterCode: "def sort_desc(items):\n    # TODO: items.sort(reverse=True)\n    return items",
          functionName: "sort_desc",
          hints: ["Gunakan `items.sort(reverse=True)`."],
          publicCases: [
            { input: [[1, 3, 2]], output: [3, 2, 1] },
          ],
        },
      ],
    },
    "py-l23": {
      id: "py-l23",
      unitId: "unit-4",
      order: 23,
      title: "L23 — Python Tuples",
      steps: [
        {
          id: "py-l23-s1",
          type: "explain",
          title: "Mengenal Tuple",
          markdown:
            "Tuple digunakan untuk menyimpan banyak item dalam satu variabel. Tuple bersifat **Unchangeable** (tidak dapat diubah setelah dibuat).\n\n```py\nmytuple = (\"apple\", \"banana\", \"cherry\")\n```",
        },
        {
          id: "py-l23-s2",
          type: "code",
          title: "Swap Tuple",
          prompt: "Buat fungsi `swap(a, b)` yang mengembalikan sebuah tuple `(b, a)`.",
          starterCode: "def swap(a, b):\n    # TODO\n    pass\n",
          functionName: "swap",
          hints: ["Cukup kembalikan `(b, a)`."],
          publicCases: [
            { input: [1, 2], output: [2, 1] }, 
            { input: ["pagi", "malam"], output: ["malam", "pagi"] },
          ],
        },
      ],
    },
    "py-l24": {
      id: "py-l24",
      unitId: "unit-5",
      order: 24,
      title: "L24 — Python Dictionaries",
      steps: [
        {
          id: "py-l24-s1",
          type: "explain",
          title: "Mengenal Dictionary",
          markdown:
            "Dictionary digunakan untuk menyimpan nilai data dalam pasangan `key:value`. Dictionary adalah koleksi yang terurut (mulai Python 3.7), dapat diubah, dan tidak mengizinkan duplikat.\n\n```py\nthisdict = {\n  \"brand\": \"Ford\",\n  \"model\": \"Mustang\",\n  \"year\": 1964\n}\n```",
        },
        {
          id: "py-l24-s2",
          type: "code",
          title: "Buat Dictionary",
          prompt: "Buatlah fungsi `create_car(brand, model)` yang mengembalikan dictionary dengan key `\"brand\"` dan `\"model\"` sesuai parameter.",
          starterCode: "def create_car(brand, model):\n    # TODO\n    pass",
          functionName: "create_car",
          hints: ["Gunakan kurung kurawal `{}`.", "Format: `{\"brand\": brand, ...}`."],
          publicCases: [
            { input: ["Ford", "Mustang"], output: { brand: "Ford", model: "Mustang" } },
          ],
        },
      ],
    },
    "py-l25": {
      id: "py-l25",
      unitId: "unit-5",
      order: 25,
      title: "L25 — Access & Change Dict",
      steps: [
        {
          id: "py-l25-s1",
          type: "explain",
          title: "Akses & Ubah Data",
          markdown:
            "Kamu dapat mengakses item dictionary dengan merujuk ke nama kuncinya, di dalam kurung siku.\n\n```py\nx = thisdict[\"model\"]\n# Atau menggunakan get():\nx = thisdict.get(\"model\")\n\n# Mengubah nilai:\nthisdict[\"year\"] = 2020\n```",
        },
        {
          id: "py-l25-s2",
          type: "code",
          title: "Update Tahun",
          prompt: "Buatlah fungsi `update_year(car_dict, new_year)` yang memperbarui key `\"year\"` dalam `car_dict` dengan `new_year` lalu mengembalikan dictionary tersebut.",
          starterCode: "def update_year(car_dict, new_year):\n    # TODO\n    return car_dict",
          functionName: "update_year",
          hints: ["Gunakan `car_dict[\"year\"] = new_year`."],
          publicCases: [
            { input: [{ brand: "Ford", year: 1964 }, 2024], output: { brand: "Ford", year: 2024 } },
          ],
        },
      ],
    },
    "py-l26": {
      id: "py-l26",
      unitId: "unit-5",
      order: 26,
      title: "L26 — Remove Dict Items",
      steps: [
        {
          id: "py-l26-s1",
          type: "explain",
          title: "Menghapus Data",
          markdown:
            "Ada beberapa metode untuk menghapus item dari dictionary:\n- `pop(key)`: Menghapus item dengan nama kunci yang ditentukan.\n- `popitem()`: Menghapus item terakhir yang dimasukkan.\n- `del`: Menghapus item (atau seluruh dictionary).",
        },
        {
          id: "py-l26-s2",
          type: "code",
          title: "Hapus Model",
          prompt: "Buatlah fungsi `remove_model(car_dict)` yang menghapus key `\"model\"` dari dictionary lalu mengembalikan dictionary tersebut.",
          starterCode: "def remove_model(car_dict):\n    # TODO: car_dict.pop(\"model\")\n    return car_dict",
          functionName: "remove_model",
          hints: ["Gunakan `car_dict.pop(\"model\")`."],
          publicCases: [
            { input: [{ brand: "Ford", model: "Mustang" }], output: { brand: "Ford" } },
          ],
        },
      ],
    },
    "py-l27": {
      id: "py-l27",
      unitId: "unit-5",
      order: 27,
      title: "L27 — Python Sets",
      steps: [
        {
          id: "py-l27-s1",
          type: "explain",
          title: "Mengenal Set",
          markdown:
            "Set adalah koleksi item yang **unik** dan **tidak berurutan**. Bayangkan Set seperti sebuah kantong di mana kamu melempar barang-barang tanpa mempedulikan urutannya.\n\n### Karakteristik Set:\n*   **Unik**: Tidak boleh ada duplikat. Jika kamu memasukkan 'Apel' dua kali, Set hanya akan menyimpan satu.\n*   **Unordered**: Tidak ada urutan pasti (indeks `[0]` tidak akan bekerja).\n*   **Unchangeable**: Kamu tidak bisa mengecilkan/mengubah item yang sudah ada, tapi kamu bisa tambah atau hapus item baru.\n\n```py\nmyset = {\"apple\", \"banana\", \"cherry\"}\n```",
        },
        {
          id: "py-l27-s2",
          type: "code",
          title: "Hapus Duplikat",
          prompt: "Seringkali Set digunakan untuk membuang duplikat dari list. Buatlah fungsi `unique_list(items)` yang mengubah list menjadi set lalu kembali menjadi list untuk membuang duplikatnya.",
          starterCode: "def unique_list(items):\n    # TODO: list(set(items))\n    pass",
          functionName: "unique_list",
          hints: ["Gunakan `set(items)` untuk membuang duplikat.", "Gunakan `list(...)` untuk mengembalikannya ke tipe list."],
          publicCases: [
            { input: [[1, 1, 2, 3, 3]], output: [1, 2, 3] },
            { input: [["A", "A"]], output: ["A"] },
          ],
        },
      ],
    },
    "py-l28": {
      id: "py-l28",
      unitId: "unit-6",
      order: 28,
      title: "L28 — Python Functions",
      steps: [
        {
          id: "py-l28-s1",
          type: "explain",
          title: "Membuat Fungsi",
          markdown:
            "Fungsi adalah **mesin** yang bisa kamu panggil kapan saja untuk melakukan tugas tertentu. Daripada menulis kode yang sama berulang kali, kita cukup membungkusnya dalam fungsi.\n\n### Cara Membuat Fungsi:\nGunakan kata kunci `def` diikuti nama fungsi dan kurung `()`.\n\n```py\ndef sapa_teman(nama):\n  # Mesin ini akan menyapa siapapun yang diinput\n  print(f\"Halo {nama}, senang bertemu denganmu!\")\n```\n\nIngat, fungsi tidak akan berjalan sebelum kamu **memanggilnya** (contoh: `sapa_teman(\"Budi\")`)!",
        },
        {
          id: "py-l28-s2",
          type: "code",
          title: "Sapaan Kustom",
          prompt: "Buatlah fungsi `greet(name)` yang mengembalikan string `\"Hello {name}!\"`.",
          starterCode: "def greet(name):\n    # TODO\n    pass",
          functionName: "greet",
          hints: ["Gunakan f-string: `f\"Hello {name}!\"`."],
          publicCases: [
            { input: ["Ayu"], output: "Hello Ayu!" },
          ],
        },
      ],
    },
    "py-l29": {
      id: "py-l29",
      unitId: "unit-6",
      order: 29,
      title: "L29 — Arbitrary Arguments (*args)",
      steps: [
        {
          id: "py-l29-s1",
          type: "explain",
          title: "Argumen Tak Tentu",
          markdown:
            "Jika kamu tidak tahu berapa banyak argumen yang akan dikirim, tambahkan `*` sebelum nama parameter. Fungsi akan menerima **tuple** argumen.\n\n```py\ndef my_function(*kids):\n  print(\"Anak bungsu adalah \" + kids[2])\n```",
        },
        {
          id: "py-l29-s2",
          type: "code",
          title: "Jumlahkan Angka",
          prompt: "Buatlah fungsi `sum_all(*nums)` yang menjumlahkan semua angka yang dikirimkan.",
          starterCode: "def sum_all(*nums):\n    # TODO: loop nums dan jumlahkan\n    pass",
          functionName: "sum_all",
          hints: ["Gunakan `total = 0` lalu `for n in nums: total += n`."],
          publicCases: [
            { input: [1, 2, 3], output: 6 },
            { input: [10, 20], output: 30 },
          ],
        },
      ],
    },
    "py-l30": {
      id: "py-l30",
      unitId: "unit-6",
      order: 30,
      title: "L30 — Default Parameter Value",
      steps: [
        {
          id: "py-l30-s1",
          type: "explain",
          title: "Parameter Default",
          markdown:
            "Kamu dapat menetapkan nilai default pada parameter. Jika fungsi dipanggil tanpa argumen, ia menggunakan nilai default.\n\n```py\ndef my_function(country = \"Norway\"):\n  print(\"I am from \" + country)\n```",
        },
        {
          id: "py-l30-s2",
          type: "code",
          title: "Power Default",
          prompt: "Buatlah fungsi `power(base, exp=2)` yang mengembalikan `base` pangkat `exp`. Jika `exp` dikosongkan, defaultnya adalah 2.",
          starterCode: "def power(base, exp=2):\n    # TODO\n    pass",
          functionName: "power",
          hints: ["Gunakan operator `**`."],
          publicCases: [
            { input: [3], output: 9 },
            { input: [2, 3], output: 8 },
          ],
        },
      ],
    },
    "py-l31": {
      id: "py-l31",
      unitId: "unit-6",
      order: 31,
      title: "L31 — Python Lambda",
      steps: [
        {
          id: "py-l31-s1",
          type: "explain",
          title: "Fungsi Anonim",
          markdown:
            "Fungsi lambda adalah fungsi anonim kecil. Fungsi lambda dapat menerima sejumlah argumen, tetapi hanya dapat memiliki satu ekspresi.\n\n```py\nx = lambda a, b : a * b\nprint(x(5, 6)) # 30\n```",
        },
        {
          id: "py-l31-s2",
          type: "code",
          title: "Lambda Tambah",
          prompt: "Gunakan lambda untuk membuat fungsi yang menjumlahkan tiga angka: `a, b, c`.",
          starterCode: "add_three = lambda a, b, c: 0",
          functionName: "add_three",
          hints: ["Sintaks: `lambda a, b, c: a + b + c`."],
          publicCases: [
            { input: [1, 2, 3], output: 6 },
          ],
        },
      ],
    },
    "py-l32": {
      id: "py-l32",
      unitId: "unit-6",
      order: 32,
      title: "L32 — Recursion Basics",
      steps: [
        {
          id: "py-l32-s1",
          type: "explain",
          title: "Konsep Rekursi",
          markdown:
            "Rekursi adalah konsep di mana suatu fungsi memanggil dirinya sendiri. Ini bisa digunakan untuk memproses data yang memiliki struktur berulang.\n\n**Contoh:** Menghitung total angka dari 1 ke N secara rekursif.",
        },
        {
          id: "py-l32-s2",
          type: "code",
          title: "Rekursif Factorial",
          prompt: "Buatlah fungsi rekursif `fact(n)` yang mengembalikan faktorial dari `n`.\n\nTips: `n * fact(n-1)` dengan base case `if n <= 1: return 1`.",
          starterCode: "def fact(n):\n    # TODO\n    pass",
          functionName: "fact",
          hints: ["Base case: `if n <= 1: return 1`.", "Recursive case: `return n * fact(n-1)`."],
          publicCases: [
            { input: [5], output: 120 },
          ],
        },
      ],
    },
    "py-l33": {
      id: "py-l33",
      unitId: "unit-7",
      order: 33,
      title: "L33 — String Formatting",
      steps: [
        {
          id: "py-l33-s1",
          type: "explain",
          title: "Metode format()",
          markdown:
            "Metode `format()` memungkinkan kamu untuk memformat bagian-bagian tertentu dari sebuah string.\n\n```py\nprice = 49\ntxt = \"The price is {} dollars\"\nprint(txt.format(price))\n```",
        },
        {
          id: "py-l33-s2",
          type: "code",
          title: "Format Harga",
          prompt: "Buatlah fungsi `format_price(item, price)` yang mengembalikan string: `\"Harga {item} adalah {price} rupiah\"` menggunakan metode `.format()`.",
          starterCode: "def format_price(item, price):\n    txt = \"Harga {} adalah {} rupiah\"\n    # TODO: return txt.format(...)\n    pass",
          functionName: "format_price",
          hints: ["Gunakan `txt.format(item, price)`."],
          publicCases: [
            { input: ["Buku", 5000], output: "Harga Buku adalah 5000 rupiah" },
          ],
        },
      ],
    },
    "py-l34": {
      id: "py-l34",
      unitId: "unit-7",
      order: 34,
      title: "L34 — String Escape Characters",
      steps: [
        {
          id: "py-l34-s1",
          type: "explain",
          title: "Karakter Escape",
          markdown:
            "Untuk memasukkan karakter yang ilegal dalam sebuah string, gunakan karakter escape `\\`.\n\n**Contoh:**\n- `\\\"`: Tanda kutip ganda\n- `\\n`: Baris baru (Newline)\n- `\\t`: Tab",
        },
        {
          id: "py-l34-s2",
          type: "code",
          title: "Baris Baru",
          prompt: "Buatlah fungsi `get_multiline()` yang mengembalikan string `\"Baris 1\\nBaris 2\"`.",
          starterCode: "def get_multiline():\n    # TODO\n    pass",
          functionName: "get_multiline",
          hints: ["Gunakan `\\n` di antara teks."],
          publicCases: [
            { input: [], output: "Baris 1\nBaris 2" },
          ],
        },
      ],
    },
    "py-l35": {
      id: "py-l35",
      unitId: "unit-7",
      order: 35,
      title: "L35 — String Methods (Checkers)",
      steps: [
        {
          id: "py-l35-s1",
          type: "explain",
          title: "Mengecek Isi String",
          markdown:
            "Kamu bisa mengecek apakah string hanya berisi karakter tertentu:\n- `.isdigit()`: True jika semua angka.\n- `.isalpha()`: True jika semua huruf.\n- `.isalnum()`: True jika huruf atau angka.",
        },
        {
          id: "py-l35-s2",
          type: "code",
          title: "Validasi Angka",
          prompt: "Buatlah fungsi `is_numeric(text)` yang mengembalikan `True` jika `text` hanya berisi angka.",
          starterCode: "def is_numeric(text):\n    # TODO\n    pass",
          functionName: "is_numeric",
          hints: ["Gunakan `text.isdigit()`."],
          publicCases: [
            { input: ["123"], output: true },
            { input: ["123a"], output: false },
          ],
        },
      ],
    },
    "py-l36": {
      id: "py-l36",
      unitId: "unit-8",
      order: 36,
      title: "L36 — Python Try...Except",
      steps: [
        {
          id: "py-l36-s1",
          type: "explain",
          title: "Menangani Error",
          markdown:
            "Blok `try` memungkinkan kamu menguji blok kode untuk error.\nBlok `except` memungkinkan kamu menangani error tersebut.\n\n```py\ntry:\n  print(x)\nexcept:\n  print(\"Terjadi kesalahan\")\n```",
        },
        {
          id: "py-l36-s2",
          type: "code",
          title: "Pembagian Aman",
          prompt: "Buatlah fungsi `safe_div(a, b)` yang mencoba membagi `a` dengan `b`. Jika terjadi error (seperti pembagian dengan nol), kembalikan string `\"Error\"`.",
          starterCode: "def safe_div(a, b):\n    try:\n        return a / b\n    except:\n        # TODO: return \"Error\"\n        pass",
          functionName: "safe_div",
          hints: ["Gunakan blok `except:`."],
          publicCases: [
            { input: [10, 2], output: 5 },
            { input: [10, 0], output: "Error" },
          ],
        },
      ],
    },
    "py-l37": {
      id: "py-l37",
      unitId: "unit-8",
      order: 37,
      title: "L37 — Catching Specific Errors",
      steps: [
        {
          id: "py-l37-s1",
          type: "explain",
          title: "Spesifik Error",
          markdown:
            "Kamu dapat mendefinisikan sebanyak mungkin blok pengecualian yang kamu inginkan, misalnya jika kamu ingin menangani jenis error tertentu secara khusus.\n\n```py\ntry:\n  print(x)\nexcept NameError:\n  print(\"Variabel x belum didefinisikan\")\nexcept:\n  print(\"Error lainnya\")\n```",
        },
        {
          id: "py-l37-s2",
          type: "code",
          title: "Gunakan NameError",
          prompt: "Buatlah fungsi `check_var()` yang mencoba mengeprint variabel yang tidak ada. Tangkap secara spesifik `NameError` dan kembalikan string `\"Variabel tidak ditemukan\"`.",
          starterCode: "def check_var():\n    try:\n        print(alien_variable)\n    except NameError:\n        # TODO\n        pass",
          functionName: "check_var",
          hints: ["Kembalikan string yang diminta di dalam blok `except NameError:`."],
          publicCases: [
            { input: [], output: "Variabel tidak ditemukan" },
          ],
        },
      ],
    },
    "py-l38": {
      id: "py-l38",
      unitId: "unit-8",
      order: 38,
      title: "L38 — Else & Finally",
      steps: [
        {
          id: "py-l38-s1",
          type: "explain",
          title: "Else & Finally",
          markdown:
            "- `else`: Digunakan untuk menentukan blok kode yang akan dieksekusi jika **tidak ada error** yang terjadi.\n- `finally`: Blok yang akan dieksekusi **apapun yang terjadi**, terlepas dari apakah ada error atau tidak.",
        },
        {
          id: "py-l38-s2",
          type: "code",
          title: "Jalur Aman",
          prompt: "Buatlah fungsi `process_data(n)` yang mencoba membagi 100 dengan `n`. Jika sukses (tidak ada error), kembalikan hasil pembagian tersebut. Jika gagal, kembalikan `0`.",
          starterCode: "def process_data(n):\n    try:\n        res = 100 / n\n    except:\n        return 0\n    else:\n        # TODO: return res\n        pass",
          functionName: "process_data",
          hints: ["Pindahkan logika return sukses ke dalam blok `else:`."],
          publicCases: [
            { input: [2], output: 50 },
            { input: [0], output: 0 },
          ],
        },
      ],
    },
    "py-l39": {
      id: "py-l39",
      unitId: "unit-9",
      order: 39,
      title: "L39 — Python Scope",
      steps: [
        {
          id: "py-l39-s1",
          type: "explain",
          title: "Cakupan Variabel",
          markdown:
            "Sebuah variabel hanya tersedia dari dalam wilayah pembuatannya. Ini disebut **scope**.\n- **Local Scope**: Variabel di dalam fungsi.\n- **Global Scope**: Variabel di luar fungsi.\n- **Global Keyword**: Digunakan untuk mengubah variabel global dari dalam fungsi.",
        },
        {
          id: "py-l39-s2",
          type: "code",
          title: "Gunakan Global",
          prompt: "Buatlah fungsi `set_global_x(val)` yang menggunakan kata kunci `global` untuk mengubah variabel global `x` menjadi `val`.",
          starterCode: "x = 0\n\ndef set_global_x(val):\n    # TODO: global x\n    pass",
          functionName: "set_global_x",
          hints: ["Tulis `global x` di baris pertama fungsi."],
          publicCases: [
            { input: [100], output: 100 },
          ],
        },
      ],
    },
    "py-l40": {
      id: "py-l40",
      unitId: "unit-9",
      order: 40,
      title: "L40 — Classes and Objects",
      steps: [
        {
          id: "py-l40-s1",
          type: "explain",
          title: "Blueprint Objek",
          markdown:
            "Selamat datang di dunia OOP! 🏗️\n\nClass adalah **Cetak Biru** (Blueprint) untuk menciptakan sesuatu. Jika kamu ingin membangun banyak rumah, kamu tidak membangunnya dari nol satu-satu, tapi kamu membuat satu denah (Class) lalu mencetaknya berkali-kali menjadi rumah nyata (Object).\n\n```py\nclass Rumah:\n  warna = \"Putih\"\n\n# Memasuki proses pembangunan objek\nrumah_budi = Rumah()\nprint(rumah_budi.warna) # Output: Putih\n```",
        },
        {
          id: "py-l40-s2",
          type: "code",
          title: "Akses Properti",
          prompt: "Buatlah class `MyClass` dengan properti `x = 5`. Kemudian buat fungsi `get_x()` yang mengembalikan nilai `x` dari instance MyClass.",
          starterCode: "class MyClass:\n    # TODO\n    pass\n\ndef get_x():\n    obj = MyClass()\n    return obj.x",
          functionName: "get_x",
          hints: ["Tulis `x = 5` di dalam class."],
          publicCases: [
            { input: [], output: 5 },
          ],
        },
      ],
    },
    "py-l41": {
      id: "py-l41",
      unitId: "unit-9",
      order: 41,
      title: "L41 — The __init__() Function",
      steps: [
        {
          id: "py-l41-s1",
          type: "explain",
          title: "Inisialisasi",
          markdown:
            "Ini adalah bagian terpenting dari sebuah Class. Fungsi `__init__` adalah fungsi yang otomatis berjalan saat objek pertama kali diciptakan (Lahir).\n\nBiasanya kita menggunakannya untuk memberikan 'identitas' awal pada objek kita.\n\n```py\nclass Kucing:\n  def __init__(self, nama, warna):\n    self.nama = nama\n    self.warna = warna\n\nmiaw = Kucing(\"Mpuss\", \"Orange\")\nprint(miaw.nama) # Output: Mpuss\n```\n`self` merujuk pada objek itu sendiri agar Python tidak bingung kotak mana yang harus diisi.",
        },
        {
          id: "py-l41-s2",
          type: "code",
          title: "Buat Konstruktor",
          prompt: "Buat class `Car` dengan `__init__` yang menerima `model` dan menyimpannya ke `self.model`. Fungsi `get_model(m)` harus mengembalikan properti tersebut dari objek baru.",
          starterCode: "class Car:\n    # TODO\n    pass\n\ndef get_model(m):\n    c = Car(m)\n    return c.model",
          functionName: "get_model",
          hints: ["`def __init__(self, model): self.model = model`"],
          publicCases: [
            { input: ["Mustang"], output: "Mustang" },
          ],
        },
      ],
    },
    "py-l42": {
      id: "py-l42",
      unitId: "unit-9",
      order: 42,
      title: "L42 — Inheritance Basics",
      steps: [
        {
          id: "py-l42-s1",
          type: "explain",
          title: "Pewarisan",
          markdown:
            "Kelas anak mewarisi semua fungsionalitas dari kelas induk.\n\n```py\nclass Student(Person):\n  pass\n```",
        },
        {
          id: "py-l42-s2",
          type: "code",
          title: "Student Class",
          prompt: "Buat class `Person` dengan method `say_hi()` -> `\"Hi\"`. Lalu buat class `Student` yang mewarisi `Person`. Fungsi `student_hi()` harus mengembalikan hasil `say_hi()` dari objek Student.",
          starterCode: "class Person:\n    def say_hi(self):\n        return \"Hi\"\n\n# TODO\n\ndef student_hi():\n    s = Student()\n    return s.say_hi()",
          functionName: "student_hi",
          hints: ["`class Student(Person): pass`"],
          publicCases: [
            { input: [], output: "Hi" },
          ],
        },
      ],
    },
    "py-l43": {
      id: "py-l43",
      unitId: "unit-9",
      order: 43,
      title: "L43 — Python Modules",
      steps: [
        {
          id: "py-l43-s1",
          type: "explain",
          title: "Menggunakan Modul",
          markdown:
            "Modul adalah file berisi sekumpulan fungsi. Gunakan `import` untuk menyertakannya.\n\n```py\nimport math\nprint(math.pi)\n```",
        },
        {
          id: "py-l43-s2",
          type: "code",
          title: "Math Module",
          prompt: "Import modul `math` dan kembalikan nilai akar kuadrat (`sqrt`) dari 64.",
          starterCode: "def get_sqrt():\n    # TODO\n    pass",
          functionName: "get_sqrt",
          hints: ["Gunakan `import math` dan `math.sqrt(64)`."],
          publicCases: [
            { input: [], output: 8.0 },
          ],
        },
      ],
    },
    "py-l44": {
      id: "py-l44",
      unitId: "unit-9",
      order: 44,
      title: "L44 — Python JSON",
      steps: [
        {
          id: "py-l44-s1",
          type: "explain",
          title: "Parsing JSON",
          markdown:
            "Gunakan modul `json` untuk bekerja dengan data JSON.\n- `json.loads()`: JSON string -> Dict\n- `json.dumps()`: Dict -> JSON string",
        },
        {
          id: "py-l44-s2",
          type: "code",
          title: "JSON to Dict",
          prompt: "Lengkapi fungsi `parse_data(json_str)` yang mengubah string JSON menjadi dictionary.",
          starterCode: "import json\n\ndef parse_data(json_str):\n    # TODO\n    pass",
          functionName: "parse_data",
          hints: ["Gunakan `json.loads(json_str)`."],
          publicCases: [
            { input: ['{"x": 10}'], output: { x: 10 } },
          ],
        },
      ],
    },
    "py-l45": {
      id: "py-l45",
      unitId: "unit-10",
      order: 45,
      title: "L45 — Mini Project: Kalkulator OOP",
      steps: [
        {
          id: "py-l45-s1",
          type: "explain",
          title: "Logic Kalkulator",
          markdown:
            "Proyek pertama kita! 🧮\n\nKita akan membuat mesin kalkulator menggunakan teknik OOP. Kalkulator ini akan memiliki kemampuan dasar seperti penjumlahan dan pengurangan. \n\nIni adalah cara terbaik untuk melatih logika berpikirmu tentang bagaimana 'objek' bisa menyimpan kemampuan (methods) dan data.",
        },
        {
          id: "py-l45-s2",
          type: "code",
          title: "Class Calculator",
          prompt: "Buat class `Calculator` dengan method `add(a, b)` dan `sub(a, b)`. Pastikan method tersebut mengembalikan hasil perhitungan.",
          starterCode: "class Calculator:\n    # TODO\n    pass",
          functionName: "Calculator",
          hints: ["Definisikan `add(self, a, b)` yang me-return `a + b`."],
          publicCases: [
            { input: [10, 5], output: 15 },
          ],
        },
      ],
    },
    "py-l46": {
      id: "py-l46",
      unitId: "unit-10",
      order: 46,
      title: "L46 — Mini Project: Bank Account",
      steps: [
        {
          id: "py-l46-s1",
          type: "explain",
          title: "Manajemen Saldo",
          markdown:
            "Sistem Perbankan Digital sederhana! 🏦\n\nDalam proyek ini, kamu akan mensimulasikan bagaimana akun bank bekerja. Setiap akun memiliki saldo (`balance`) dan pemilik bisa menyetor uang (`deposit`).\n\nDi sini kamu akan belajar bagaimana method dalam class bisa memanipulasi data yang ada di dalam class tersebut secara aman.",
        },
        {
          id: "py-l46-s2",
          type: "code",
          title: "Simulasi Bank",
          prompt: "Buat class `Account` dengan properti `balance` yang dimulai dari `0`. Buat method `deposit(amount)` yang menambah saldo.",
          starterCode: "class Account:\n    def __init__(self):\n        self.balance = 0\n    # TODO\n",
          functionName: "Account",
          hints: ["`self.balance += amount`"],
          publicCases: [
            { input: [100], output: 100 },
          ],
        },
      ],
    },
    "py-l47": {
      id: "py-l47",
      unitId: "unit-10",
      order: 47,
      title: "L47 — Mini Project: Validator Password",
      steps: [
        {
          id: "py-l47-s1",
          type: "explain",
          title: "Keamanan Teks",
          markdown:
            "Keamanan Cyber 101! 🛡️\n\nKamu akan membangun sistem pengecekan password otomatis. Sebuah password yang kuat tidak hanya panjang, tapi juga harus memiliki karakter spesial.\n\nLogika AND dan fungsi `len()` akan menjadi senjata utamamu di sini.",
        },
        {
          id: "py-l47-s2",
          type: "code",
          title: "Cek Kekuatan",
          prompt: "Buat fungsi `is_strong(pwd)` yang return True jika: panjang >= 8 DAN mengandung karakter '#'.",
          starterCode: "def is_strong(pwd):\n    # TODO\n    pass",
          functionName: "is_strong",
          hints: ["Gunakan `len(pwd) >= 8 and '#' in pwd`."],
          publicCases: [
            { input: ["pass123#"], output: true },
            { input: ["pendek#"], output: false },
          ],
        },
      ],
    },
    "py-l48": {
      id: "py-l48",
      unitId: "unit-10",
      order: 48,
      title: "L48 — Mini Project: Statistik List",
      steps: [
        {
          id: "py-l48-s1",
          type: "explain",
          title: "Analisis Angka",
          markdown: "Proyek keempat: Menghitung total dari sebuah list angka.",
        },
        {
          id: "py-l48-s2",
          type: "code",
          title: "Hitung Total",
          prompt: "Buat fungsi `sum_list(nums)` yang mengembalikan jumlah semua angka di dalam list `nums`.",
          starterCode: "def sum_list(nums):\n    # TODO\n    pass",
          functionName: "sum_list",
          hints: ["Gunakan fungsi bawaan `sum(nums)`."],
          publicCases: [
            { input: [[1, 2, 3]], output: 6 },
          ],
        },
      ],
    },
    "py-l49": {
      id: "py-l49",
      unitId: "unit-10",
      order: 49,
      title: "L49 — Capstone: Final Challenge",
      steps: [
        {
          id: "py-l49-s1",
          type: "explain",
          title: "Tantangan Terakhir",
          markdown: "Gabungkan semua ilmu yang kamu pelajari untuk membuat mini database sederhana.",
        },
        {
          id: "py-l49-s2",
          type: "code",
          title: "Simple DB",
          prompt: "Buat class `Database` dengan method `add_item(key, value)` yang menyimpan data ke dictionary `self.data`, dan `get_item(key)` yang mengambilnya.",
          starterCode: "class Database:\n    def __init__(self):\n        self.data = {}\n    # TODO\n",
          functionName: "Database",
          hints: ["Gunakan `self.data[key] = value`."],
          publicCases: [
            { input: ["name", "Ayu"], output: "Ayu" },
          ],
        },
      ],
    },
  },
};
