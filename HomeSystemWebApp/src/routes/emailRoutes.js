const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/DBConnection'); 



router.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: `all fields not recieved`
        });

            
    }

})





module.exports = router;
