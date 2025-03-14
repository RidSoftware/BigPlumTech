const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  // Set up the transporter using secure SMTP credentials stored in environment variables
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, // e.g., 465 for SSL or 587 for TLS
    secure: process.env.SMTP_SECURE === 'true', // true for SSL, false for TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'support@bigplumtech.com', //test email
      subject: 'Contact Form Submission',
      text: message,
      html: `<p>${message}</p>`
    });
    res.status(200).json({ message: "Email sent successfully!", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error sending the email." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
