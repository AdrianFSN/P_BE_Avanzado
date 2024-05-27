const { UserNodepop } = require("../models");
const jwt = require("jsonwebtoken");

class LoginController {
  async postApiJWT(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserNodepop.findOne({ email: email });
      if (!user || !(await user.comparePassword(password))) {
        res.json({ error: `Invalid credentials for ${user.email}` });
        return;
      }

      const tokenJWT = await jwt.sign({ userId: UserNodepop._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      res.json({ tokenJWT: tokenJWT });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoginController;
