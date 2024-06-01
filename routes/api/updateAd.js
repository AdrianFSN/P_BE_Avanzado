"use strict";

var express = require("express");
var router = express.Router();
const AdNopop = require("../../models/AdNodepop");
const { body, param, validationResult } = require("express-validator");
const fs = require("fs");
const upload = require("../../lib/uploadConfigure");
const path = require("node:path");
const sendOrderToResizeEvent = require("../../services/requesters/resizeThumbnailRequest");

// PUT /api/update/<_id> (body)
// updates an ad
router.put(
  "/:id",
  upload.single("image"),
  [
    param("id").isMongoId().withMessage("The ID you introduced does not exist or is not in a valid format."),
    body("name").notEmpty().withMessage("Name cannot be empty."),
    body("sale").notEmpty().withMessage('Sale must be boolean: "true" (for selling) or "false" (for buying).'),
    body("price").isNumeric().withMessage("You must define a price in number for your offer"),
    body("tag")
      .custom((value) => {
        const jsonTagsList = fs.readFileSync("./data/tagsList.json", "utf-8");
        const tagsList = JSON.parse(jsonTagsList);
        const availableTags = tagsList.results;

        if (availableTags.includes(value)) return true;
      })
      .withMessage('Tags can only be "lifestyle", "mobile", "work" or "motor" (lowercased).'),
  ],
  async (req, res, next) => {
    try {
      validationResult(req).throw();

      const id = req.params.id;
      const data = req.body;
      let filePath = "";

      const adToUpdate = await AdNopop.findById(id);

      if (req.file) {
        adToUpdate.image = req.file.filename;
        filePath = path.join(__dirname, "../../uploads/adImages", adToUpdate.image);
      }
      Object.keys(data).forEach((key) => {
        adToUpdate[key] = data[key];
      });
      /*       adToUpdate.name = data.name;
      adToUpdate.sale = data.sale;
      adToUpdate.price = data.price;
      adToUpdate.tag = data.tag; */

      const updatedAd = await adToUpdate.save();

      sendOrderToResizeEvent(filePath, (error, result) => {
        if (error) {
          console.error("Error resizing image: ", error);
        } else {
          console.log("InsertedOneAd gets: ", result);
        }
      });

      res.json({ result: updatedAd });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
