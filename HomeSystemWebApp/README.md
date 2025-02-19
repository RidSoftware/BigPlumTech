# Production folder
---
Do whatever the hell you want in the DevFolders, \
but please be more reserved with pushing stuff in here, this will be or production version. \

# CURRENT STATE
---
So, what we have here is a rough draft of our system.

-FrontEnd-
./frontEnd/ 
	H/	contains html files that ive got working full stack (Registration.html mainly [though the server doesnt actually insert data yet])
	A/	assets
		J/	contains scripts for front end functions
		C/	contains css

	HTML/	the files in here i havent yet integrated (mainly need to fix hrefs and srcs)
	Assets/	same here, i havent looked at most of this

-BackEnd-
./src/
	server.js	i configured to run on localhost:8080/ (localhost:8080/Registration.html)
			
		localhost:8080/users should display the user table from the db on the server machine
		
		/api/register post is an example of calling a function
		
		yet to construct a complete *model* function, probably use register as an example
		
		if you guys are trying to get this working on your machine, you may need to configure db connection and npm install necessary packets		
		
		I have to work on other courses, so Ill leave it in this state for now, lmk if you need anything

-DataBase-
	atm db connection is handled by monolithic server.js file, will change later
	install mariadb, configure it and run server.js		

---
## A note on the structure
I've implemented a semi-formal file structure that you have probably seen before. \

In the root folder `/BigPlumTech` we should probably put any admin files/documentaion. \

DevFolders `/BigPlumTech/***-DevFolder` respective teams can do whatever with, get busy. \

Inside the `/HomeSystemWebApp`, \
 
	- `package.json` - dependancy for json
	- **may put in a gitignore to avoid inclusion of too many dependancies if it gets annoying**
	- `/node_modules` - holds nodeJS dependacies (standard library, express, etc.)
	- `/frontEnd` - should probably rename this to something like public or static, but obv it holds all the front end
	- `/src` - contains the backend and likely some database stuff aswell once that's established \
			will add further documentation once I've fleshed it out more
-calum
	
