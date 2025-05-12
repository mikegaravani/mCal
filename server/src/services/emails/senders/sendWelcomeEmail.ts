import { transporter } from "../transporter";
import { getWelcomeEmailContent } from "../templates/welcomeEmail";

export const sendWelcomeEmail = async (to: string, name: string) => {
  const { subject, text, html } = getWelcomeEmailContent(name);

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });

  console.log(`Welcome email sent to ${to} lol`);
};
