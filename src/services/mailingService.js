import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.MAIL_SENDER, // Replace with your email
      pass: process.env.MAIL_PASS, // Replace with your email password
   },
});
class MailingService {
   static async sendPasswordResetEmail(email, hashedToken) {
      const resetLink = `http://localhost:8080/api/auth/reset-password/verify/${email}/${hashedToken}`;
      const mailOptions = {
         from: process.env.MAIL_SENDER, // Replace with your email
         to: email,
         subject: "Password Reset Request",
         html: `
         <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #3498db;">Password Reset Request</h2>
            <p style="font-size: 16px;">Hello!</p>
            <p style="font-size: 16px;">You can reset your password by clicking the link below.</p>
            <a href="${resetLink}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
            <p style="font-size: 14px; color: #777;">If you didn't request a password reset, you can ignore this email.</p>
            <p style="font-size: 14px; color: #777;">The link will expire in one hour.</p>
         </div>
      `,
      };
      try {
         await transporter.sendMail(mailOptions);
      } catch (error) {
         logger.error(`${error.stack}`);
      }
   }
}
export default MailingService;
