const express = require('express');
const router = express.Router();
const db = require('../config/DBConnection'); 
const e = require('express');


////////////////pull 24hr of data to user
router.post('/api/pull24hr', async (req, res) => {
    const email = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'no email recieved by route' 
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
                    message: 'no data found in db from query' 
                });
            }




            // const energydataprocessed[23] = {
            //     hour: 
            // }

		


            // success
            res.status(201).json({ 
                success: true, 
                message: 'datapull success', 
                user: energydataprocessed
            });
        });
    } catch (error) {
        console.error('err from fetch24:', error);
        res.status(500).json({ 
            success: false, 
        });
    }
});
/////////////////pull 24hrs



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

module.exports = router;
