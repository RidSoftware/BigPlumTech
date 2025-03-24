const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: "localhost",
    user: "SmallPlum",
    password: "PlumPassword",
    database: "test2",
    waitForConnections: true,
    connectionLimit: 10,  // Limit the number of active connections
    queueLimit: 0
});


console.log("made pool connection");

module.exports = pool;
