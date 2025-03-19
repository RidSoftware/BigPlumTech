const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "IONOS",
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables for security
        pass: process.env.EMAIL_PASS,
    },
});


async function sendContactEmail(name, email, message) {
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, 
        subject: `New Contact Message from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail };
