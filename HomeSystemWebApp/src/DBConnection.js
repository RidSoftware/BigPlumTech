var mysql = require('mysql');

//gonna create a connection to mysql db, unsure if this will be different for your guys
// will need to be standard in HomeSystemWebApp
var con = mysql.createConnection({
    host: "localhost",
    user: "username",
    password: "password"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("DB connection established.");
});