import { transporter } from "../transporter";
import { getEventReminderEmailContent } from "../templates/eventReminderEmail";

export const sendEventReminderEmail = async (
  to: string,
  title: string,
  startTime: Date,
  location: string | undefined,
  minutesBefore: number
) => {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(startTime);

  const { subject, text, html } = getEventReminderEmailContent(
    title,
    formattedTime,
    location,
    minutesBefore
  );

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });

  console.log(`🔔 Reminder email sent to ${to} for "${title}"`);
};
