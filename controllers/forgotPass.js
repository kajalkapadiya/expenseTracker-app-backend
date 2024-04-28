const nodemailer = require("nodemailer");
require("dotenv").config();

const forgotPass = (req, res) => {
  const { email } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "kajalkapadiya18@gmail.com",
      pass: process.env.API_KEY,
    },
  });

  const mailOption = {
    from: "kajalkapadiya18@gmail.com",
    to: email,
    subject: "Forgot pass link",
    text: "click here to change the pass",
  };

  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ message: "Failed to send email" });
    } else {
      console.log("email sent successfully", info.response);
      res.status(200).send({ message: "Email sent successfully" });
    }
  });
};

module.exports = {
  forgotPass,
};
