// Aquí va el modelo de construcción de cada anuncio
// Esquema de Mongoose
'use strict'
const mongoose = require('mongoose');
const fs = require('fs');


const adSchema = mongoose.Schema({
    name: {
        type: String, required: true, index: true
    },
    sale: { type: Boolean, required: true, index: true },
    price: { type: Number, required: true, index: true },
    picture: String,
    tag: {
        type: [String],
        validate: {
            validator: (tags) => {
                const jsonTagsList = fs.readFileSync('./data/tagsList.json', 'utf-8');
                const tagsList = JSON.parse(jsonTagsList);
                const availableTags = tagsList.results;
                return tags.every(item => availableTags.includes(item)) && tags.length > 0;
                //return tags.length > 0;
            },
            message: 'All ads must have at least one tag out of "lifestyle", "work", "mobile" and "motor" (lowercased).'
        },
        index: true
    }
});

// método listCriterias (estático), porque está en el modelo
adSchema.statics.listCriterias = function (filter, skip, limit, sort, fields) {
    const query = AdNodepop.find(filter);
    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.select(fields);
    return query.exec(); // esto devolvería la promesa que voy a await en ads.js
}


// crear el modelo de anuncio

const AdNodepop = mongoose.model('adsNodepop', adSchema);

// Opcional, exportar el modelo
module.exports = AdNodepop;