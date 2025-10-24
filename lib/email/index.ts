import transporter from "./transporter";

interface SendEmailProps {
  type:
    | "reset-password"
    | "verify-email"
    | "delete-account"
    | "invite"
    | "accept-invite";
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ type, to, subject, text }: SendEmailProps) {
  const emailTemplate: Record<string, string> = {
    "reset-password": `
    <h1>You requested a password reset.</h1>
    <h2>${text}</h2>
    <p>If you did not request this, please ignore this email.</p>`,
    "verify-email": `
    <h1>Email verification.</h1>
    <h2>${text}</h2>
    <p>If you did not request this, please ignore this email.</p>`,
    "delete-account": `
    <h1>Delete your account</h1>
    <h2>${text}</h2>
    <p>If you did not request this, please ignore this email.</p>`,
    invite: `
    <h1>Invite</h1>
    <h2>${text}</h2>
    <p>If you did not request this, please ignore this email.</p>`,
    "accept-invite": `
    <h1>Accepted Invite</h1>
    <h2>${text}</h2>`,
  };

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_PASS,
      to,
      subject,
      html: emailTemplate[type],
    });
  } catch (error: any) {
    console.log(`Transporter error: ${error}`);
  }
}
