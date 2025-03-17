const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",//SmallPlum
    password: "12qwasZX",//PlumPassword
    database: "bigplum",//test2
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
