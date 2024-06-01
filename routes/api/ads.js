"use strict";

var express = require("express");
var router = express.Router();
const AdNopop = require("../../models/AdNodepop");
const { query, param, validationResult } = require("express-validator");
const fs = require("fs");

// GET /api/adsNodepop
// Returns the whole list of ads
router.get(
  "/",
  [
    query("name").optional().notEmpty().withMessage("At least one character is needed to search by name"),
    query("sale")
      .optional()
      .custom((value) => {
        const lowerCaseValue = value.toLowerCase();

        if (lowerCaseValue === "true" || lowerCaseValue === "false") {
          return true;
        }
      })
      .withMessage('On sale can only be "true" or "false"'),
    query("tag")
      .optional()
      .custom((value) => {
        const valueToLowerCase = value.toLowerCase();
        const jsonTagsList = fs.readFileSync("./data/tagsList.json", "utf-8");
        const tagsList = JSON.parse(jsonTagsList);
        const availableTags = tagsList.results;

        if (availableTags.includes(valueToLowerCase)) return true;
      })
      .withMessage('Tag can only be "lifestyle", "mobile", "motor" or "work"'),
    query("price").optional().isNumeric().withMessage("Price can not be empty and should be a number"),
    query("skip").optional().isNumeric().withMessage("Skip can not be empty and should be a number"),
    query("limit").optional().isNumeric().withMessage("Limit can not be empty and should be a number"),
    query("fields")
      .optional()
      .custom((value) => {
        const valueToLowerCase = value.toLowerCase();
        const jsonKeysList = fs.readFileSync("./data/keysList.json", "utf-8");
        const keysList = JSON.parse(jsonKeysList);
        const availableKeys = keysList.results;

        if (availableKeys.includes(valueToLowerCase)) return true;
      })
      .withMessage('You can only filter by "name", "sale", "price" or "tag"'),
    query("sort")
      .optional()
      .custom((value) => {
        if (value.startsWith("-")) {
          value = value.slice(1);
        }
        const jsonKeysList = fs.readFileSync("./data/keysList.json", "utf-8");
        const keysList = JSON.parse(jsonKeysList);
        const availableKeys = keysList.results;

        if (availableKeys.includes(value)) return true;
      })
      .withMessage('You can only sort by "name", "sale", "price" or "tag"'),
  ],

  async function (req, res, next) {
    try {
      validationResult(req).throw();

      const filterByTag = req.query.tag ? req.query.tag.toLowerCase() : req.query.tag;
      const filterByName = req.query.name ? req.query.name.toLowerCase() : req.query.name;
      const filterByOnSale = req.query.sale ? req.query.sale.toLowerCase() : req.query.sale;
      const filterByPrice = req.query.price;

      //paging
      const skip = req.query.skip;
      const limit = req.query.limit;

      //ordering
      const sort = req.query.sort;
      //fields selection
      const fields = req.query.fields ? req.query.fields.toLowerCase() : req.query.fields;

      const filter = {};

      if (filterByTag) {
        filter.tag = filterByTag;
      }
      if (filterByName) {
        filter.name = new RegExp("^" + filterByName, "i");
      }
      if (filterByOnSale) {
        filter.sale = filterByOnSale;
      }
      if (filterByPrice) {
        filter.price = filterByPrice;
      }
      const adsList = await AdNopop.listCriterias(filter, skip, limit, sort, fields); // he cambiado find por listCriterias
      res.json({ results: adsList });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/adsNodepop/<_id>
// Returns a single ad (specified by id)
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("The ID you introduced does not exist or is not in a valid format.")],
  async (req, res, next) => {
    try {
      validationResult(req).throw();

      const id = req.params.id;
      const oneAd = await AdNopop.findById(id);
      res.json({ result: oneAd });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
