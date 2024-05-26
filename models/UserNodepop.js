"use strict";

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserNodepop = mongoose.model("UserNodepop", userSchema);

module.exports = UserNodepop;
