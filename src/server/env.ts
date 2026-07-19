import "server-only";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function authEnv() {
  return {
    secret: required("AUTH_SECRET"),
    appUrl: new URL(required("AUTH_URL")).toString().replace(/\/$/, ""),
  };
}

export function emailEnv() {
  return {
    apiKey: required("RESEND_API_KEY"),
    from: required("EMAIL_FROM"),
    appUrl: authEnv().appUrl,
  };
}
