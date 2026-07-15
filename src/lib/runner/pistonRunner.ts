import { RunnerRequest, RunnerResponse } from "../types";

export async function runWithPiston(req: RunnerRequest): Promise<RunnerResponse> {
  const { code, functionName, publicCases, language } = req;

  // Pastikan function name ada di dalam code (Pengecekan simpel awal)
  const hasDef = new RegExp(`def\\s+${functionName}\\s*\\(`).test(code);
  if (!hasDef) {
    return {
      status: "fail",
      friendlyMessage: `Saya tidak menemukan fungsi \`${functionName}(...)\`. Pastikan formatnya: def ${functionName}(...):`,
      hintIndexSuggested: 0,
    };
  }

  // Jika kode kosong atau tidak ada return
  if (!/return\s+/.test(code) && code.includes('def ')) {
    return {
      status: "fail",
      friendlyMessage: "Fungsi Anda belum mengembalikan nilai. Gunakan `return ...`.",
      hintIndexSuggested: 0,
    };
  }

  // Siapkan script penguji (Test script)
  // Kita inject kodingan user lalu kita panggil fungsinya lewat assertions
  const testScript = `
import sys
import json
import traceback

# --- USER CODE START ---
${code}
# --- USER CODE END ---

def __run_tests():
    # Load cases generated from JS
    cases_json = """${JSON.stringify(publicCases).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"""
    cases = json.loads(cases_json)
    
    for i, c in enumerate(cases):
        inputs = c["input"]
        expected = c["output"]
        try:
            # Evaluasi function
            # Catatan: globals() berisi functionName jika user mendefinisikannya dengan benar
            if '${functionName}' not in globals():
                print(json.dumps({"error": f"Fungsi '${functionName}' tidak ditemukan di global scope."}))
                sys.exit(1)
                
            func = globals()['${functionName}']
            
            # Special class test handling
            if '${functionName}' == 'Calculator':
                obj = func()
                result = obj.add(inputs[0], inputs[1])
            elif '${functionName}' == 'Account':
                obj = func()
                obj.deposit(inputs[0])
                result = obj.balance
            elif '${functionName}' == 'Database':
                obj = func()
                obj.add_item(inputs[0], inputs[1])
                result = obj.get_item(inputs[0])
            else:
                result = func(*inputs)
            
            # Cast tuples to lists for matching JSON array comparisons
            if isinstance(result, tuple):
                result = list(result)
            
            if result != expected:
                print(json.dumps({
                    "error": f"Test case {i+1} gagal.",
                    "details": f"Input: {inputs} | Expected: {expected} | Got: {result}"
                }))
                sys.exit(1)
        except Exception as e:
            err_msg = "".join(traceback.format_exception_only(type(e), e)).strip()
            print(json.dumps({
                "error": f"Error eksekusi di test case {i+1}.",
                "details": err_msg
            }))
            sys.exit(1)

    print("ALL_PASS")

if __name__ == '__main__':
    __run_tests()
`;

  try {
    const res = await fetch("/api/run-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [
          {
            name: "main.py",
            content: testScript,
          },
        ],
        compile_timeout: 10000,
        run_timeout: 3000,
      }),
    });

    if (!res.ok) {
      return {
        status: "error",
        friendlyMessage: "Gagal memanggil execution engine. Sedang gangguan jaringan atau API limit.",
      };
    }

    const data = await res.json();
    const runResult = data.run;

    if (runResult.stderr) {
      // Cek apakah ini engine unavailable (bukan error Python user)
      if (runResult.stderr.includes("__ENGINE_UNAVAILABLE__")) {
        return {
          status: "error",
          friendlyMessage: "⚠️ Server kode sedang sibuk. Tunggu sebentar lalu klik Check lagi.",
        };
      }
       return {
         status: "error",
         stderr: runResult.stderr,
         friendlyMessage: "Terjadi error Python (Syntax / Runtime). Coba cek stderr.",
       }
    }

    const stdout = runResult.stdout.trim() || "";

    if (stdout.includes("ALL_PASS")) {
      return { status: "pass", stdout };
    }

    // Kalau tidak all_pass dan stdout berbentuk JSON error (buatan test script kita)
    try {
        const parsedErr = JSON.parse(stdout);
        if (parsedErr.error) {
            return {
                status: "fail",
                friendlyMessage: parsedErr.error + " " + (parsedErr.details || ""),
                stdout: stdout
            }
        }
    } catch(e) {
        // Abaikan parse error, mungkin ada stdout dari print user
    }

    return {
        status: "fail",
        stdout: stdout,
        friendlyMessage: "Test case belum lulus nih, coba cek log output-nya.",
    }

  } catch (error) {
    return {
      status: "error",
      friendlyMessage: "Koneksi terputus saat mencoba menjalankan kode.",
    };
  }
}

export async function runGenericPiston(code: string, language: string) {
  try {
    const res = await fetch("/api/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language === "python" ? "python" : language,
        version: "*",
        files: [{ name: "main", content: code }],
        compile_timeout: 10000,
        run_timeout: 3000,
      }),
    });
    if (!res.ok) {
      return { stdout: "", stderr: "Network or API limit" };
    }
    const data = await res.json();
    return { stdout: data.run.stdout, stderr: data.run.stderr };
  } catch (error) {
    return { stdout: "", stderr: "Timeout / Error Connection" };
  }
}
