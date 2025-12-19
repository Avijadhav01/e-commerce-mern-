import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};

export { sendEmail };
