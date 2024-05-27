const { UserNodepop } = require("../models");
const jwt = require("jsonwebtoken");

class LoginController {
  async postApiJWT(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserNodepop.findOne({ email: email });
      if (!user || !(await user.comparePassword(password))) {
        res.json({ error: "Invalid credentials" });
        return;
      }

      const tokenJWT = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1m",
      });

      res.json({ tokenJWT: tokenJWT });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoginController;
