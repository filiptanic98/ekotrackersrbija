import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendNotificationEmail(
  to: string,
  dumpId: string,
  weight: number,
  description: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@ekotracker.rs',
      to,
      subject: `Nova prijava deponije sa visokim prioritetom (${weight})`,
      html: `
        <h2>Nova prijava deponije</h2>
        <p><strong>ID:</strong> ${dumpId}</p>
        <p><strong>Prioritet:</strong> ${weight}</p>
        <p><strong>Opis:</strong> ${description}</p>
        <p>Ova prijava ima visok prioritet i zahteva hitnu pažnju.</p>
      `,
    });
    console.log(`Notification email sent to ${to} for dump ${dumpId}`);
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
}