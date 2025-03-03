const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',     
  user: 'root',
  password: '12qwasZX', 
  database: 'bigplum' 
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the bigplum database');
});

// Export connection for use in other files
module.exports = connection;