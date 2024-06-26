"use strict";
var express = require("express");
var router = express.Router();
const AdNopop = require("../models/AdNodepop");
const { query, validationResult } = require("express-validator");
const fs = require("fs");

const jsonTagsList = fs.readFileSync("./data/tagsList.json", "utf-8");
const tagsList = JSON.parse(jsonTagsList);
const availableTags = tagsList.results;

const jsonKeysList = fs.readFileSync("./data/keysList.json", "utf-8");
const keysList = JSON.parse(jsonKeysList);
const availableKeys = keysList.results;

/* GET home page. */
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

        if (availableTags.includes(valueToLowerCase)) return true;
      })
      .withMessage('Tag can only be "Lifestyle", "Mobile", "Motor" or "Work"'),
    query("price").optional().isNumeric().withMessage("Price can not be empty and should be a number"),
    query("skip").optional().isNumeric().withMessage("Skip can not be empty and should be a number"),
    query("limit").optional().isNumeric().withMessage("Limit can not be empty and should be a number"),
    query("fields")
      .optional()
      .custom((value) => {
        const valueToLowerCase = value.toLowerCase();

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
      const tagsToLocalizeWithI18n = {};
      availableTags.map((tag) => {
        tagsToLocalizeWithI18n[tag] = tag;
      });

      validationResult(req).throw();

      // filters
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

      const adsList = await AdNopop.listCriterias(filter, skip, limit, sort, fields);

      res.locals.panelTitle = res.__("This is all for you!");

      res.render("index", { title: "Nodepop", adsList, tagsToLocalizeWithI18n });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
