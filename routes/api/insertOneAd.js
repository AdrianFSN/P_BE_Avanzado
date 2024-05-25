'use strict'

var express = require('express');
var router = express.Router();
const AdNopop = require('../../models/AdNodepop');

// POST /api/insert (body)
// Insert a new add
router.post('/', async (req, res, next) => {
    try {
        const data = req.body;

        // Save an instance of the ad in memory
        const newAd = new AdNopop(data);
        // Then persist (save) in the DB
        const insertedNewAd = await newAd.save();
        res.json({ result: insertedNewAd });
    } catch (error) {
        next(error);
    };
});

module.exports = router;