# BigPlumTech
Main repository for heriot-watt yr3 software engineering project
(will add installation/configuration instructions for you guys when i get the time)

## Notes on working with git
work with git however you want, this is just a couple tips if you want. \
I use Linux CLI for git, so this may not be entirely relevent for you all, but should work in any shell.
Also is a general guide for best practices.
### If you haven't already, send your username to the teams meassage and I'll give you access!!! ###
Firstly, make sure that you have set up an SSH key for your profile, this is a bit annoying but spend a bit of time and you'll get it working.
If not gimme a shout, I'll try and keep ontop of git for y'all *-Calum*

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
2. 🌿 **Working with Branches** (i got emojis, they're sick)
Before you start doing gods work, have a quick look at how branches work. \
`git checkout <branch name>` is the standard cmd for swapping to a branch. \
`git checkout -b <branch name>` is the same but it will create a new branch if one does not yet exist. \
\
You should create a new branch whenever you intend to do any work. \
I propose that we only permit commits to main and merging of major branches when we have a team meeting. \
\
I have created a couple branches that we can use to organise us a bit:
	- main (we don't mess with this)
	- FrontEnd
	- BackEnd
	- Database


---
3. 🔄 **Keeping up-to-date**
Whenever we are doing work we want to be up-to-date with our teams, \
**BEFORE** you start working or **PUSHING CHANGES** you **gotta**:
	- Pull any updates from your team branch: `git pull origin <branch name>`
	- Get to work

---
4. 🛠  **Doing work**
So you've made a branch to do some stuff, and you think you've made enough progress to commit and push. \
👏👏👏👏 \
You now gotta do this without breaking everything. GL. \

OK, you wanna make sure you are on the intended branch still, some useful commands to see where you are at are: `git branch -a` and `git status` \
Then you wanna `git add <file name>` or `git add .` to stage, `git commit -m "add a commit message describing what you are pushing"`, \
Once you are ready to push `git push origin <branch name>` \
** Do Not  `git push`, this pushes to the default branch (probably main)... bad** 

---
5. **Deleting Branches**
Once you have merged a branch and are confident it worked the way you wanted, delete it: \
`git branch -d <branch name>` this deletes the branch locally. \
However, if you are gonna delete a branch remotely from the repo `git push origin --delete <branch name>` 

---
6. **Integrating**
The main branch should be viewed as our baby, everything we do should be in service of main. \
Never commit directly to main pls \
Periodically our teams should be integrating with main and you should always have an updated main locally: \
	- When you sit down and intend to work, `git pull origin main`: this means that your local version of main is up to date, even when you aren't working with main you wanna know that you got your baby safe (good practice i think)
	- Then you can `git pull origin <working branch>`, and do your specific work
	- Pushing changes to your feature branch `git push origin <feature branch>`
	- If you wann add your changes to the branch *above* the one you've worked, then you should create a pull request 

---
7. **Pull requests/Merging**
You can't do this in a CLI, it's not a git thing, its a GitHub thing. \
Thus, you go to https://github.com/RidSoftware/BigPlumTech, then 'Pull requests' above the code, 'New pull request'. \
**Base & Compare** 
Think of the base branch as the one that is getting updated by the compare branch. \
If base is empty and compare has 3 files, then the merge will add the 3 files to the base branch. \
If you make pull requests, please seek affirmation from other members of the group before comfirming them, it could do damage. 


---
**TLDR**
	- Commit often
	- Pull before pushing
	- Review before commiting
	- Don't write unclear messages

tbh I mainly did this to clarify my own knowledge, but i hope its useful. 
