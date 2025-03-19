const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/DBConnection'); 
const e = require('express');



//////// REGISTRATION
router.post("/api/register", async (req, res) => {
    const { firstname, lastname, email, password, userType } = req.body;

    if (!firstname || !lastname || !email || !password || !userType) {
        return res.status(400).json({ 
            success: false,
            message: `All fields not received from post... ${firstname} ${lastname} ${email} ${password} ${userType}` 
        });
    }

    if (!firstname || !/^[A-Za-z-]+$/.test(input)) {
        return res.status(400).json({ 
            success: false,
            message: 'first name contains invalid symbols or spaces'
        });
    }

    if (!lastname || !/^[A-Za-z-]+$/.test(input)) {
        return res.status(400).json({ 
            success: false,
            message: 'first name contains invalid symbols or spaces'
        });
    }

    if (!email || !/^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/.test(input)) {
        return res.status(400).json({ 
            success: false,
            message: 'The email inputted was invalid'
        });
    }

    const admin = userType === "homeManager" ? 'Y' : 'N';

    const q = 'INSERT INTO userdetails (firstname, surname, email, password, admin, homeid) VALUES (?, ?, ?, ?, ?, ?)'

	const homeid = 99;	//setting home id 99 as default for new users

    //hashing password google said 10-12
    const hashPassword = await bcrypt.hash (password, 13);

                                            //change to hashpassword 
    db.query( q, [firstname, lastname, email, hashPassword, admin, homeid], (err, results) => {
                    if (err) {
                        console.error('DB error on inserting new user', err);
                        return res.status(500).json({ 
                            success: false,
                            message: `failed to register user in db` 
                        });
                    } 
                
                
                    res.status(201).json({
                        success: true,
                        message: 'user registration successful',
                    })
                }
            );
});
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
        db.query(q, [email], async (err, results) => {
            if (err) {
                console.error('db error selecting user', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'db err' 
                });
            }

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
        });
    } catch (error) {
        console.error('Error from login:', error);
        res.status(500).json({ success: false });
    }
});

/////////////////LOgin



////////////////test pull user info
router.get('/users', (req, res) => {
    db.query('SELECT * FROM userdetails', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(results);
        }
    });
});
//////////////////test pull user s..

module.exports = router;