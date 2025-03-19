const express = require('express');
const router = express.Router();
const emailService = require("../Services/emailService");



router.post("/api/contact", async (req, res) => {
    console.log("request body: ", req.body);
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: `all fields not recieved`
        });
    }

    try {
        const emailResponse = await emailService.sendContactEmail(name, email, message);
        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!",
            emailResponse
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send the message. Please try again later.",
        });
    }
});




module.exports = router;
