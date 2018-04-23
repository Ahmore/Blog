# Blog

[![Build Status](https://travis-ci.org/Ahmore/Blog.svg?branch=master)](https://travis-ci.org/Ahmore/Blog)

## How to run?

### Database
Download and install PostgreSQL database.

### Server database
`psql -c 'create database blog;' -U postgres`

### Server dependencies
`npm install`

### Create enviroment file
Create .env file based on .env.file.

### Database migration
`set NODE_ENV=local`

`./node_modules/.bin/sequelize db:migrate`

### Run server
`npm start`
