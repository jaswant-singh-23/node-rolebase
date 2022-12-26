const mongoose = require("mongoose");

const Leave = mongoose.model(
  "Leave",
  new mongoose.Schema(
    {
      totalLeaves: {
        type: Number,
        required: true
      },
      pendingLeaves: Number,
      reason: String,
      name: String,
      username: String,
      fromDate: Date,
      halfDay: String,
      toDate: Date,
      department: String,
      leaveStatus: String,
      rejectReason: String,
    },
    { timestamps: true }
  )
);

module.exports = Leave;
