const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authInHeader = req.headers.authorization;

  if (!authInHeader || !authInHeader.startsWith("Bearer ")) {
    next(createError(401, "No token provided"));
    return;
  }
  const tokenJWT = authInHeader.split(" ")[1];

  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next(createError(401, "Invalid token"));
      return;
    }
    req.apiUserId = payload.userId;
    next();
  });
};
