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
    html: `<h2>Hello ${name},</h2><p>Welcome to our app! We're super excited to have you. 🚀</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Welcome email sent to ${to}`);
};
