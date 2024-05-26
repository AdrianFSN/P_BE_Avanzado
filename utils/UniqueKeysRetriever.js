"use strict";
const AdNopop = require("../models/AdNodepop");

class UniqueKeysRetriever {
  static async getUniqueKeyValuesFromAPI(key, model) {
    try {
      const retrievedList = await model.distinct(key);
      if (retrievedList.length === 0) {
        throw new Error(`Nothing found to display for key ${key}`);
      }
      return { results: retrievedList };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UniqueKeysRetriever;
