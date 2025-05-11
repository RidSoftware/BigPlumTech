const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//const db = require('../config/DBConnection'); 
const { body, validationResult } = require("express-validator");
const validator = require("validator");
const pool = require('../config/DBPool');


//////// REGISTRATION
router.post("/api/register",
    [
      // Validation and Sanitization
      body("firstname").trim().escape().notEmpty().withMessage("First name is required"),
      body("lastname").trim().escape().notEmpty().withMessage("Last name is required"),
      body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email format"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .customSanitizer((value) => validator.escape(value)), // Prevents script injection in password
      body("userType").trim().escape().notEmpty().withMessage("User type is required"),
    ],
    
    async (req, res) => {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
  
      let { firstname, lastname, email, password, userType } = req.body;
  
      // Additional sanitization using validator library
      firstname = validator.escape(firstname);
      lastname = validator.escape(lastname);
      email = validator.normalizeEmail(email);
      userType = validator.escape(userType);
  
      const admin = userType === "homeManager" ? "Y" : "N";
      const homeid = 99; // Default home ID
  
      try {
        const hashPassword = await bcrypt.hash(password, 13);
  
        const q = "INSERT INTO userdetails (firstname, surname, email, password, admin, homeid) VALUES (?, ?, ?, ?, ?, ?)";
  
        console.log("About to execute SQL query...");

        await pool.execute(q, [firstname, lastname, email, hashPassword, admin, homeid]);
          
        console.log("Query executed successfully");
        // db.query(q, [firstname, lastname, email, hashPassword, admin, homeid], (err, results) => {
        //   if (err) {
        //     console.error("DB error on inserting new user", err);
        //     return res.status(500).json({ success: false, message: "Failed to register user in DB" });
        //   }
  
          res.status(201).json({
            success: true,
            message: "User registration successful",
          });
        
      } catch (error) {
        console.error("Error in password hashing", error);
        res.status(500).json({ success: false, message: "Server error, try again later" });
      }
    }
  );
//////////////////END REGISTRATION

////////////////LOGON
router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'didnt fill form properly' 
        });
    }

    try {
        const q = 'SELECT * FROM userdetails WHERE email = ?';
        const [results] = await pool.execute(q, [email]);


            if (results.length === 0) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'no email registered, invalid email' 
                });
            }

            console.log("User Found: ", results[0]);

            //Check what is actually returned in results[0].Password
            const hashedPassword = results[0].Password;
            console.log("Entered Password:", password);
            console.log("Hashed Password from DB:", hashedPassword);

            if (!hashedPassword) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Password field is empty in database' 
                });
            }

            //Compare entered password with hashed password
            const samePassword = await bcrypt.compare(password, hashedPassword);

            if (!samePassword) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password"
                });
            }

            // Success
            res.status(201).json({ 
                success: true, 
                message: 'Login successful!', 
                user: {
                    userID: results[0].UserID,
                    firstname: results[0].FirstName,
                    Surname: results[0].Surname,
                    Email: results[0].Email,
                    userType: results[0].Admin === 'Y' ? 'homeManager' : 'homeUser',
                    isLoggedIn: true,
                    homeID: results[0].HomeID
                }
            });
        
    } catch (error) {
        console.error('Error from login:', error);
        res.status(500).json({ success: false });
    }
});

/////////////////LOgin







/////////
router.post("/api/updateUser", async (req, res) => {
    const { userID, firstname, surname, email } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: "UserID is required" });
    }

    try {
        // Check if the user exists
        const checkQuery = "SELECT * FROM userdetails WHERE userID = ?";
        const [results] = await pool.execute(checkQuery,[userID]);

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // If user exists, proceed with update
            const updateQuery = "UPDATE userdetails SET firstname = ?, surname = ?, email = ? WHERE userID = ?";
            await pool.execute(updateQuery, [firstname,surname, email, userID])

                res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                });
            
        
    } catch (error) {
        console.error("Error in updating user", error);
        res.status(500).json({ success: false, message: "Server error, try again later" });
    }
});

//////////




////////////////test pull user info
router.get('/users', (req, res) => {
    //removed, as couldnt be bothered
});
//////////////////test pull user s..

module.exports = router;
