const fs = require("fs");
const cp = require("child_process");

const sqlCode = `
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO users (name) VALUES ('Budi');
SELECT * FROM users;
`;

const harness = \`
import sqlite3
import sys

sql_script = """\${sqlCode.replace(/"/g, '\\\\\"').replace(/\\n/g, '\\n')}"""

try:
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    statements = [s.strip() for s in sql_script.split(';') if s.strip()]
    for stmt in statements:
        cursor.execute(stmt)
        if stmt.upper().startswith('SELECT'):
            rows = cursor.fetchall()
            print("ROWS:", rows)
except Exception as e:
    print("ERR:", str(e))
\`

fs.writeFileSync("testpy.py", harness);
console.log(cp.execSync("python testpy.py").toString());
