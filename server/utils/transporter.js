import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  // host: "sv3.tmail.vn",
  // port: 587,
  secure: true, // use TLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
