const express = require('express');
const db = require('./DB/DBConnection');

const app = express();
const port = 8080;

app.get('/', (req,res) => {
    res.send('server up');
});

app.listen(port, () => {
    console.log(`Server running at http:${port}`);
});

app.use(express.static('frontEnd'));





////http call handling (will move this once were confortable)
// |||||||
// VVVVVVV


//basic example of get call
app.get('/api/data', (req, res) => {
    res.json({message: "data fetch"})
});


//test query on db
app.get('/api/test', async (req, res) => {
    try {  
        const [rows] = await db.query('SELEct * FROM alldevices');
        res.json({ success: true, data: rows});
    } catch (error) {
        console.error('Database error on testquery:', error);
        res.status(500).json({success: false, message: 'internally could resolve db query'});
    }
});

