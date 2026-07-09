import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || "SnapForge <hello@aibro.vip>";

export async function sendVerificationEmail(to: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM, to,
      subject: `${code} is your SnapForge verification code`,
      html: `<div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:40px 20px;">
        <h2 style="color:#10b981;">SnapForge</h2>
        <p>Your verification code:</p>
        <div style="background:#f1f5f9;border-radius:8px;padding:20px;text-align:center;margin:24px 0;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:6px;">${code}</span>
        </div>
        <p style="color:#64748b;font-size:14px;">Expires in 10 minutes.</p>
      </div>`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Send failed" };
  }
}
