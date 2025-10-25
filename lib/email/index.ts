import transporter from "./transporter";

interface SendEmailProps {
  html: string;
  to: string;
  subject: string;
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_PASS,
      to,
      subject,
      html,
    });
  } catch (error: any) {
    console.log(`Transporter error: ${error}`);
  }
}
