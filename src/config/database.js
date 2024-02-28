const pgp = require("pg-promise")();
require("dotenv").config();

const databaseConfig = {
  api_key: process.env.API_KEY,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};

const db = pgp(databaseConfig.database);

module.exports = db;
