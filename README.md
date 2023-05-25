# Event Management
## Prerequisites

Make sure you have installed all of the following prerequisites on your machine:
- Node(v18.13.0) - [Download & Install Node.js](https://nodejs.org/en/download)
- CockroachDB(v22.2.8) - [Download & Install CockroachDB](https://www.cockroachlabs.com/docs/v20.1/install-cockroachdb-windows)
- DBeaver - [Download & Install PostgreSQL](https://dbeaver.io/download/)
- GraphQL - [Download & Install GraphQL](https://sourceforge.net/projects/graphql-playground.mirror/) 

## Environment Variables
To run this project, you will need to add the environment variables which is listed in .env.example file to your .env file, which will be placed in the .config/ directory.

## Run Project Locally
Clone the project
```sh
$ git clone https://github.com/kirtan18/Event_Management.git
```
Go to the project directory
```sh
$ cd Event_management
```
Install dependencies
```sh
$ npm install
```
Generate API Documentation
```sh
$ npm run docs
```
Start the server
```sh
$ npm start
```

LocalHost
```sh
http://localhost:${PORT}/graphql
```

## Tech Stack
- Database: CockroachDB, PostgreSQL
- Server: GraphQL, Node.js, Express.js

## Features
- API Integration
- Authorization
- Pagination
- Real-Time Updates


