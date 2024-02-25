const jwt = require("jsonwebtoken");
const { findUserById } = require("../services/userService");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const handleJoiError = (status, message, res) => {
  res.status(status).json({ message: message });
};
const authorize = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleJoiError(403, "Not authorized", res);
  }
  const token = authorization.split(" ")[1];
  try {
    const user = await jwt.verify(token, SECRET_KEY);
    const userDB = await findUserById(user.id);
    if (!userDB.token) return handleJoiError(403, "Not authorized", res);
    if (user.id !== userDB.id)
      return handleJoiError(403, "Not authorized", res);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return handleJoiError(403, "Not authorized", res);
    return next(error);
  }
};

module.exports = authorize;
