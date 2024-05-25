'use strict';
const AdNopop = require('./AdNodepop');

class TagsRetriever {
    static async retrieveTags() {
        try {
            const tagsList = await AdNopop.distinct("tag");
            return { results: tagsList };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TagsRetriever;