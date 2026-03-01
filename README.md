# BigPlumTech ⚡

![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-lightblue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2025-yellow)
![Framework](https://img.shields.io/badge/Framework-NodeJS-orange)
![Framework](https://img.shields.io/badge/Framework-ExpressJS-red)
![Security](https://img.shields.io/badge/Security%20&%20Validation-BCrypt-blue)
![Database](https://img.shields.io/badge/Database-MariaDB-green)

This is a [RESTful Webserver](https://www.codecademy.com/article/what-is-rest), built with Node.js and Express, using MariaDB as a back-end relational database. It provides APIs for web users to track their smart device usage and monitor energy statistics.

# Technology Stack
- *Backend:* NodeJS, ExpressJS
- *Database:* MariaDB
- *Authentication/Security:* BCrypt, Express-Validator,...

# Installation Requirements
You must have the following installed:
- [NodeJS](https://nodejs.org/en/download)
- [MariaDB](https://mariadb.com/downloads/) **or any GUI tool for the management of databases, such mySQLWorkbench**

# Setting up your version to work
1️⃣ Clone the Repository
`git clone git@github.com:RidSoftware/BigPlumTech.git` you need an ssh key on your machine with github knowing its public key
`cd BigPlumTech`

2️⃣ Install Dependencies
`cd HomeSystemWebApp/src`
`npm uninstall bcrypt` *will likely not work unless you reconfigure bcrypt for your system*
`npm uninstall bcrypt`
`npm install` **shouldn't be necessary, but no harm**

3️⃣ Reconfigure DB connection
go to readme in `Database-DevFolder` if you havent already **must also od this in DBPool**
go to `HomeSystemWebApp/src/config/DBConnection.js`
edit `const db = mysql.createConnection({
    host: "localhost",
    user: "SmallPlum", //change may be root for some
    password: "PlumPassword",//change
    database: "plumEnergyDatabase",//change
    port: 3306 //probably dont need to change
});`
to the user, password and database name relevant to your installation and user details for your db. \
NOTE:
Newer vesions may also use a DBPool.js file to get a different kinds of db connection, you will have to update this file configuration as well

4️⃣ Run the server
`node HomeSystemWebApp/src/server.js`

## GIT Guidance
1. `git clone git@github.com:RidSoftware/BigPlumTech.git`
2. `git checkout -b newBranch`
3. `git add .`
4. `git commit -m "added stuff"`
5. `git push origin newBranch`

---
1. **Clone the Repo**
I recommend that you clone the repository initially with SSH. \
This requires that you have a working SSH auth key on your github account, this is in: \ 
Settings/Access/SSH and GPG keys \
if you need to then press 'New SSH key' in the top right of https://github.com/settings/keys, \
give it a title for your device and paste the public key (should be in a file called [keyname].pub). \
\
Then, in the terminal of the directory that you wanna do your work locally (not nestes in another git repo, its annoying) clone the repository with the following command: \
`git clone git@github.com:RidSoftware/BigPlumTech.git` \
There should now be an clone of the repo on your machine that is set up with your ssh key (therefore no passwords thankfully because remote git passwords are black magic to me). \
Now navigate to the folder of the team you intend to work on. \

---
2. 🌿 **Working with Branches** \
Here is how branches work and were used in development. \
`git checkout <branch name>` is the standard cmd for swapping to a branch. \
`git checkout -b <branch name>` is the same but it will create a new branch if one does not yet exist. \
\
New branches were created whenever any new work was scheduled, preventing major version control problems. \
The merging of branches to the main branch only occured during scheduled meetings. \
\
The following branches were made to organise work:
	- main (we don't mess with this)
	- FrontEnd
	- BackEnd
	- Database


---
3. 🔄 **Keeping up-to-date**
Whenever we are doing work we want to be up-to-date with our teams, \
**BEFORE** you start working or **PUSHING CHANGES** you **must**:
	- Pull any updates from your team branch: `git pull origin <branch name>`

---
4. 🛠  **Doing work**
OK, you wanna make sure you are on the intended branch still, some useful commands to see where you are at are: `git branch -a` and `git status` \
Then you wanna `git add <file name>` or `git add .` to stage, `git commit -m "add a commit message describing what you are pushing"`, \
Once you are ready to push `git push origin <branch name>` \
** Do Not  `git push`, this pushes to the default branch (probably main)... bad** 

---
5. **Deleting Branches**
Once you have merged a branch and are confident it worked the way you wanted, delete it: \
`git branch -d <branch name>` this deletes the branch locally. \
However, if you are going to delete a branch remotely from the repo `git push origin --delete <branch name>` 

---
6. **Integrating**
Never commit or integrate directly to the main branch. \
Periodically our teams should be integrating with main and you should always have an updated main locally: \
	- When you sit down and intend to work, `git pull origin main`: this means that your local version of main is up to date.
	- Then you can `git pull origin <working branch>`, and do your specific work.
	- Pushing changes to your feature branch `git push origin <feature branch>`.
	- If you wann add your changes to the branch *above* the one you've worked, then you should create a pull request.

---
7. **Pull requests/Merging**
You can't do this in a CLI, it's not a git thing, its a GitHub thing. \
Thus, you go to https://github.com/RidSoftware/BigPlumTech, then 'Pull requests' above the code, 'New pull request'. \
**Base & Compare** 
Think of the base branch as the one that is getting updated by the compare branch. \
If base is empty and compare has 3 files, then the merge will add the 3 files to the base branch. \
If you make pull requests, please seek affirmation from other members of the group before comfirming them, it could do damage. 
