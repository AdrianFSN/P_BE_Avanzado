"use strict";

const express = require("express");
const router = express.Router();
const UniqueKeysRetriever = require("../utils/UniqueKeysRetriever");

// GET /tags
//Compile an array of used tags
router.get("/", async function (req, res, next) {
  try {
    const tagsList = await UniqueKeysRetriever.getUniqueKeyValuesFromAPI("tag");
    //console.log('Esto es tagList', tagsList) // Me va a dar un objeto con results: lista de tags
    //console.log('Esto es tagList.results', tagsList.results) //Me da ls lista incluída en results
    res.render("tags", { tags: tagsList.results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
