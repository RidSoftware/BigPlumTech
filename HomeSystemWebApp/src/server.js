const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 8080;


app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../frontEnd'))); // Serve static files from the frontend directory


// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "SmallPlum",
    password: "PlumPassword",
    database: "plumEnergyDatabase",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Node connected to MariaDB (its not a mariadb connection its mysql on this end)');
});

// Routes
app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.get('/api/data', (req, res) => {
    res.json({ message: "data fetch" });
});

app.post("/api/register", (req, res) => {
    const { firstname, surname, email, password, userType } = req.body;

    if (!firstname || !surname || !email || !password || !userType) {
        return res.status(400).json({ message: `All fields not received from post... ${firstname} ${surname} ${email} ${password} ${userType}` });
    }

    db.query('INSERT INTO userdetails (firstname, surname, email, password, userType) VALUES (?, ?, ?, ?, ?)', 
        [firstname, surname, email, password, userType], 
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error inserting user');
            } else {
                res.json({ message: "User registered successfully", results });
            }
        });
});



//test t
app.get('/users', (req, res) => {
    db.query('SELECT * FROM userdetails', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(results);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});