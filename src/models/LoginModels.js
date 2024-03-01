const db = require("../config/database");
const errorHandler = require("../middleware/errorHandler");

const getUserByEmail = async (res, email) => {
  try {
    const sql = `SELECT * FROM reviewer WHERE email = $1 AND status_active = 'Y' AND login_google = 'N'`;
    return await db.oneOrNone(sql, [email]);
  } catch (error) {
    errorHandler(res, 500, `Error fetching user: ${error.message}`);
  }
};

module.exports = {
  getUserByEmail,
};
