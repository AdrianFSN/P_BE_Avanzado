"use strict";

const express = require("express");
const router = express.Router();
const UniqueKeysRetriever = require("../../utils/UniqueKeysRetriever");

// GET /api/tags
//Compiles an array of used tags
router.get("/", async function (req, res, next) {
  try {
    const retrievedTags = await UniqueKeysRetriever.getUniqueKeyValuesFromAPI("tag");
    res.json({ results: retrievedTags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
