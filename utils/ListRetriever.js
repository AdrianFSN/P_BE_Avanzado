"use strict";
const AdNopop = require("../models/AdNodepop");

class UniqueKeysRetriever {
  static async getUniqueItemsInKeyList(key) {
    try {
      const keyToString = String(key);
      const retrievedList = await AdNopop.distinct(keyToString);
      return { results: retrievedList };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UniqueKeysRetriever;
