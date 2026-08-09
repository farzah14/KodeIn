import { Resend } from "resend";
import { emailEnv } from "@/server/env";

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

  let apiKey: string | undefined = process.env.RESEND_API_KEY;
  let fromEmail: string = process.env.EMAIL_FROM || "onboarding@resend.dev";
  let appUrl: string = process.env.AUTH_URL || "http://localhost:3000";

  if (!isDev) {
    // In production, enforce validated environment variables
    const env = emailEnv();
    apiKey = env.apiKey;
    fromEmail = env.from;
    appUrl = env.appUrl;
  }

  const verificationUrl = `${appUrl.replace(/\/$/, "")}/api/auth/verify-email?token=${token}`;

  // Log in development/testing
  if (isDev) {
    console.log("\n==================================================");
    console.log("💌 [VERIFIKASI EMAIL KODEIN]");
    console.log(`Untuk: ${email}`);
    console.log(`Link: ${verificationUrl}`);
    console.log("==================================================\n");

    if (!apiKey) {
      // In development/test without api key, logging to console is our success mechanism
      return true;
    }
  }

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `KodeIn <${fromEmail}>`,
    to: email,
    subject: "Verifikasi Email Akun KodeIn Anda",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #6366f1; margin-bottom: 24px;">Selamat datang di KodeIn!</h2>
        <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda dan mengaktifkan akun Anda:</p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verifikasi Email</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin dan menempelkan link berikut ke browser Anda:</p>
        <p style="color: #6366f1; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Jika Anda tidak membuat akun ini, Anda dapat mengabaikan email ini dengan aman.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend email sending failed: ${error.message}`);
  }

  return true;
}

export async function sendPasswordResetEmail(
  email: string,
  name: string | null | undefined,
  token: string
): Promise<boolean> {
  const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

  let apiKey: string | undefined = process.env.RESEND_API_KEY;
  let fromEmail: string = process.env.EMAIL_FROM || "onboarding@resend.dev";
  let appUrl: string = process.env.AUTH_URL || "http://localhost:3000";

  if (!isDev) {
    // In production, enforce validated environment variables
    const env = emailEnv();
    apiKey = env.apiKey;
    fromEmail = env.from;
    appUrl = env.appUrl;
  }

  const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password?token=${token}`;

  // Log in development/testing
  if (isDev) {
    console.log("\n==================================================");
    console.log("🔑 [RESET KATA SANDI KODEIN]");
    console.log(`Untuk: ${email}`);
    console.log(`Link: ${resetUrl}`);
    console.log("==================================================\n");

    if (!apiKey) {
      // In development/test without api key, logging to console is our success mechanism
      return true;
    }
  }

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `KodeIn <${fromEmail}>`,
    to: email,
    subject: "Atur Ulang Kata Sandi Akun KodeIn Anda",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #6366f1; margin-bottom: 24px;">Atur Ulang Kata Sandi</h2>
        <p>Halo${name ? ` ${name}` : ""},</p>
        <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun KodeIn Anda. Silakan klik tombol di bawah ini dalam 1 jam ke depan:</p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Atur Ulang Kata Sandi</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin dan menempelkan link berikut ke browser Anda:</p>
        <p style="color: #6366f1; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Jika Anda tidak meminta pengaturan ulang kata sandi, Anda dapat mengabaikan email ini dengan aman.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend email sending failed: ${error.message}`);
  }

  return true;
}
