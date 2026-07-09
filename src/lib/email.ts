import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "LandingWork <onboarding@resend.dev>";

/**
 * Send a verification code email to the user.
 */
export async function sendVerificationEmail(
  to: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${code} is your LandingWork verification code`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #10b981; margin-bottom: 8px;">LandingWork</h2>
          <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">
            Here's your verification code:
          </p>
          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This code expires in 10 minutes. If you didn't request this, ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">
            LandingWork — The simplest screenshot API for developers.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: "Failed to send email" };
  }
}
