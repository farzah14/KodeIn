export type Difficulty = "Easy" | "Medium";
export type Category = "Array" | "String" | "Math" | "HashMap" | "Two Pointers" | "Logic" | "Sorting" | "Stack";

export type PracticeChallenge = {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  xp: number;
  starterCode: string;
  testCases: { input: string; expectedOutput: string }[];
};

export const practiceChallenges: PracticeChallenge[] = [
  // ── EASY ──────────────────────────────────────────────────────────────────
  {
    number: 1,
    id: "fizz-buzz",
    title: "FizzBuzz Classic",
    difficulty: "Easy", category: "Logic", xp: 50,
    description: "Tulis fungsi `fizz_buzz(n)` yang mengembalikan:\n- 'FizzBuzz' jika n habis dibagi 3 DAN 5\n- 'Fizz' jika n habis dibagi 3\n- 'Buzz' jika n habis dibagi 5\n- String dari n jika tidak ada yang berlaku",
    starterCode: `def fizz_buzz(n):
    # Tulis kodemu di sini
    pass

import sys
n = int(sys.stdin.read().strip())
print(fizz_buzz(n))`,
    testCases: [
      { input: "3", expectedOutput: "Fizz" },
      { input: "5", expectedOutput: "Buzz" },
      { input: "15", expectedOutput: "FizzBuzz" },
      { input: "7", expectedOutput: "7" },
    ],
  },
  {
    number: 2,
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy", category: "String", xp: 50,
    description: "Tulis fungsi `reverse_string(s)` yang mengembalikan string yang dibalik.",
    starterCode: `def reverse_string(s):
    pass

import sys
s = sys.stdin.read().strip()
print(reverse_string(s))`,
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "kodein", expectedOutput: "niedok" },
      { input: "a", expectedOutput: "a" },
    ],
  },
  {
    number: 3,
    id: "sum-array",
    title: "Sum of Array",
    difficulty: "Easy", category: "Array", xp: 50,
    description: "Tulis fungsi `sum_array(arr)` yang mengembalikan total penjumlahan semua elemen array integer.",
    starterCode: `import json

def sum_array(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
print(sum_array(arr))`,
    testCases: [
      { input: "[1,2,3,4,5]", expectedOutput: "15" },
      { input: "[-1,10,5]", expectedOutput: "14" },
      { input: "[]", expectedOutput: "0" },
    ],
  },
  {
    number: 4,
    id: "is-palindrome",
    title: "Cek Palindrom",
    difficulty: "Easy", category: "String", xp: 50,
    description: "Tulis fungsi `is_palindrome(s)` yang mengembalikan True jika s adalah palindrom, False jika tidak.",
    starterCode: `def is_palindrome(s):
    pass

import sys
s = sys.stdin.read().strip()
print(is_palindrome(s))`,
    testCases: [
      { input: "radar", expectedOutput: "True" },
      { input: "level", expectedOutput: "True" },
      { input: "kodein", expectedOutput: "False" },
      { input: "a", expectedOutput: "True" },
    ],
  },
  {
    number: 5,
    id: "count-vowels",
    title: "Hitung Vokal",
    difficulty: "Easy", category: "String", xp: 50,
    description: "Tulis fungsi `count_vowels(s)` yang menghitung jumlah huruf vokal (a, e, i, o, u) dalam string. Tidak case-sensitive.",
    starterCode: `def count_vowels(s):
    pass

import sys
s = sys.stdin.read().strip()
print(count_vowels(s))`,
    testCases: [
      { input: "hello world", expectedOutput: "3" },
      { input: "KodeIn", expectedOutput: "3" },
      { input: "rhythm", expectedOutput: "0" },
    ],
  },
  {
    number: 6,
    id: "max-in-array",
    title: "Nilai Terbesar",
    difficulty: "Easy", category: "Array", xp: 50,
    description: "Tulis fungsi `max_in_array(arr)` yang mengembalikan nilai terbesar dalam array integer. Jangan gunakan fungsi max() bawaan.",
    starterCode: `import json

def max_in_array(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
print(max_in_array(arr))`,
    testCases: [
      { input: "[3,1,4,1,5,9,2,6]", expectedOutput: "9" },
      { input: "[-5,-1,-3]", expectedOutput: "-1" },
      { input: "[42]", expectedOutput: "42" },
    ],
  },
  {
    number: 7,
    id: "factorial",
    title: "Faktorial",
    difficulty: "Easy", category: "Math", xp: 50,
    description: "Tulis fungsi `factorial(n)` yang mengembalikan n! (n faktorial). Contoh: 5! = 120.",
    starterCode: `def factorial(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(factorial(n))`,
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "10", expectedOutput: "3628800" },
    ],
  },
  {
    number: 8,
    id: "is-anagram",
    title: "Cek Anagram",
    difficulty: "Easy", category: "HashMap", xp: 75,
    description: "Tulis fungsi `is_anagram(s, t)` yang mengembalikan True jika s dan t adalah anagram (menggunakan huruf yang sama dengan jumlah yang sama).",
    starterCode: `import json

def is_anagram(s, t):
    pass

import sys
data = json.loads(sys.stdin.read().strip())
print(is_anagram(data[0], data[1]))`,
    testCases: [
      { input: '["anagram","nagaram"]', expectedOutput: "True" },
      { input: '["rat","car"]', expectedOutput: "False" },
      { input: '["listen","silent"]', expectedOutput: "True" },
    ],
  },
  {
    number: 9,
    id: "fibonacci",
    title: "Bilangan Fibonacci",
    difficulty: "Easy", category: "Math", xp: 75,
    description: "Tulis fungsi `fibonacci(n)` yang mengembalikan bilangan Fibonacci ke-n.\nF(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).",
    starterCode: `def fibonacci(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(fibonacci(n))`,
    testCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "10", expectedOutput: "55" },
    ],
  },
  {
    number: 10,
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy", category: "HashMap", xp: 75,
    description: "Tulis fungsi `two_sum(nums, target)` yang mengembalikan indeks dua angka dalam array yang berjumlah target. Kembalikan dalam format [i, j] dimana i < j.",
    starterCode: `import json

def two_sum(nums, target):
    pass

import sys
data = json.loads(sys.stdin.read().strip())
result = two_sum(data[0], data[1])
print(json.dumps(sorted(result)))`,
    testCases: [
      { input: "[[2,7,11,15], 9]", expectedOutput: "[0, 1]" },
      { input: "[[3,2,4], 6]", expectedOutput: "[1, 2]" },
      { input: "[[3,3], 6]", expectedOutput: "[0, 1]" },
    ],
  },
  {
    number: 11,
    id: "count-words",
    title: "Hitung Kata",
    difficulty: "Easy", category: "String", xp: 50,
    description: "Tulis fungsi `count_words(s)` yang menghitung jumlah kata dalam sebuah kalimat. Kata dipisahkan oleh spasi.",
    starterCode: `def count_words(s):
    pass

import sys
s = sys.stdin.read().strip()
print(count_words(s))`,
    testCases: [
      { input: "hello world", expectedOutput: "2" },
      { input: "belajar coding itu menyenangkan", expectedOutput: "4" },
      { input: "satu", expectedOutput: "1" },
    ],
  },
  {
    number: 12,
    id: "power-of-two",
    title: "Pangkat Dua",
    difficulty: "Easy", category: "Math", xp: 50,
    description: "Tulis fungsi `is_power_of_two(n)` yang mengembalikan True jika n adalah pangkat dari 2, False jika tidak. n selalu bilangan bulat positif.",
    starterCode: `def is_power_of_two(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(is_power_of_two(n))`,
    testCases: [
      { input: "1", expectedOutput: "True" },
      { input: "16", expectedOutput: "True" },
      { input: "3", expectedOutput: "False" },
    ],
  },
  {
    number: 13,
    id: "remove-duplicates",
    title: "Hapus Duplikat",
    difficulty: "Easy", category: "Array", xp: 75,
    description: "Tulis fungsi `remove_duplicates(arr)` yang mengembalikan array baru tanpa elemen duplikat, dengan mempertahankan urutan kemunculan pertama.",
    starterCode: `import json

def remove_duplicates(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
print(json.dumps(remove_duplicates(arr)))`,
    testCases: [
      { input: "[1,1,2,3,3,4]", expectedOutput: "[1, 2, 3, 4]" },
      { input: "[4,3,2,1]", expectedOutput: "[4, 3, 2, 1]" },
      { input: "[1,1,1]", expectedOutput: "[1]" },
    ],
  },
  {
    number: 14,
    id: "celsius-to-fahrenheit",
    title: "Konversi Suhu",
    difficulty: "Easy", category: "Math", xp: 50,
    description: "Tulis fungsi `celsius_to_fahrenheit(c)` yang mengkonversi suhu dari Celsius ke Fahrenheit.\nRumus: F = (C * 9/5) + 32. Bulatkan ke 2 desimal.",
    starterCode: `def celsius_to_fahrenheit(c):
    pass

import sys
c = float(sys.stdin.read().strip())
print(celsius_to_fahrenheit(c))`,
    testCases: [
      { input: "0", expectedOutput: "32.0" },
      { input: "100", expectedOutput: "212.0" },
      { input: "37", expectedOutput: "98.6" },
    ],
  },
  {
    number: 15,
    id: "is-prime",
    title: "Bilangan Prima",
    difficulty: "Easy", category: "Math", xp: 75,
    description: "Tulis fungsi `is_prime(n)` yang mengembalikan True jika n adalah bilangan prima, False jika tidak.",
    starterCode: `def is_prime(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(is_prime(n))`,
    testCases: [
      { input: "2", expectedOutput: "True" },
      { input: "7", expectedOutput: "True" },
      { input: "1", expectedOutput: "False" },
      { input: "9", expectedOutput: "False" },
    ],
  },
  {
    number: 16,
    id: "string-uppercase",
    title: "Huruf Besar di Awal",
    difficulty: "Easy", category: "String", xp: 50,
    description: "Tulis fungsi `capitalize_words(s)` yang mengubah huruf pertama setiap kata menjadi huruf kapital.",
    starterCode: `def capitalize_words(s):
    pass

import sys
s = sys.stdin.read().strip()
print(capitalize_words(s))`,
    testCases: [
      { input: "hello world", expectedOutput: "Hello World" },
      { input: "belajar coding", expectedOutput: "Belajar Coding" },
      { input: "python", expectedOutput: "Python" },
    ],
  },
  {
    number: 17,
    id: "min-max-diff",
    title: "Selisih Min-Max",
    difficulty: "Easy", category: "Array", xp: 50,
    description: "Tulis fungsi `min_max_diff(arr)` yang mengembalikan selisih antara nilai terbesar dan terkecil dalam array.",
    starterCode: `import json

def min_max_diff(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
print(min_max_diff(arr))`,
    testCases: [
      { input: "[1,5,3,9,2]", expectedOutput: "8" },
      { input: "[10,10,10]", expectedOutput: "0" },
      { input: "[-3,7]", expectedOutput: "10" },
    ],
  },
  {
    number: 18,
    id: "count-char",
    title: "Hitung Karakter",
    difficulty: "Easy", category: "String", xp: 50,
    description: "Tulis fungsi `count_char(s, c)` yang menghitung berapa kali karakter c muncul dalam string s.",
    starterCode: `import json

def count_char(s, c):
    pass

import sys
data = json.loads(sys.stdin.read().strip())
print(count_char(data[0], data[1]))`,
    testCases: [
      { input: '["hello", "l"]', expectedOutput: "2" },
      { input: '["banana", "a"]', expectedOutput: "3" },
      { input: '["python", "z"]', expectedOutput: "0" },
    ],
  },
  {
    number: 19,
    id: "flatten-array",
    title: "Ratakan Array 2D",
    difficulty: "Easy", category: "Array", xp: 75,
    description: "Tulis fungsi `flatten(arr)` yang mengubah array 2D (array berisi array) menjadi array 1D.",
    starterCode: `import json

def flatten(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
print(json.dumps(flatten(arr)))`,
    testCases: [
      { input: "[[1,2],[3,4],[5]]", expectedOutput: "[1, 2, 3, 4, 5]" },
      { input: "[[1],[2],[3]]", expectedOutput: "[1, 2, 3]" },
      { input: "[[1,2,3]]", expectedOutput: "[1, 2, 3]" },
    ],
  },
  {
    number: 20,
    id: "gcd",
    title: "FPB (GCD)",
    difficulty: "Easy", category: "Math", xp: 75,
    description: "Tulis fungsi `gcd(a, b)` yang mengembalikan Faktor Persekutuan Terbesar dari dua bilangan bulat positif tanpa menggunakan math.gcd.",
    starterCode: `import json

def gcd(a, b):
    pass

import sys
data = json.loads(sys.stdin.read().strip())
print(gcd(data[0], data[1]))`,
    testCases: [
      { input: "[12, 18]", expectedOutput: "6" },
      { input: "[100, 75]", expectedOutput: "25" },
      { input: "[7, 13]", expectedOutput: "1" },
    ],
  },
  // ── MEDIUM ────────────────────────────────────────────────────────────────
  {
    number: 21,
    id: "valid-parentheses",
    title: "Kurung Valid",
    difficulty: "Medium", category: "Stack", xp: 100,
    description: "Tulis fungsi `is_valid(s)` yang menentukan apakah string yang berisi '(', ')', '{', '}', '[', ']' memiliki pasangan kurung yang valid.",
    starterCode: `def is_valid(s):
    pass

import sys
s = sys.stdin.read().strip()
print(is_valid(s))`,
    testCases: [
      { input: "()", expectedOutput: "True" },
      { input: "()[]{}", expectedOutput: "True" },
      { input: "(]", expectedOutput: "False" },
      { input: "([)]", expectedOutput: "False" },
    ],
  },
  {
    number: 22,
    id: "longest-common-prefix",
    title: "Prefix Bersama Terpanjang",
    difficulty: "Medium", category: "String", xp: 100,
    description: "Tulis fungsi `longest_common_prefix(words)` yang mengembalikan prefix bersama terpanjang dari daftar kata. Kembalikan string kosong jika tidak ada prefix bersama.",
    starterCode: `import json

def longest_common_prefix(words):
    pass

import sys
words = json.loads(sys.stdin.read().strip())
print(longest_common_prefix(words))`,
    testCases: [
      { input: '["flower","flow","flight"]', expectedOutput: "fl" },
      { input: '["dog","racecar","car"]', expectedOutput: "" },
      { input: '["interview","interact","interface"]', expectedOutput: "inter" },
    ],
  },
  {
    number: 23,
    id: "missing-number",
    title: "Angka yang Hilang",
    difficulty: "Medium", category: "Math", xp: 100,
    description: "Tulis fungsi `missing_number(nums)` yang menemukan angka yang hilang dalam array berisi n angka berbeda dari 0 hingga n.",
    starterCode: `import json

def missing_number(nums):
    pass

import sys
nums = json.loads(sys.stdin.read().strip())
print(missing_number(nums))`,
    testCases: [
      { input: "[3,0,1]", expectedOutput: "2" },
      { input: "[0,1]", expectedOutput: "2" },
      { input: "[9,6,4,2,3,5,7,0,1]", expectedOutput: "8" },
    ],
  },
  {
    number: 24,
    id: "reverse-words",
    title: "Balik Urutan Kata",
    difficulty: "Medium", category: "String", xp: 100,
    description: "Tulis fungsi `reverse_words(s)` yang membalik urutan kata (bukan karakter) dalam sebuah kalimat.",
    starterCode: `def reverse_words(s):
    pass

import sys
s = sys.stdin.read().strip()
print(reverse_words(s))`,
    testCases: [
      { input: "the sky is blue", expectedOutput: "blue is sky the" },
      { input: "hello world", expectedOutput: "world hello" },
      { input: "coding is fun", expectedOutput: "fun is coding" },
    ],
  },
  {
    number: 25,
    id: "move-zeros",
    title: "Pindahkan Nol",
    difficulty: "Medium", category: "Two Pointers", xp: 100,
    description: "Tulis fungsi `move_zeros(nums)` yang memindahkan semua nol ke akhir array sambil mempertahankan urutan relatif elemen non-nol.",
    starterCode: `import json

def move_zeros(nums):
    pass

import sys
nums = json.loads(sys.stdin.read().strip())
print(json.dumps(move_zeros(nums)))`,
    testCases: [
      { input: "[0,1,0,3,12]", expectedOutput: "[1, 3, 12, 0, 0]" },
      { input: "[0,0,1]", expectedOutput: "[1, 0, 0]" },
      { input: "[1,2,3]", expectedOutput: "[1, 2, 3]" },
    ],
  },
  {
    number: 26,
    id: "second-largest",
    title: "Nilai Terbesar Kedua",
    difficulty: "Medium", category: "Array", xp: 100,
    description: "Tulis fungsi `second_largest(nums)` yang mengembalikan nilai terbesar kedua yang unik dalam array. Kembalikan -1 jika tidak ada.",
    starterCode: `import json

def second_largest(nums):
    pass

import sys
nums = json.loads(sys.stdin.read().strip())
print(second_largest(nums))`,
    testCases: [
      { input: "[3,1,4,1,5,9,2,6]", expectedOutput: "6" },
      { input: "[1,1,1]", expectedOutput: "-1" },
      { input: "[10,5]", expectedOutput: "5" },
    ],
  },
  {
    number: 27,
    id: "roman-to-integer",
    title: "Romawi ke Integer",
    difficulty: "Medium", category: "HashMap", xp: 100,
    description: "Tulis fungsi `roman_to_int(s)` yang mengkonversi angka romawi ke integer.\nSimbol: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.",
    starterCode: `def roman_to_int(s):
    pass

import sys
s = sys.stdin.read().strip()
print(roman_to_int(s))`,
    testCases: [
      { input: "III", expectedOutput: "3" },
      { input: "IX", expectedOutput: "9" },
      { input: "LVIII", expectedOutput: "58" },
      { input: "MCMXCIV", expectedOutput: "1994" },
    ],
  },
  {
    number: 28,
    id: "frequency-map",
    title: "Peta Frekuensi",
    difficulty: "Medium", category: "HashMap", xp: 100,
    description: "Tulis fungsi `frequency_map(arr)` yang mengembalikan dictionary berisi setiap elemen dan jumlah kemunculannya, diurutkan berdasarkan frekuensi tertinggi terlebih dahulu.",
    starterCode: `import json

def frequency_map(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
result = frequency_map(arr)
# Print as sorted items: element:count
for k, v in result:
    print(f"{k}:{v}")`,
    testCases: [
      { input: "[1,2,2,3,3,3]", expectedOutput: "3:3\n2:2\n1:1" },
      { input: "[4,4,4,4]", expectedOutput: "4:4" },
      { input: "[1,2,3]", expectedOutput: "1:1\n2:1\n3:1" },
    ],
  },
  {
    number: 29,
    id: "binary-search",
    title: "Pencarian Biner",
    difficulty: "Medium", category: "Array", xp: 100,
    description: "Tulis fungsi `binary_search(nums, target)` yang mencari target dalam array yang sudah terurut. Kembalikan indeksnya atau -1 jika tidak ditemukan.",
    starterCode: `import json

def binary_search(nums, target):
    pass

import sys
data = json.loads(sys.stdin.read().strip())
print(binary_search(data[0], data[1]))`,
    testCases: [
      { input: "[[1,3,5,7,9], 7]", expectedOutput: "3" },
      { input: "[[1,3,5,7,9], 4]", expectedOutput: "-1" },
      { input: "[[2,4,6,8,10], 10]", expectedOutput: "4" },
    ],
  },
  {
    number: 30,
    id: "pangram",
    title: "Cek Pangram",
    difficulty: "Medium", category: "String", xp: 100,
    description: "Tulis fungsi `is_pangram(s)` yang mengembalikan True jika kalimat s mengandung setiap huruf alfabet minimal sekali (tidak case-sensitive).",
    starterCode: `def is_pangram(s):
    pass

import sys
s = sys.stdin.read().strip()
print(is_pangram(s))`,
    testCases: [
      { input: "The quick brown fox jumps over the lazy dog", expectedOutput: "True" },
      { input: "Hello World", expectedOutput: "False" },
      { input: "Pack my box with five dozen liquor jugs", expectedOutput: "True" },
    ],
  },
  {
    number: 31,
    id: "intersection-arrays",
    title: "Irisan Dua Array",
    difficulty: "Medium", category: "HashMap", xp: 100,
    description: "Tulis fungsi `intersection(a, b)` yang mengembalikan array berisi elemen-elemen yang ada di KEDUA array, tanpa duplikat, diurutkan secara menaik.",
    starterCode: `import json

def intersection(a, b):
    pass

import sys
data = json.loads(sys.stdin.read().strip())
print(json.dumps(intersection(data[0], data[1])))`,
    testCases: [
      { input: "[[1,2,2,1],[2,2]]", expectedOutput: "[2]" },
      { input: "[[4,9,5],[9,4,9,8,4]]", expectedOutput: "[4, 9]" },
      { input: "[[1,2],[3,4]]", expectedOutput: "[]" },
    ],
  },
  {
    number: 32,
    id: "rotate-array",
    title: "Rotasi Array",
    difficulty: "Medium", category: "Array", xp: 100,
    description: "Tulis fungsi `rotate(nums, k)` yang merotasi array ke kanan sebanyak k langkah.\nContoh: [1,2,3,4,5], k=2 → [4,5,1,2,3]",
    starterCode: `import json

def rotate(nums, k):
    pass

import sys
data = json.loads(sys.stdin.read().strip())
result = rotate(data[0], data[1])
print(json.dumps(result))`,
    testCases: [
      { input: "[[1,2,3,4,5], 2]", expectedOutput: "[4, 5, 1, 2, 3]" },
      { input: "[[1,2,3], 1]", expectedOutput: "[3, 1, 2]" },
      { input: "[[1], 5]", expectedOutput: "[1]" },
    ],
  },
  {
    number: 33,
    id: "title-case",
    title: "Title Case",
    difficulty: "Easy", category: "String", xp: 50,
    description: "Tulis fungsi `title_case(s)` yang mengkonversi string menjadi title case: huruf pertama tiap kata kapital, sisanya kecil.",
    starterCode: `def title_case(s):
    pass

import sys
s = sys.stdin.read().strip()
print(title_case(s))`,
    testCases: [
      { input: "hello WORLD", expectedOutput: "Hello World" },
      { input: "THE QUICK BROWN FOX", expectedOutput: "The Quick Brown Fox" },
      { input: "python programming", expectedOutput: "Python Programming" },
    ],
  },
  {
    number: 34,
    id: "sum-digits",
    title: "Jumlah Digit",
    difficulty: "Easy", category: "Math", xp: 50,
    description: "Tulis fungsi `sum_digits(n)` yang mengembalikan total dari semua digit bilangan bulat positif n.",
    starterCode: `def sum_digits(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(sum_digits(n))`,
    testCases: [
      { input: "123", expectedOutput: "6" },
      { input: "9999", expectedOutput: "36" },
      { input: "0", expectedOutput: "0" },
    ],
  },
  {
    number: 35,
    id: "longest-word",
    title: "Kata Terpanjang",
    difficulty: "Easy", category: "String", xp: 75,
    description: "Tulis fungsi `longest_word(s)` yang mengembalikan kata terpanjang dalam kalimat. Jika ada lebih dari satu, kembalikan yang pertama.",
    starterCode: `def longest_word(s):
    pass

import sys
s = sys.stdin.read().strip()
print(longest_word(s))`,
    testCases: [
      { input: "The quick brown fox", expectedOutput: "quick" },
      { input: "I love programming", expectedOutput: "programming" },
      { input: "a bb ccc", expectedOutput: "ccc" },
    ],
  },
  {
    number: 36,
    id: "count-occurrences",
    title: "Elemen Paling Sering",
    difficulty: "Medium", category: "HashMap", xp: 100,
    description: "Tulis fungsi `most_frequent(arr)` yang mengembalikan elemen yang paling sering muncul dalam array. Jika ada seri, kembalikan yang terkecil.",
    starterCode: `import json

def most_frequent(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
print(most_frequent(arr))`,
    testCases: [
      { input: "[1,2,2,3,3,3]", expectedOutput: "3" },
      { input: "[5,5,4,4]", expectedOutput: "4" },
      { input: "[7]", expectedOutput: "7" },
    ],
  },
  {
    number: 37,
    id: "is-sorted",
    title: "Cek Array Terurut",
    difficulty: "Easy", category: "Array", xp: 50,
    description: "Tulis fungsi `is_sorted(arr)` yang mengembalikan True jika array sudah terurut secara menaik (ascending), False jika tidak.",
    starterCode: `import json

def is_sorted(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
print(is_sorted(arr))`,
    testCases: [
      { input: "[1,2,3,4,5]", expectedOutput: "True" },
      { input: "[1,3,2,5]", expectedOutput: "False" },
      { input: "[1,1,2,3]", expectedOutput: "True" },
    ],
  },
  {
    number: 38,
    id: "even-odd-split",
    title: "Pisahkan Genap-Ganjil",
    difficulty: "Easy", category: "Array", xp: 75,
    description: "Tulis fungsi `split_even_odd(arr)` yang mengembalikan tuple (even_list, odd_list) berisi angka genap dan ganjil dari array, masing-masing dalam urutan aslinya.",
    starterCode: `import json

def split_even_odd(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
evens, odds = split_even_odd(arr)
print(json.dumps(evens))
print(json.dumps(odds))`,
    testCases: [
      { input: "[1,2,3,4,5,6]", expectedOutput: "[2, 4, 6]\n[1, 3, 5]" },
      { input: "[10,21,32]", expectedOutput: "[10, 32]\n[21]" },
      { input: "[2,4,6]", expectedOutput: "[2, 4, 6]\n[]" },
    ],
  },
  {
    number: 39,
    id: "string-compression",
    title: "Kompresi String",
    difficulty: "Medium", category: "String", xp: 100,
    description: "Tulis fungsi `compress(s)` yang mengkompres string dengan menghitung karakter berulang.\nContoh: 'aabccc' → 'a2b1c3'. Jika hasil lebih panjang dari input, kembalikan input asli.",
    starterCode: `def compress(s):
    pass

import sys
s = sys.stdin.read().strip()
print(compress(s))`,
    testCases: [
      { input: "aabccc", expectedOutput: "a2b1c3" },
      { input: "abc", expectedOutput: "abc" },
      { input: "aaaa", expectedOutput: "a4" },
    ],
  },
  {
    number: 40,
    id: "product-except-self",
    title: "Hasil Kali Kecuali Diri",
    difficulty: "Medium", category: "Array", xp: 150,
    description: "Tulis fungsi `product_except_self(nums)` yang mengembalikan array dimana setiap elemen adalah hasil kali semua elemen array kecuali elemen pada posisi tersebut. Tanpa menggunakan operator divisi.",
    starterCode: `import json

def product_except_self(nums):
    pass

import sys
nums = json.loads(sys.stdin.read().strip())
print(json.dumps(product_except_self(nums)))`,
    testCases: [
      { input: "[1,2,3,4]", expectedOutput: "[24, 12, 8, 6]" },
      { input: "[2,3,4]", expectedOutput: "[12, 8, 6]" },
      { input: "[1,1,1]", expectedOutput: "[1, 1, 1]" },
    ],
  },
  {
    number: 41,
    id: "count-primes",
    title: "Hitung Bilangan Prima",
    difficulty: "Medium", category: "Math", xp: 100,
    description: "Tulis fungsi `count_primes(n)` yang menghitung berapa banyak bilangan prima yang lebih kecil dari n.",
    starterCode: `def count_primes(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(count_primes(n))`,
    testCases: [
      { input: "10", expectedOutput: "4" },
      { input: "0", expectedOutput: "0" },
      { input: "30", expectedOutput: "10" },
    ],
  },
  {
    number: 42,
    id: "balanced-string",
    title: "String Seimbang",
    difficulty: "Medium", category: "String", xp: 100,
    description: "Tulis fungsi `is_balanced(s)` yang menentukan apakah string hanya berisi '0' dan '1' dengan jumlah yang sama.",
    starterCode: `def is_balanced(s):
    pass

import sys
s = sys.stdin.read().strip()
print(is_balanced(s))`,
    testCases: [
      { input: "0011", expectedOutput: "True" },
      { input: "01", expectedOutput: "True" },
      { input: "001", expectedOutput: "False" },
      { input: "10", expectedOutput: "True" },
    ],
  },
  {
    number: 43,
    id: "matrix-diagonal",
    title: "Jumlah Diagonal Matriks",
    difficulty: "Medium", category: "Array", xp: 100,
    description: "Tulis fungsi `diagonal_sum(matrix)` yang mengembalikan jumlah elemen diagonal utama dan diagonal sekunder dari matriks NxN. Jika ada elemen di tengah (untuk N ganjil), hitung hanya sekali.",
    starterCode: `import json

def diagonal_sum(matrix):
    pass

import sys
matrix = json.loads(sys.stdin.read().strip())
print(diagonal_sum(matrix))`,
    testCases: [
      { input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "25" },
      { input: "[[1,1],[1,1]]", expectedOutput: "4" },
      { input: "[[5]]", expectedOutput: "5" },
    ],
  },
  {
    number: 44,
    id: "zigzag-array",
    title: "Array Zigzag",
    difficulty: "Medium", category: "Sorting", xp: 100,
    description: "Tulis fungsi `zigzag(arr)` yang mengatur ulang array sehingga arr[0] <= arr[1] >= arr[2] <= arr[3] >= ...",
    starterCode: `import json

def zigzag(arr):
    pass

import sys
arr = json.loads(sys.stdin.read().strip())
result = zigzag(arr)
# Verify zigzag property
n = len(result)
valid = all((result[i] <= result[i+1] if i%2==0 else result[i] >= result[i+1]) for i in range(n-1))
print(valid)`,
    testCases: [
      { input: "[4,3,7,8,6,2,1]", expectedOutput: "True" },
      { input: "[1,2,3]", expectedOutput: "True" },
      { input: "[5,5,5]", expectedOutput: "True" },
    ],
  },
  {
    number: 45,
    id: "number-to-binary",
    title: "Desimal ke Biner",
    difficulty: "Easy", category: "Math", xp: 50,
    description: "Tulis fungsi `to_binary(n)` yang mengkonversi bilangan desimal positif ke string biner tanpa menggunakan fungsi bin() bawaan Python.",
    starterCode: `def to_binary(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(to_binary(n))`,
    testCases: [
      { input: "5", expectedOutput: "101" },
      { input: "10", expectedOutput: "1010" },
      { input: "1", expectedOutput: "1" },
    ],
  },
  {
    number: 46,
    id: "longest-substring",
    title: "Substring Unik Terpanjang",
    difficulty: "Medium", category: "Two Pointers", xp: 150,
    description: "Tulis fungsi `longest_unique_substring(s)` yang mengembalikan panjang substring terpanjang yang tidak memiliki karakter berulang.",
    starterCode: `def longest_unique_substring(s):
    pass

import sys
s = sys.stdin.read().strip()
print(longest_unique_substring(s))`,
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
    ],
  },
  {
    number: 47,
    id: "transpose-matrix",
    title: "Transpose Matriks",
    difficulty: "Medium", category: "Array", xp: 100,
    description: "Tulis fungsi `transpose(matrix)` yang mengembalikan transpose dari matriks input (baris menjadi kolom dan sebaliknya).",
    starterCode: `import json

def transpose(matrix):
    pass

import sys
matrix = json.loads(sys.stdin.read().strip())
print(json.dumps(transpose(matrix)))`,
    testCases: [
      { input: "[[1,2,3],[4,5,6]]", expectedOutput: "[[1, 4], [2, 5], [3, 6]]" },
      { input: "[[1,2],[3,4]]", expectedOutput: "[[1, 3], [2, 4]]" },
      { input: "[[1]]", expectedOutput: "[[1]]" },
    ],
  },
  {
    number: 48,
    id: "sum-of-squares",
    title: "Jumlah Kuadrat vs Kuadrat Jumlah",
    difficulty: "Medium", category: "Math", xp: 100,
    description: "Tulis fungsi `sum_square_diff(n)` yang mengembalikan selisih antara kuadrat dari jumlah (1..n) dan jumlah dari kuadrat (1..n).",
    starterCode: `def sum_square_diff(n):
    pass

import sys
n = int(sys.stdin.read().strip())
print(sum_square_diff(n))`,
    testCases: [
      { input: "10", expectedOutput: "2640" },
      { input: "1", expectedOutput: "0" },
      { input: "5", expectedOutput: "170" },
    ],
  },
  {
    number: 49,
    id: "group-anagrams",
    title: "Kelompokkan Anagram",
    difficulty: "Medium", category: "HashMap", xp: 150,
    description: "Tulis fungsi `group_anagrams(words)` yang mengelompokkan kata-kata yang merupakan anagram satu sama lain. Kembalikan jumlah kelompok.",
    starterCode: `import json

def group_anagrams(words):
    pass

import sys
words = json.loads(sys.stdin.read().strip())
print(group_anagrams(words))`,
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: "3" },
      { input: '["a"]', expectedOutput: "1" },
      { input: '["abc","bca","cab","xyz"]', expectedOutput: "2" },
    ],
  },
  {
    number: 50,
    id: "max-subarray",
    title: "Subarray Terbesar (Kadane's)",
    difficulty: "Medium", category: "Array", xp: 150,
    description: "Tulis fungsi `max_subarray(nums)` yang mencari nilai terbesar dari semua subarray kontinu yang mungkin.\nContoh: [-2,1,-3,4,-1,2,1,-5,4] → 6 (dari [4,-1,2,1])",
    starterCode: `import json

def max_subarray(nums):
    pass

import sys
nums = json.loads(sys.stdin.read().strip())
print(max_subarray(nums))`,
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { input: "[1]", expectedOutput: "1" },
      { input: "[-1,-2,-3]", expectedOutput: "-1" },
    ],
  },
];
