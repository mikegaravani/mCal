export const getWelcomeEmailContent = (name: string) => ({
  subject: "Welcome to Our App!",
  text: `Hello ${name}, welcome to our app! 🎉`,
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #4CAF50;">Hello ${name},</h2>
      <p>Welcome to mCal! We're super excited to have you. 🚀</p>
      <p style="margin-top: 30px;">Let's get started!</p>
    </div>
  `,
});
