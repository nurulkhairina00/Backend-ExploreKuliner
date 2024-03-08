const db = require("../config/database");
const errorHandler = require("../middleware/errorHandler");

const getProfileById = async (res, id) => {
  try {
    const sql = `SELECT * FROM reviewer WHERE id = $1`;
    return await db.oneOrNone(sql, [id]);
  } catch (error) {
    errorHandler(res, 500, `Error fetching get user: ${error.message}`);
  }
};

const updateProfile = async (req, res, input) => {
  try {
    const sql = `
        UPDATE reviewer
        SET nama_lengkap = $1,
        email = $2,
        no_hp = $3,
        image = $4,
        updated_by = 'SELFCREATE',
        updated_date = NOW()::timestamp
        WHERE id = $5
        `;

    let filePath;
    if (!input.upload_foto) {
      filePath = input.foto_temp ? input.foto_temp : null;
    } else {
      filePath = req.files["image"][0].path.replace(/\\/g, "/");
    }

    const values = [input.nama, input.email, input.no_hp, filePath, input.id];
    await db.none(sql, values);
    return { success: true };
  } catch (error) {
    errorHandler(res, 500, `Error fetching update user: ${error.message}`);
  }
};

module.exports = {
  getProfileById,
  updateProfile,
};
