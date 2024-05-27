const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authInHeader = req.headers.authorization;
  const authInQuery = req.query.jwt;
  let tokenJWT = "";

  if (!authInQuery && (!authInHeader || !authInHeader.startsWith("Bearer "))) {
    next(createError(401, "No token provided"));
    return;
  }

  if (authInHeader) {
    tokenJWT = authInHeader.split(" ")[1];
  } else {
    tokenJWT = authInQuery;
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
