import { env } from "@appblocks/node-sdk";
import nodemailer from "nodemailer";

// Init enviroment
env.init();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.BB_AUTH_MAILER_HOST, // Replace with your SMTP server's host
  port: process.env.BB_AUTH_MAILER_PORT, // Replace with your SMTP server's port
  secure: false, // Set to true if using SSL
  auth: {
    user: process.env.BB_AUTH_MAILER_EMAIL, // Replace with your SMTP server's username
    pass: process.env.BB_AUTH_MAILER_PASSWORD, // Replace with your SMTP server's password
  },
});

// Send the email
export const sendMail = async (mailData) => {
  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
