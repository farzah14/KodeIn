fetch("https://wandbox.org/api/compile.json", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ compiler: "cpython-3.10.6", code: "print('hello_from_wandbox')" })
}).then(r => r.json()).then(console.log).catch(console.error);
