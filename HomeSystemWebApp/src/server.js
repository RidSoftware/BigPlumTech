const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 8080;


app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../frontEnd'))); // gives access to parent file structures


// DB Connection
const db = require('./config/DBConnection');
const pool = require('./config/DBPool');

const userRoutes = require('./routes/userRoutes');
const energyDataRoutes = require('./routes/energyDataRoutes');
// Routes
app.use(userRoutes);
app.use(energyDataRoutes);

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.get('/api/data', (req, res) => {
    res.json({ message: "data fetch" });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});