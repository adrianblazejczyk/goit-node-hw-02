const nodemailer = require("nodemailer");

const config = {
  host: "smtp.sendgrid.net",
  port: 587,
  //   secure: true,
  auth: {
    user: "apikey",
    pass: process.env.API_KEY,
  },
};

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: "adrianblazejczyk@gmail.com",
    to: email,
    subject: "Potwierdzenie rejestracji",
    html: `
      <p>Witaj!</p>
      <p>Aby dokończyć rejestrację, kliknij poniższy link:</p>
      <a href="http://localhost:3000/api/users/verify/${verificationToken}">Potwierdź rejestrację</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendVerificationEmail };
