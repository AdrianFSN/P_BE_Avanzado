"use strict";

var express = require("express");
var router = express.Router();
const AdNopop = require("../../models/AdNodepop");
const upload = require("../../lib/uploadConfigure");
const sendOrderToResizeEvent = require("../../services/requesters/resizeThumbnailRequest");
const path = require("node:path");

// POST /api/insert (body)
// Insert a new add
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const data = req.body;
    data.owner = req.apiUserId;

    // Save an instance of the ad in memory
    const newAd = new AdNopop(data);
    let filePath = "";

    if (req.file) {
      newAd.image = req.file.filename;
      filePath = path.join(__dirname, "../../uploads/adImages", newAd.image);
    }

    // Then persist (save) in the DB
    const insertedNewAd = await newAd.save();
    sendOrderToResizeEvent(filePath, (error, result) => {
      if (error) {
        console.error("Error resizing image: ", error);
      } else {
        console.log("InsertedOneAd gets: ", result);
      }
    });

    res.json({ result: insertedNewAd });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
