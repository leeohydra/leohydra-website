import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not configured");
}

export async function sendEmail(params: {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email service not configured");
  }

  const { error } = await resend.emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    text: params.text,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }
}
