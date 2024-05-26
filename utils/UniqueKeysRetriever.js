"use strict";
const AdNopop = require("../models/AdNodepop");

class UniqueKeysRetriever {
  static async getUniqueKeyValuesFromAPI(key) {
    try {
      const retrievedList = await AdNopop.distinct(key);
      return { results: retrievedList };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UniqueKeysRetriever;
