import nodemailer from "nodemailer";
import config from "../../../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      user: "syedalamin2580@gmail.com",
      pass: "warv uxlq wtqd phif",
    },
  });

  await transporter.sendMail({
    from: "syedalamin2580@gmail.com",
    to,
    subject: "Reset your password within ten mins!",
    text: "",
    html,
  });
};
