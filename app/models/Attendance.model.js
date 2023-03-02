const mongoose = require("mongoose");

const Attendance = mongoose.model(
  "Attendance",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      attendance: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Attendance;
