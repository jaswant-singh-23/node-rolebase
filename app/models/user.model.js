const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
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
    panCard: {
      type: String,
    },
    aadharcard: {
      type: String,
    },
    address: {
      type: String,
    },
    dateofbirth: {
      type: Date,
    },
    bankDetail: {
      type: String,
    },
    activeStatus: Boolean,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },{ timestamps: true })
);

module.exports = User;
