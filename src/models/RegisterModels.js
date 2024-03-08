const db = require("../config/database");
const errorHandler = require("../middleware/errorHandler");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const insertUser = async (res, input, hashedPassword, host_url) => {
  try {
    let checkEmail = await db.oneOrNone(
      `SELECT * FROM reviewer WHERE email = $1`,
      [input.email]
    );

    if (checkEmail)
      return errorHandler(res, 500, "Email sudah digunakan user lain");

    // id
    const uuid = uuidv4();
    const hashedId = crypto.createHash("sha256").update(uuid).digest("hex");

    // token
    const uuid2 = uuidv4();
    const hashedId2 = crypto.createHash("sha256").update(uuid2).digest("hex");

    const sql = `
        INSERT INTO reviewer (
            id, 
            nama_lengkap,
            email, 
            no_hp, 
            password, 
            registration_token,
            status_active, 
            status_delete, 
            login_google, 
            created_by, 
            created_date
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            'N', 'N', 'N', 'SELFCREATE', NOW()::timestamp
        )
        `;
    const values = [
      hashedId,
      input.nama,
      input.email,
      input.no_hp,
      hashedPassword,
      hashedId2,
    ];
    await db.none(sql, values);

    const data_applicant = await db.oneOrNone(
      `SELECT * FROM reviewer WHERE id = $1`,
      [hashedId]
    );

    if (data_applicant) {
      const host = host_url;
      await sendmail(data_applicant, host);
    }

    return { success: true };
  } catch (error) {
    errorHandler(res, 500, `Error fetching insert user: ${error.message}`);
  }
};

const insertUserGoogle = async (res, nama, email, image, hashedPassword) => {
  try {
    const uuid = uuidv4();
    const hashedId = crypto.createHash("sha256").update(uuid).digest("hex");

    const sql = `
        INSERT INTO reviewer (
            id, 
            nama_lengkap,
            email, 
            password, 
            image,
            status_active, 
            status_delete, 
            login_google, 
            created_by, 
            created_date
        ) VALUES (
            $1, $2, $3, $4, $5,
            'Y', 'N', 'Y', 'SELFCREATE', NOW()::timestamp
        )
        `;
    const values = [hashedId, nama, email, hashedPassword, image];
    await db.none(sql, values);
    return { success: true };
  } catch (error) {
    errorHandler(res, 500, `Error fetching insert user: ${error.message}`);
  }
};

const getToken = async (res, token) => {
  try {
    let checkEmail = await db.oneOrNone(
      `SELECT * FROM reviewer WHERE registration_token = $1`,
      [token]
    );
    if (!checkEmail) return errorHandler(res, 500, "Not Found");

    return checkEmail;
  } catch (error) {
    errorHandler(res, 500, `Error fetching get user: ${error.message}`);
  }
};

const updateToken = async (res, token) => {
  try {
    const sql = `
      UPDATE reviewer
      SET status_active = 'Y',
      updated_by = 'SELFCREATE',
      updated_date = NOW()::timestamp
      WHERE registration_token = $1
    `;
    const values = [token];
    await db.none(sql, values);
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
      <p>Silahkan klik link berikut untuk mengaktifkan akun anda:</p><a href="${
        host + data_applicant.registration_token
      }">Link aktivasi akun</a>
      <p>Abaikan email ini jika anda merasa tidak mendaftar. Jika ada pertanyaan, silahkan hubungi id.explorekuliner@gmail.com. Terima kasih
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
    subject: "Email Aktivasi Explore Kuliner",
    html: pesan,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email verify akun:", error);
    }
    console.log("Email sent verify akun:", info.response);
  });
};

module.exports = {
  insertUser,
  insertUserGoogle,
  getToken,
  updateToken,
};
