# Production folder
---
This directory is the bulk of our system. Please familiarize yourselves with it. 

The `BigPlumTech/Database-DevFolder/` will hold important information about our DB model and its behaviour. If you haven't set up a DB on your machine then please have a look at the readme over there.

And similarly if you wanna refamiliar with git have a look at the readme in `BigPlumTech/`. 

# CURRENT STATE
---
##### So... here is a rough outline of our system.

#### FrontEnd
`./frontEnd/Pages/` 
--`Assets/` 
----`Assets/JS/` contains scripts for front end functions and functions that make calls to the db-via-server
----`Assets/CSS/`	contains css
--`HTML/` contains, *suprisingly*, html files


#### BackEnd
`./src`
│── `config/` Configuration files (DBConnection, environment settings [*not implemented env stuff yet*])
│── `node_modules/` NodeJS dependencies (auto made by npm)
│── `routes/`  handles api's (handles http requests)
│── `package.json` this tracks dependancies of the npm project and puts it in a json
│── `package-lock.json` tied to package.json not sure how tbh
│── `server.js` this is our main server: `node server.js` starts the server.

**Note on server.js:**
This is set to run on port 8080 (eg. localhost:8080/Pages/HTML/index.html in browser).

#### DataBase
	DB connection is handled by config/DBConnection.js

	Please lookup readme in BigPlumTech/Database-DevFolder/
	 		
---
 Calum

---
