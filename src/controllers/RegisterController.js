const RegisterModels = require("../models/RegisterModels");
const errorHandler = require("../middleware/errorHandler");

const register = async (req, res) => {
  try {
    const { input, hashedPassword } = req.body;
    await RegisterModels.insertUser(res, input, hashedPassword);
    res.sendStatus(200);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

module.exports = { register };
