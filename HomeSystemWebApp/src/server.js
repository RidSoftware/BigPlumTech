const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../frontEnd'))); // gives access to parent file structures
//app.use(bodyParser.json());

// DB Connection
const db = require('./config/DBConnection');
const pool = require('./config/DBPool');


// const emailRoutes = require("./routes/emailRoutes");
const userRoutes = require('./routes/userRoutes');
const energyDataRoutesUA = require('./routes/energyDataRoutesUserArray');
const energyDataRoutesDA = require('./routes/energyDataRoutesDeviceArray');
const energyDataRoutesUI = require('./routes/energyDataRoutesUserInt');
const energyDataRoutesDI = require('./routes/energyGridRoute');
const energyGridRoute = require('./routes/energyDataRoutesDeviceInt');
const deviceDataRoutes = require('./routes/deviceDataRoutes');
// Routes
app.use(userRoutes);
app.use(energyDataRoutesUA);
app.use(energyDataRoutesDA);
app.use(energyDataRoutesUI);
app.use(energyDataRoutesDI);
app.use(deviceDataRoutes);
app.use(energyGridRoute);

const emailRoutes = require("./routes/emailRoutes");
app.use("/api", emailRoutes); 

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.get('/api/data', (req, res) => {
    res.json({ message: "data fetch" });
});


//energy service start
const energyService = require('./Services/LiveEnergy');
// Start the server
app.listen(port, () => {
    energyService.start();
    console.log(`Server running at http://localhost:${port}`);
});