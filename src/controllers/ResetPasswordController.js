const ResetPasswordModels = require("../models/ResetPasswordModels");
const errorHandler = require("../middleware/errorHandler");

const resetPassword = async (req, res) => {
  try {
    const { email, host_url } = req.body;
    const result = await ResetPasswordModels.insertResetPassword(
      res,
      email,
      host_url
    );

    if (result.success) {
      res.status(200).json({ message: "MAILSENT" });
    } else {
      res.status(200).json({ message: "EMAILNOTFOUND" });
    }
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const verifyResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    let user = await ResetPasswordModels.getToken(res, token);
    res.status(200).json(user);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const verifyToken = async (req, res) => {
  try {
    const { hashedPassword, token, id_user } = req.body;
    await ResetPasswordModels.updateToken(res, hashedPassword, token, id_user);
    res.sendStatus(200);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

module.exports = { resetPassword, verifyResetPassword, verifyToken };
