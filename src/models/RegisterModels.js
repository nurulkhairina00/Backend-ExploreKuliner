const db = require("../config/database");
const errorHandler = require("../middleware/errorHandler");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const insertUser = async (res, input, hashedPassword) => {
  try {
    let checkEmail = await db.any(`SELECT * FROM reviewer WHERE email = $1`, [
      input.email,
    ]);

    if (checkEmail.length > 0)
      return errorHandler(res, 500, "Email sudah digunakan user lain");

    const uuid = uuidv4();
    const hashedId = crypto.createHash("sha256").update(uuid).digest("hex");

    const sql = `
        INSERT INTO reviewer (
            id, 
            email, 
            no_hp, 
            password, 
            status_active, 
            status_delete, 
            login_google, 
            created_by, 
            created_date
        ) VALUES (
            $1, $2, $3, $4,
            'N', 'N', 'N', 'SELFCREATE', NOW()::timestamp
        )
        `;
    const values = [hashedId, input.email, input.no_hp, hashedPassword];
    return await db.none(sql, values);
  } catch (error) {
    errorHandler(res, 500, `Error fetching insert user: ${error.message}`);
  }
};

module.exports = {
  insertUser,
};
