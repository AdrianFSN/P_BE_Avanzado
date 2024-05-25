'use strict'

const express = require('express');
const router = express.Router();
//const AdNopop = require('../../models/AdNodepop');
const RetrieverTags = require('../../models/RetrieveTags');

// GET /api/tags
//Compiles an array of used tags
router.get('/', async function (req, res, next) {
    try {
        const retrievedTags = await RetrieverTags.retrieveTags();
        res.json({ results: retrievedTags });

    } catch (error) {
        next(error);
    };
});

module.exports = router;