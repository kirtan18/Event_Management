require('dotenv-safe').config({
  path: '.config/.env',
});

module.exports = {
  dbConfig: {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  },
  serverPort: process.env.SERVER_PORT
};
