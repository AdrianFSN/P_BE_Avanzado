"use strict";
var express = require("express");
var router = express.Router();
const AdNopop = require("../../models/AdNodepop");
const { param, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("node:path");

// DELETE /api/delete/<_id>
// Eliminates an ad
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("The ID you introduced does not exist or is not in a valid format.")],
  async (req, res, next) => {
    try {
      validationResult(req).throw();

      const id = req.params.id;
      const ad = await AdNopop.findOne({ _id: id });

      if (ad) {
        try {
          fs.unlink(path.join(__dirname, "..", "..", "uploads", "adImages", ad.image), () => {
            console.log("Image deleted successfully");
          }),
            fs.unlink(path.join(__dirname, "..", "..", "uploads", "adImages", "thumbnail_" + ad.image), () => {
              console.log("Thumbnail deleted successfully");
            });
        } catch (error) {
          console.error("Error deleting image files");
        }
      }

      await AdNopop.deleteOne({ _id: id });
      res.json(); // No message. If answer is 200 OK in Postman, it went well.
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
