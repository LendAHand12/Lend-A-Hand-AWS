import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  // host: "smtpout.secureserver.net", GODADDY
  // port: 465,
  // secure: true, // use TLS

  // host: "sv3.tmail.vn", AMERITEC
  // port: 587,
  // secure: false,

  // host: "mail92211.maychuemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
