"use strict";

var express = require("express");
var router = express.Router();
const AdNopop = require("../../models/AdNodepop");
const upload = require("../../lib/publicUploadConfigure");

// POST /api/insert (body)
// Insert a new add
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const data = req.body;
    data.owner = req.apiUserId;

    // Save an instance of the ad in memory
    const newAd = new AdNopop(data);
    newAd.image = req.file.filename;
    // Then persist (save) in the DB
    const insertedNewAd = await newAd.save();
    res.json({ result: insertedNewAd });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
