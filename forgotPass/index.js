// const SibApiV3Sdk = require("@getbrevo/brevo");

// let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// let apiKey = apiInstance.authentications["apiKey"];
// apiKey.apiKey =
//   "xsmtpsib-4b84dd2608d0767cd300ba898bca4948b93df3f2bc2db2aeb590b9544b94a39f-GUfrm9ODkhaYHcsF";

// let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// sendSmtpEmail.subject = "My {{params.subject}}";
// sendSmtpEmail.htmlContent =
//   "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
// sendSmtpEmail.sender = { name: "John Doe", email: "kajalkapadiya18@gmail.com" };
// sendSmtpEmail.to = [{ email: "kajalkapadiya18@gmail.com", name: "Jane Doe" }];
// sendSmtpEmail.cc = [{ email: "kajalkapadiya18@gmail.com", name: "Janice Doe" }];
// sendSmtpEmail.bcc = [{ name: "John Doe", email: "kajalkapadiya18@gmail.com" }];
// sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
// sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
// sendSmtpEmail.params = { parameter: "My param value", subject: "New Subject" };

// apiInstance.sendTransacEmail(sendSmtpEmail).then(
//   function (data) {
//     console.log(
//       "API called successfully. Returned data: " + JSON.stringify(data)
//     );
//   },
//   function (error) {
//     console.error(error);
//   }
// );

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "kajalkapadiya18@gmail.com",
    pass: "xsmtpsib-4b84dd2608d0767cd300ba898bca4948b93df3f2bc2db2aeb590b9544b94a39f-GUfrm9ODkhaYHcsF",
  },
});

const mailOption = {
  from: "kajalkapadiya18@gmail.com",
  to: "kajalkapadiya18@gmail.com",
  subject: "Forgot pass link",
  text: "click here to change the pass",
};

transporter.sendMail(mailOption, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("email sent successfully", info.response);
  }
});
