# HistoryCard

A data management web application for universities to manage students's data. Currently, we are designing this application for an Indian university. So, this might not be useful for many universities in the world. But we hope we'll make this as a generic application which can be used by most of the universities.

## Dependencies

- Nodejs
- npm
- python 3
- postgresql
- postgresql-contrib

## Installation

Make sure you've installed all the dependencies and downloaded the code before proceeding.

1) Type the following commands in the termial.
```
$ npm install
$ sudo service postgresql start
$ psql
# \passwd postgres
# <type-new-password>
# <re-type-password>
# \q
```
2) open `config.json` file, update username as "postgres", update the password which typed in the terminal and save the file.

3) Type the following commands in the terminal.
```
$ python check-install.py
$ node install-db
```
4) Start the server by typing,
```
$ npm start
```
