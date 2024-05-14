const nodemailer = require("nodemailer");
const uuid = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Forgotpassword = require("../models/ForgotPasswordRequests");
require("dotenv").config();

const forgotPass = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  const id = uuid.v4();

  if (user) {
    user.createForgotpassword({ id, active: true }).catch((err) => {
      throw new Error(err);
    });
  }

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
    html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
  };

  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "Failed to send reset instructions. Please try again later.",
      });
    } else {
      console.log("email sent successfully", info.response);
      res
        .status(200)
        .json({ message: "Password reset instructions sent to your email." });
    }
  });
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>

                                  <form action="/password/updatepassword/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button>reset password</button>
                                  </form>
                              </html>`);
      res.end();
    }
  });
};

const updatepassword = async (req, res) => {
  console.log("req", req.params);
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    // Find the forgot password request
    const resetpasswordrequest = await Forgotpassword.findOne({
      where: { id: resetpasswordid },
    });

    // Check if the reset password request exists
    if (!resetpasswordrequest) {
      return res
        .status(404)
        .json({ error: "Reset password request not found" });
    }

    // Find the associated user
    const user = await User.findByPk(resetpasswordrequest.UserId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await user.update({ password: hashedPassword });

    // Send success response
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  forgotPass,
  resetpassword,
  updatepassword,
};
