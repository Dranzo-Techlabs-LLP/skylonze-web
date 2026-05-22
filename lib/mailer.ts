import nodemailer from "nodemailer";

const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  SMTP_FROM = "SKYLONZE <no-reply@skylonze.com>",
} = process.env;

const hasSmtp = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;
if (hasSmtp) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendMail(to: string, subject: string, html: string, text?: string) {
  if (!transporter) {
    // Dev fallback: no SMTP configured — log so the flow is testable.
    console.log(`\n[mailer] (no SMTP) would send to ${to}\n  subject: ${subject}\n  ${text ?? ""}\n`);
    return { delivered: false };
  }
  await transporter.sendMail({ from: SMTP_FROM, to, subject, html, text });
  return { delivered: true };
}

export function verificationEmail(name: string, link: string) {
  const subject = "Verify your SKYLONZE email";
  const text = `Welcome to SKYLONZE, ${name}!\n\nVerify your email to claim your 5,000 SKY-3030 and start forecasting:\n${link}\n\nLink expires in 24 hours. If you didn't sign up, ignore this email.`;
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;background:#06030F;color:#F5F0FF;padding:32px;border-radius:16px;max-width:520px;margin:auto">
    <h1 style="font-size:22px;margin:0 0 8px">Welcome to <span style="color:#A87BFF">SKYLONZE</span>, ${name}</h1>
    <p style="color:#CDBEEF;font-size:14px;line-height:1.6">
      Verify your email to claim your <b>5,000 SKY-3030</b> and start forecasting.
    </p>
    <p style="margin:24px 0">
      <a href="${link}" style="background:linear-gradient(90deg,#7C3AED,#FF7BD5);color:#fff;text-decoration:none;padding:12px 22px;border-radius:12px;font-weight:600;display:inline-block">Verify email</a>
    </p>
    <p style="color:#9885C7;font-size:12px">Or paste this link:<br><span style="color:#C5A6FF">${link}</span></p>
    <p style="color:#5B4D8A;font-size:12px;margin-top:24px">Link expires in 24 hours. If you didn't sign up, ignore this email.</p>
  </div>`;
  return { subject, text, html };
}
