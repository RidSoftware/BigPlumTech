const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    host: "smtp.ionos.co.uk",  // Explicitly define the host
    port: 587,               // Use 587 for TLS, or 465 for SSL
    secure: false,           // True for port 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
    tls: {
        rejectUnauthorized: false, // Prevent self-signed certificate issues
    },
});


async function sendContactEmail(name, email, message) {
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // ✅ Always send from the authenticated email
        replyTo: email, // ✅ Allows recipient to reply to the sender
        to: process.env.EMAIL_USER, // ✅ Send to your own email for testing
        subject: `New Contact Message from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

module.exports = { sendContactEmail };
