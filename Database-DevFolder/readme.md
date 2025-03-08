## <ins>__Installation Instructions__</ins>

__1.__ Install MariaDB version 11.4.5 [here](https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.7.2&os=windows&cpu=x86_64&pkg=msi&mirror=xtom_ams). </br>
__2.__ Keep the default installation configuration, however, set-up a root user password. </br>
__3.__ To ensure that MariaDB is installed, enter the command terminal (for windows search mariadb in your windows search) and type each command listed in order: </br>
&nbsp; &nbsp; &nbsp; `mariadb --version` </br>
&nbsp; &nbsp; &nbsp; `mariadb -u root -p` or `mariadb -u USERNAME -p` </br>
&nbsp; &nbsp; &nbsp; `SHOW DATABASES` </br>
__4.__ MariaDB should come installed with HeidiSQL, if not then dowload either [MySQLWorkbench] or [HeidiSQL] directly. Or you can download mariadb iteslf but then it wont have a fancy ui. </br>
__5.__ Once you have confirmed MariaDB installation, create a new database and copy+paste each command in the dumpfile into the command terminal. </br>
&nbsp; &nbsp; &nbsp; `CREATE DATABASE nameOfDB`	</br>
&nbsp; &nbsp; &nbsp; `USE nameOfDB`	</br>
&nbsp; &nbsp; &nbsp;  now go to `Database-DevFolder/easierDumpfile` and ctrl+c, then go to terminal interface of db and ctrl+shift+v. </br>

__6.__ Necessary population of db, </br>
&nbsp; &nbsp; &nbsp; `INSERT INTO homedetails (HomeID, NoOfResidents, HomeManager, AdminCode) VALUES (99, 99, 'defHomeMan', 1234);`	</br>
