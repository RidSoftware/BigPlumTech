# BigPlumTech
Main repository for heriot-watt yr3 software engineering project

## Notes on working with git
work with git however you want, this is just a couple tips if you want. \
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
\
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
-Pull any updates from your team branch
-
-
