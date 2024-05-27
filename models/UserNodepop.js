"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// Password hash method
userSchema.statics.hashPassword = function (plainTextPassword) {
  return bcrypt.hash(plainTextPassword, 10);
};

// Password comparison method
userSchema.methods.comparePassword = function (plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password);
};

const UserNodepop = mongoose.model("UserNodepop", userSchema);

module.exports = UserNodepop;
