require('dotenv').config();

console.log("Checking Environment Variables...");
console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "PRESENT (Length: " + process.env.AUTH_SECRET.length + ")" : "MISSING");
console.log("AUTH_GOOGLE_ID:", process.env.AUTH_GOOGLE_ID ? "PRESENT" : "MISSING");
console.log("AUTH_GOOGLE_SECRET:", process.env.AUTH_GOOGLE_SECRET ? "PRESENT" : "MISSING");
console.log("AUTH_GITHUB_ID:", process.env.AUTH_GITHUB_ID ? "PRESENT" : "MISSING");
console.log("AUTH_GITHUB_SECRET:", process.env.AUTH_GITHUB_SECRET ? "PRESENT" : "MISSING");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "MISSING (Optional for v5 but good for testing)");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "PRESENT" : "MISSING");
