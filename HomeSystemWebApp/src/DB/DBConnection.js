var mysql = require('mysql');

//gonna create a connection to mysql db, unsure if this will be different for your guys
// will need to be standard in HomeSystemWebApp
var con = mysql.createConnection({
    host: "localhost",
    user: "user1",
    password: "password",
    // database: 'db_name',    idk what y'all call it
    // waitForConnections: true,
    // connectionLimit: 8,
});

con.connect(function(err) {
    if (err) throw err;
    console.log("DB connection established.");
});