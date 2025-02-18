// BIG NOTE: once ive got reliable dataflow and have restructured directory strucure, I will add a .env file and show how to configure locally
// also will write a brief note on how i reccomend you add your work

const express = require('express');
//const db = require('./DB/DBConnection');
const cors = require("cors");

const mysql = require('mysql2');

const app = express();
	app.use(cors()); //requests will be blocked if this isnt included
	app.use(express.json());

const port = 8080;

app.get('/', (req,res) => {
    res.send('server up');
});

app.listen(port, () => {
    console.log(`Server running at http:${port}`);
});

app.use(express.static('frontEnd'));





////http call handling (will move this once were confortable)
// |||||||
// VVVVVVV


//basic example of get call
app.get('/api/data', (req, res) => {
    res.json({message: "data fetch"})
});

app.post("/api/register", (req, res) => {
    const {fullname, email, password, userType} = req.body;


    if (!fullname || !email || !password || !userType) {
        return res.status(400).json({message: `All fields not recieved from post...   ${fullname} ${email} ${password} ${userType}`});
    }


    console.log("Recived formData: ", req.body);




    res.json({message: "Registration recieved (not validated sql insertion)"});
});








//DB CONNECTION infile (will move once im confident with functionality)
//this is set for my(calum) mariadb installation
const db = mysql.createConnection({
    host: "localhost",
    user: "SmallPlum",
    password: "PlumPassword",
    database: "plumEnergyDatabase",
    port: 3306
});

//connect to mariadb
db.connect(err => {
	if (err) {
		console.error('Database connection failed: ', err);
		return;
	}
	console.log('Node connected to MariaDB!');
});

// FETCH USER EXAMPLE
app.get('/users', (req, res) => {
	db.query('SELECT * FROM userdetails', (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error fetching users');
		} else {
			res.json(results);
		}
	});
});




//test query on db
// app.get('/api/test', async (req, res) => {
    // try {
        // const [rows] = await db.query('SELEct * FROM alldevices');
        // res.json({ success: true, data: rows});
    // } catch (error) {
        // console.error('Database error on testquery:', error);
        // res.status(500).json({success: false, message: 'internally could resolve db query'});
    // }
// });

