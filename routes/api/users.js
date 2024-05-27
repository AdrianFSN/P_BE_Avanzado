const express = require("express");
const router = express.Router();
const { UserNodepop } = require("../../models");

router.get("/", async function (req, res, next) {
  try {
    const usersNodepop = await UserNodepop.find();

    res.json({ results: usersNodepop });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
