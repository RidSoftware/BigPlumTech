const express = require('express');
const router = express.Router();
const db = require('../config/DBConnection'); 
const e = require('express');


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
                userType: usertypeTranslation,
                isLoggedIn: true
            }


			if (password !== results[0].Password) {
                return res.status(401).json({ success: false, message: "incorrect pword", debug: trimmedResult});
            }
		


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



////////////////test energy data pull
router.get('/energy', (req, res) => {
    db.query('SELECT * FROM energyHourly'/*will need updated to new table name*/, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching energydata');
        } else {
            res.json(results);
        }
    });
});
//////////////////test energy data pull

module.exports = energyRouter;
