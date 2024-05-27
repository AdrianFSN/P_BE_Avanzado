const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const tokenJWT = req.get("Authorization" || req.body.jwt);

  if (!tokenJWT) {
    next(createError(401, "No token provided"));
    return;
  }

  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next(createError(401, "Invalid token"));
      return;
    }
    req.apiUserId = payload.userId;
    next();
  });
};
