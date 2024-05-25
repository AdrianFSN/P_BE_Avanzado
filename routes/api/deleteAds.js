'use strict'
var express = require('express');
var router = express.Router();
const AdNopop = require('../../models/AdNodepop');
const { param, validationResult } = require('express-validator');

// DELETE /api/delete/<_id>
// Eliminates an ad
router.delete('/:id',
    [
        param('id').isMongoId().withMessage('The ID you introduced does not exist or is not in a valid format.')
    ],
    async (req, res, next) => {
        try {
            validationResult(req).throw();

            const id = req.params.id;
            await AdNopop.deleteOne({ _id: id });
            res.json(); // No message. If answer is 200 OK in Postman, it went well.
        } catch (error) {
            next(error);
        };
    });

module.exports = router;