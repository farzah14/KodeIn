import { afterEach } from "vitest";

afterEach(() => {
  delete process.env.PISTON_BASE_URL;
  delete process.env.PISTON_AUTH_TOKEN;
  delete process.env.RESEND_API_KEY;
  delete process.env.AUTH_URL;
});
