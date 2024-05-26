"use strict";

const express = require("express");
const router = express.Router();
const UniqueKeysRetriever = require("../utils/UniqueKeysRetriever");
const AdNodepop = require("../models/AdNodepop");

// GET /tags
//Compile an array of used tags
router.get("/", async function (req, res, next) {
  try {
    const tagsList = await UniqueKeysRetriever.getUniqueKeyValuesFromAPI("tag", AdNodepop);
    res.render("tags", { tags: tagsList.results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
