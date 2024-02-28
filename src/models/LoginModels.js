const db = require("../config/database");

const getUserByEmail = async (email) => {
  const sql =
    "SELECT * FROM users WHERE user_account = $1 AND status_active = $2";
  try {
    return await db.oneOrNone(sql, [email, "Y"]);
  } catch (err) {
    throw new Error(`Error fetching user: ${err.message}`);
  }
};

module.exports = {
  getUserByEmail,
};
