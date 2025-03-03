// index.js
const express = require('express');
const app = express();
const userroutes = require('./routes/userroutes');
const deviceroutes = require('./routes/deviceroutes');
const homeroutes = require('./routes/homeroutes');
const energygenerationroutes = require('./routes/energygenerationroutes');
const energyusageroutes = require('./routes/energyusageroutes');

app.use(express.json());

// Use the routes
app.use(userroutes);
app.use(deviceroutes);
app.use(homeroutes);
app.use(energygenerationroutes);
app.use(energyusageroutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});