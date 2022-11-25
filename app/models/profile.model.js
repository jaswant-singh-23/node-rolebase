const mongoose = require("mongoose");

const Profile = mongoose.model(
  "Profile",
  new mongoose.Schema({
    avatar: String,
    name: String,
    username: String,
    password: String,
    email: String,
    phone: Number,
    designation: String,
    department: String,
    dateofjoining: Date,
    currentCTC: Number,
    panCard: String,
    aadharcard: String,
    address: String,
    dateofbirth: Date,
    bankDetail: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = Profile;