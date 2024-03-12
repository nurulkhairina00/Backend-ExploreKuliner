const db = require("../config/database");
const errorHandler = require("../middleware/errorHandler");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const insertResetPassword = async (res, email, host_url) => {
  try {
    let checkEmail = await db.oneOrNone(
      `SELECT * FROM reviewer WHERE email = $1`,
      [email]
    );

    if (!checkEmail) return { success: false };

    let data_user = checkEmail;

    // id
    const uuid = uuidv4();
    const hashedId = crypto.createHash("sha256").update(uuid).digest("hex");

    // token
    const uuid2 = uuidv4();
    const hashedId2 = crypto.createHash("sha256").update(uuid2).digest("hex");

    const sql = `
        INSERT INTO reset_password (
            id,
            id_user,
            email,
            token,
            expired_at,
            is_used,
            created_by,
            created_date
        ) VALUES (
            $1, $2, $3, $4,
            NOW() + '2 hour'::interval, 'N', $5, NOW()::timestamp
        )
     `;

    const values = [hashedId, data_user.id, email, hashedId2, data_user.id];
    await db.none(sql, values);

    const data_applicant = await db.oneOrNone(
      ` SELECT reset.*, reviewer.nama_lengkap  
        FROM reset_password AS reset
        LEFT JOIN reviewer AS reviewer on reviewer.id = reset.id_user
        WHERE reset.id = $1`,
      [hashedId]
    );

    const host = host_url;
    await sendmail(data_applicant, host);

    return { success: true };
  } catch (error) {
    errorHandler(res, 500, `Error fetching insert user: ${error.message}`);
  }
};

const getToken = async (res, token) => {
  try {
    let checkPassword = await db.oneOrNone(
      `SELECT * FROM reset_password WHERE token  = $1`,
      [token]
    );
    if (!checkPassword) return errorHandler(res, 500, "Not Found");

    return checkPassword;
  } catch (error) {
    errorHandler(res, 500, `Error fetching get user: ${error.message}`);
  }
};

const updateToken = async (res, hashedPassword, token, id_user) => {
  try {
    const sqlReviewer = `
            UPDATE reviewer
            SET password = $1,
            updated_by = $2,
            updated_date = NOW()::timestamp
            WHERE id = $3
        `;
    const valuesReviewer = [hashedPassword, id_user, id_user];
    await db.none(sqlReviewer, valuesReviewer);

    const sqlReset = `
        UPDATE reset_password
        SET is_used = 'Y',
        updated_by = $1,
        updated_date = NOW()::timestamp
        WHERE token = $2
    `;
    const valuesReset = [id_user, token];
    await db.none(sqlReset, valuesReset);
    return { success: true };
  } catch (error) {
    errorHandler(res, 500, `Error fetching update user: ${error.message}`);
  }
};

const sendmail = (data_applicant, host) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let pesan = `
        <h4>Dear ${data_applicant.nama_lengkap},</h4>
        <p>Silahkan klik link berikut untuk mereset password akun anda:</p><a href="${
          host + data_applicant.token
        }">Klik tautan berikut</a><p>Abaikan email ini jika anda merasa tidak meminta perubahan password.</p>
        <p>Link reset password ini hanya bisa digunakan dalam 2 jam, jika anda belum mengganti password dalam jangka waktu tersebut, anda dapat melakukan permintaan ulang.</p>
        <p>Jika ada pertanyaan, silahkan hubungi id.explorekuliner@gmail.com. Terima kasih</p>
        <p>Untuk tetap terupdate informasi mengenai Explore Kuliner, silakan ikuti sosial media kami pada:</p>
        <p><b style='color:#d86141'>Instagram :</b><br/>
          @Explorekuliner
        </p>
        <h4><b><i>Best Regards, </i></b><br/> 
        <b style='color:#d86141'>Explorekuliner</b><br/> 
      `;

  const mailOptions = {
    from: '"Explore Kuliner" <id.explorekuliner@gmail.com>',
    to: data_applicant.email,
    subject: "Reset Password Explore Kuliner",
    html: pesan,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email reset password:", error);
    }
    console.log("Email sent reset password:", info.response);
  });
};

module.exports = {
  insertResetPassword,
  getToken,
  updateToken,
};
