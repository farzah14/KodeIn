import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("BattleArena EventSource Connection lifecycle", () => {
  it("uses only roomId in useEffect dependencies to prevent SSE connection churn", () => {
    const filePath = path.join(__dirname, "page.tsx");
    const content = fs.readFileSync(filePath, "utf-8");

    // Find the EventSource useEffect hook call and check its dependency array
    const matches = content.match(/useEffect\(\(\)\s*=>\s*\{[\s\S]+?EventSource[\s\S]+?\}\s*,\s*\[([^\]]*)\]\)/);
    
    expect(matches).not.toBeNull();
    if (matches) {
      const dependencies = matches[1].split(",").map(d => d.trim()).filter(Boolean);
      expect(dependencies).toContain("roomId");
      expect(dependencies).not.toContain("code");
      expect(dependencies.length).toBe(1);
    }
  });
});
