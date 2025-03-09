const express = require('express');
const router = express.Router();
const db = require('../config/DBConnection'); 
const e = require('express');

//////// REGISTRATION
router.post("/api/register", (req, res) => {
    const { firstname, lastname, email, password, userType } = req.body;

    if (!firstname || !lastname || !email || !password || !userType) {
        return res.status(400).json({ 
            success: false,
            message: `All fields not received from post... ${firstname} ${lastname} ${email} ${password} ${userType}` 
        });
    }

    const admin = userType === "homeManager" ? 'Y' : 'N';

    const q = 'INSERT INTO userdetails (firstname, surname, email, password, admin, homeid) VALUES (?, ?, ?, ?, ?, ?)'

	const homeid = 99;	//setting home id 99 as default for new users

    db.query( q, [firstname, lastname, email, password, admin, homeid], (err, results) => {
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
        db.query(q/*sends query*/, [email], async (err, results) => {
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


            const usertypeTranslation = results[0].Admin === 'Y' ? 'homeManager': 'homeUser';

            const trimmedResult = {
                firstname: results[0].FirstName,
                Surname: results[0].Surname,
                Email: results[0].Email,
                userType: usertypeTranslation
            }

      //      console.print

//			if (password != results[0].password) {
  //              return res.status(401).json({ success: false, message: "incorrect pword"});
    //        }
		


            // success
            res.status(201).json({ 
                success: true, 
                message: 'login succes', 
                user: trimmedResult
            });
        });
    } catch (error) {
        console.error('err from login:', error);
        res.status(500).json({ 
            success: false, 
        });
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
