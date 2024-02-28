const jwt = require("jsonwebtoken");
const LoginModels = require("../models/LoginModels");
const errorHandler = require("../middleware/errorHandler");
const successHandler = require("../middleware/successHandler");

const login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await LoginModels.getUserByEmail(email);

    if (!user) {
      return errorHandler(res, 401, "Email not registered");
    }

    const token = jwt.sign(data, config.secret, {
      expiresIn: "12h",
    });

    data.token = token;
    await successHandler(res, data);
  } catch (err) {
    return errorHandler(res, 500, err.message || "Internal Server Error");
  }
};

module.exports = { login };
