# Production folder
---
Do whatever the hell you want in the DevFolders, \
but please be more reserved with pushing stuff in here, this will be or production version. \

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
	
