const db = require("../config/database");
const errorHandler = require("../middleware/errorHandler");

const getLoginByEmail = async (res, email) => {
  try {
    const sql = `SELECT * FROM reviewer WHERE email = $1 AND login_google = 'N'`;
    return await db.oneOrNone(sql, [email]);
  } catch (error) {
    errorHandler(res, 500, `Error fetching user: ${error.message}`);
  }
};

const getLoginByEmailGoogle = async (res, email) => {
  try {
    const sql = `SELECT * FROM reviewer WHERE email = $1`;
    return await db.oneOrNone(sql, [email]);
  } catch (error) {
    errorHandler(res, 500, `Error fetching user: ${error.message}`);
  }
};

module.exports = {
  getLoginByEmail,
  getLoginByEmailGoogle,
};
