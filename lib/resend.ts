import { Resend } from 'resend';

const resendSecret = process.env.RESEND_API_KEY;

export const resend = resendSecret ? new Resend(resendSecret) : null;

export async function sendWelcomeEmail(email: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY not found. Skipping email.");
    return;
  }

  try {
    await resend.emails.send({
      from: 'Uprising Anarchy <changelog@uprising.anarchy>',
      to: email,
      subject: 'Welcome to the Uprising Changelog ⚡',
      html: `<p>You've successfully subscribed to the Uprising Anarchy changelog. Get ready for real-time updates on the evolution of the Agency OS.</p>`,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}
