const jwt = require("jsonwebtoken");
const LoginModels = require("../models/LoginModels");
const errorHandler = require("../middleware/errorHandler");

const login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await LoginModels.getLoginByEmail(res, email);

    if (!user) {
      return errorHandler(res, 401, "Email tidak terdaptar");
    }

    const token = jwt.sign(user, process.env.API_KEY, {
      expiresIn: "12h",
    });
    user.token = token;

    await res.status(200).json(user);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const checkGoogle = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await LoginModels.getLoginByEmailGoogle(res, email);
    await res.status(200).json(user);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const loginGoogle = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await LoginModels.getLoginByEmailGoogle(res, email);

    if (user) {
      const token = jwt.sign(user, process.env.API_KEY, {
        expiresIn: "12h",
      });
      user.token = token;
    }

    await res.status(200).json(user);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

module.exports = { login, checkGoogle, loginGoogle };
