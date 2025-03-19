const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
<<<<<<< HEAD
    user: "SmallPlum",//SmallPlum
    password: "PlumPassword",//PlumPassword
    database: "test2",//test2
=======
    user: "root",
    password: "plumPassword",
    database: "plumDB",
>>>>>>> 345d859ef39db884656d224da714c3b85bc763a1
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
