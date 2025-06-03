import { transporter } from "../transporter";
import { getTaskOverdueEmailContent } from "../templates/taskOverdueEmail";

export const sendTaskOverdueEmail = async (
  to: string,
  title: string,
  deadline: Date,
  daysOverdue: number
) => {
  const formattedDeadline = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(deadline);

  const { subject, text, html } = getTaskOverdueEmailContent(
    title,
    formattedDeadline,
    daysOverdue
  );

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });

  console.log(`⚠️ Overdue task email sent to ${to} for "${title}"`);
};
