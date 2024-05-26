const express = require("express");
const router = express.Router();
const { UserNodepop } = require("../../models");

router.get("/users", async function (req, res, next) {
  try {
    const filterByNickname = req.query.nickname;
    const nicknamesList = await UserNodepop.listCriterias(filterByNickname);

    res.json({ results: nicknamesList });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
