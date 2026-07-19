const fs = require("fs");
const path = require("path");

// We can require ts-node or just parse the files using regex to avoid ts compilation issues in the script.
const contentPath = path.join(__dirname, "../src/lib/content.ts");
const practicePath = path.join(__dirname, "../src/lib/practiceChallenges.ts");

const contentStr = fs.readFileSync(contentPath, "utf-8");
const practiceStr = fs.readFileSync(practicePath, "utf-8");

// Regex to extract step IDs of type "code"
// Format in file:
// {
//   id: "py-l1-s2",
//   type: "code",
//   ...
//   publicCases: [ ... ]
// }
const stepRegex = /id:\s*"([^"]+)",\s*type:\s*"code"/g;
const stepIds = [];
let match;
while ((match = stepRegex.exec(contentStr)) !== null) {
  stepIds.push(match[1]);
}

// Format could also be type: "code", id: "..."
const stepRegex2 = /type:\s*"code",\s*id:\s*"([^"]+)"/g;
while ((match = stepRegex2.exec(contentStr)) !== null) {
  if (!stepIds.includes(match[1])) {
    stepIds.push(match[1]);
  }
}

console.log(`Found ${stepIds.length} code step IDs`);

// Extract practice challenge IDs
const practiceRegex = /id:\s*"([^"]+)"/g;
const practiceIds = [];
while ((match = practiceRegex.exec(practiceStr)) !== null) {
  if (!practiceIds.includes(match[1])) {
    practiceIds.push(match[1]);
  }
}
const challenges = practiceIds;

// Let's write the hiddenCases.ts contents
let code = `import "server-only";

export type TestCase = {
  input: string;
  expectedOutput: string;
};

export type StepTestCase = {
  input: any[];
  output: any;
};

export const hiddenPracticeCases: Record<string, TestCase[]> = {
`;

// Add practice challenges hidden cases
challenges.forEach(id => {
  code += `  "${id}": [\n`;
  // Let's generate a default case based on common sense or duplicate public cases
  if (id === "fizz-buzz") {
    code += `    { input: "30", expectedOutput: "FizzBuzz" },\n`;
    code += `    { input: "98", expectedOutput: "98" },\n`;
  } else if (id === "reverse-string") {
    code += `    { input: "hello world", expectedOutput: "dlrow olleh" },\n`;
  } else if (id === "sum-array") {
    code += `    { input: "[100,200,300]", expectedOutput: "600" },\n`;
  } else if (id === "is-palindrome") {
    code += `    { input: "step on no pets", expectedOutput: "True" },\n`;
  } else if (id === "count-vowels") {
    code += `    { input: "Beautiful Day", expectedOutput: "5" },\n`;
  } else {
    // Fallback default test cases
    code += `    { input: "fallback-input", expectedOutput: "fallback-output" },\n`;
  }
  code += `  ],\n`;
});

code += `};\n\nexport const hiddenStepCases: Record<string, StepTestCase[]> = {\n`;

// Add step hidden cases
stepIds.forEach(id => {
  code += `  "${id}": [\n`;
  code += `    { input: [], output: "placeholder" },\n`;
  code += `  ],\n`;
});

code += `};\n`;

const targetDir = path.join(__dirname, "../src/server/challenges");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
fs.writeFileSync(path.join(targetDir, "hiddenCases.ts"), code, "utf-8");
console.log("Generated hiddenCases.ts successfully!");
