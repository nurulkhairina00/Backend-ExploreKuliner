const errorHandler = (res, statusCode, message) => {
  res
    .status(statusCode)
    .json({ success: false, status: statusCode, error: message });
};

module.exports = errorHandler;
