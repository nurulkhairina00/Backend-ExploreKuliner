const jwt = require("jsonwebtoken");
const errorHandler = require("./errorHandler");
require("dotenv").config();

const checkToken = (req, res, next) => {
  const authHeaders = req.headers["authorization"];
  const token =
    authHeaders && /^Bearer\s/.test(authHeaders) && authHeaders.split(" ")[1];

  if (!token)
    return errorHandler(res, 401, "Unauthorized - Token not provided");

  jwt.verify(token, process.env.API_KEY, (error, user) => {
    if (error) return errorHandler(res, 403, "Forbidden - Invalid token");
    req.user = user;
    next();
  });
};

module.exports = checkToken;
