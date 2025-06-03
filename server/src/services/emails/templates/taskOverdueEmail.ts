export const getTaskOverdueEmailContent = (
  title: string,
  formattedDeadline: string,
  daysOverdue: number
) => ({
  subject: `⚠️ Overdue: "${title}" was due ${daysOverdue} day(s) ago`,

  text: `Your task "${title}" was due on ${formattedDeadline} and is now ${daysOverdue} day(s) overdue. Please take action as soon as possible.`,

  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff3cd; color: #856404;">
      <h2 style="color: #dc3545;">⚠️ Overdue Task: "${title}"</h2>
      <p>Your task was due <strong>${daysOverdue} day(s) ago</strong>.</p>
      <p><strong>🗓️ Original deadline:</strong> ${formattedDeadline}</p>
      <p>Please take action as soon as possible to complete it.</p>
      <p style="margin-top: 30px; font-size: 0.9em; color: #6c757d;">This is an automated reminder from your calendar app.</p>
    </div>
  `,
});
