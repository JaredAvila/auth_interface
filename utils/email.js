const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1) create transported
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // activate in gmail, "less secure app" option
  });

  // 2) define the email options
  const mailOptions = {
    from: "Jared Avila <jared@mail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  // 3) actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
