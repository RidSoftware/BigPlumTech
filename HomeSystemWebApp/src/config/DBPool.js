const mysql = require('mysql2');


const pool = mysql.createPool({
    host: "localhost",
    user: "SmallPlum",
    password: "PlumPassword",
    database: "plumEnergyDatabase",
    waitForConnections: true,
    connectionLimit: 100,  // Limit the number of active connections
    queueLimit: 0
});



db.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Node connected to DB');
});

module.exports = pool;
