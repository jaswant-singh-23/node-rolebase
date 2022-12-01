const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const Leave = db.leave;

exports.leaveDetails = (req, res) => {
  const username = req.headers["slug"];
  console.log(username);
  Leave.findOne({ username: username })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({
        data: user,
        message: "User was signin successfully!",
      });
    });
};

exports.leaveApply = (req, res) => {
  const username = req.headers["slug"];
  const leaves = new Leave({
    totalLeaves: req.body.totalLeaves,
    pendingLeaves: req.body.pendingLeaves,
    reason: req.body.reason,
    name: req.body.name,
    username: username,
    halfDay: req.body.halfDay,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    department: req.body.department,
    leaveStatus: req.body.leaveStatus,
    rejectReason: req.body.rejectReason,
  });
  console.log("-------------", leaves);
  leaves.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    res.status(200).send({
      data: user,
      message: "Leave apply successfully!",
    });
  });
};
