const pgp = require("pg-promise")();
require("dotenv").config();

const databaseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const db = pgp(databaseConfig);

module.exports = db;
