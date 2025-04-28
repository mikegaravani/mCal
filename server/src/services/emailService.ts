import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (to: string, name: string) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: "Welcome to Our App!",
    text: `Hello ${name}, welcome to our app! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <h2 style="color: #4CAF50;">Hello ${name},</h2>
        <p>Welcome to mCal! We're super excited to have you. 🚀</p>
        <p style="margin-top: 30px;">Let's get started!</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Welcome email sent to ${to}`);
};
