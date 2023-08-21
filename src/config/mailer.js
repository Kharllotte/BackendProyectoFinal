import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_TOKEN,
  },
});

export default transporter;
