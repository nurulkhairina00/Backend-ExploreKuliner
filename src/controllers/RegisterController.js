const RegisterModels = require("../models/RegisterModels");
const errorHandler = require("../middleware/errorHandler");

const register = async (req, res) => {
  try {
    const { input, hashedPassword, host_url } = req.body;
    await RegisterModels.insertUser(res, input, hashedPassword, host_url);
    res.sendStatus(200);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const registerGoogle = async (req, res) => {
  try {
    const { nama, email, hashedPassword } = req.body;
    await RegisterModels.insertUserGoogle(res, nama, email, hashedPassword);
    res.sendStatus(200);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const verifyRegister = async (req, res) => {
  try {
    const { token } = req.params;
    let user = await RegisterModels.getUserToken(res, token);
    res.status(200).json(user);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    await RegisterModels.updateUserToken(res, token);
    res.sendStatus(200);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

module.exports = { register, registerGoogle, verifyRegister, verifyToken };
