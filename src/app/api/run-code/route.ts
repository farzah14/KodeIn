import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, files } = body;
    const content = files[0].content;

    // Siapkan folder temporary untuk menampung file kode sementara
    // Gunakan os.tmpdir() karena '/var/task' di Vercel bersifat read-only.
    const tmpDir = path.join(os.tmpdir(), "kodein_tmp_code");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const sessionId = Math.random().toString(36).substring(7);
    let runCmd = "";
    let filePath = "";

    if (language === "python" || language === "py") {
      filePath = path.join(tmpDir, `main_${sessionId}.py`);
      fs.writeFileSync(filePath, content);
      
      // Coba python3 dulu, jika tidak ada baru python
      runCmd = `python3 "${filePath}" || python "${filePath}"`;
    } else if (language === "javascript" || language === "js") {
      filePath = path.join(tmpDir, `main_${sessionId}.js`);
      fs.writeFileSync(filePath, content);
      runCmd = `node "${filePath}"`;
    } else if (language === "sql") {
      // Wrapper Python untuk mengeksekusi SQL di database memory SQLite
      const sqlFile = path.join(tmpDir, `script_${sessionId}.sql`);
      fs.writeFileSync(sqlFile, content);

      const sqlHarness = `
import sqlite3
import sys

try:
    with open(r'${sqlFile}', 'r', encoding='utf-8') as f:
        sql_script = f.read()

    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Split by semicolon for multiple statements
    statements = [s.strip() for s in sql_script.split(';') if s.strip()]
    for stmt in statements:
        cursor.execute(stmt)
        
        # Jika statement mengembalikan data (seperti SELECT)
        if cursor.description:
            rows = cursor.fetchall()
            if rows:
                cols = [desc[0] for desc in cursor.description]
                
                # Menghitung auto-padding kolom
                col_widths = [len(str(c)) for c in cols]
                for row in rows:
                    for i, r in enumerate(row):
                        col_widths[i] = max(col_widths[i], len(str(r)))
                        
                # Print header
                header = " | ".join(str(cols[i]).ljust(col_widths[i]) for i in range(len(cols)))
                print(header)
                print("-" * len(header))
                
                # Print rows
                for row in rows:
                    print(" | ".join(str(row[i]).ljust(col_widths[i]) for i in range(len(cols))))
                print("")
                
    conn.commit()
    conn.close()
    
    # Bersihkan file sql
    import os
    if os.path.exists(r'${sqlFile}'):
        os.remove(r'${sqlFile}')
except Exception as e:
    print("SQL Error:", str(e), file=sys.stderr)
    sys.exit(1)
`;
      filePath = path.join(tmpDir, `main_${sessionId}.py`);
      fs.writeFileSync(filePath, sqlHarness);
      runCmd = `python3 "${filePath}" || python "${filePath}"`;
    } else {
      return NextResponse.json({
        run: {
          stdout: "",
          stderr: `Language '${language}' is not supported yet by Local Engine.`,
          code: 1,
        },
      });
    }

    let stdout = "";
    let stderr = "";
    let code = 0;

    try {
      const { stdout: out, stderr: err } = await execAsync(runCmd, { timeout: 10000 }); // 10 second timeout
      stdout = out;
      stderr = err;
    } catch (error: any) {
      stdout = error.stdout || "";
      // Gunakan error.stderr jika ada, jika tidak, gunakan error.message lalu potong bagian "Command failed: ..."
      stderr = error.stderr ? error.stderr : (error.message || "");
      if (typeof stderr === "string") {
        stderr = stderr.replace(/^Command failed: .*?\n/g, "");
      }
      code = error.code || 1;
    }

    // SANITIZE: Sembunyikan path absolute server dari output user!
    if (typeof stdout === "string") {
        stdout = stdout.replace(new RegExp(filePath.replace(/\\/g, '\\\\'), 'g'), 'main.py');
        stdout = stdout.replace(new RegExp(tmpDir.replace(/\\/g, '\\\\'), 'g'), '');
    }
    if (typeof stderr === "string") {
        stderr = stderr.replace(new RegExp(filePath.replace(/\\/g, '\\\\'), 'g'), 'main.py');
        stderr = stderr.replace(new RegExp(tmpDir.replace(/\\/g, '\\\\'), 'g'), '');
        // Bersihkan nama script panjang jika masih tersisa
        stderr = stderr.replace(/main_[a-zA-Z0-9]+\.py/g, 'main.py');
        stderr = stderr.replace(/main_[a-zA-Z0-9]+\.js/g, 'main.js');
    }

    // Bersihkan file sementara
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      // Abaikan error hapus
    }

    return NextResponse.json({
      run: {
        stdout,
        stderr,
        code,
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      run: {
        stdout: "",
        stderr: `Local Engine Error: ${error.message}`,
        code: 1,
      },
    });
  }
}
