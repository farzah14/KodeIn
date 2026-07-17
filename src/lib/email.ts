import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const appUrl = process.env.AUTH_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verificationUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

  // Log to console in development or if API key is missing
  if (process.env.NODE_ENV === "development" || !resend) {
    console.log("\n==================================================");
    console.log("💌 [VERIFIKASI EMAIL KODEIN]");
    console.log(`Untuk: ${email}`);
    console.log(`Link: ${verificationUrl}`);
    console.log("==================================================\n");
  }

  if (!resend) {
    // Return true in development since logging to console is our "sending" mechanism
    return true;
  }

  try {
    const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
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
      console.error("Resend API error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return false;
  }
}
