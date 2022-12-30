const mongoose = require("mongoose");

const Single = mongoose.model(
  "Single",
  new mongoose.Schema({
    avatar: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    designation: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    dateofjoining: {
      type: Date,
    },
    currentCTC: {
      type: Number,
    },
    address: {
      type: String,
    },
    dateofbirth: {
      type: Date,
    },
  },{ timestamps: true })
);

module.exports = Single;
