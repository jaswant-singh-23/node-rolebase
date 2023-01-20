const mongoose = require("mongoose");

const Leave = mongoose.model(
  "Leave",
  new mongoose.Schema(
    {
      totalLeaves: Number,
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
      hrUsername: String,
      isRead: Boolean,
      isActive: Boolean,
      teamLeaderResponse: Boolean,
      leaderResponse: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  )
);

module.exports = Leave;
