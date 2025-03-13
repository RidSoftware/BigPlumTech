const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "SmallPlum",
    password: "PlumPassword",
    database: "test2",
    port: 3306
});



db.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Node connected to DBConnection');
});

module.exports = db;
