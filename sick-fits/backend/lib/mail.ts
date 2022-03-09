import { createTransport } from "nodemailer";

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function passwordResetEmailBody(token: string) {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <p>Your password reset link is here, sir:</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/reset?token=${token}">Go to page</a>
      </p>
      <p>Greetings, Foobar</p>
    </div>
  `;
}

export async function sendPasswordResetEmail({
  resetToken,
  to,
}: {
  resetToken: string;
  to: string;
}) {
  transport.sendMail({
    to,
    from: process.env.MAIL_USER,
    subject: "Your password reset token, sir!",
    html: passwordResetEmailBody(resetToken),
  });
}
