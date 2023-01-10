const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const Leave = db.leave;

exports.leaveDetails = (req, res) => {
  const username = req.headers["slug"];
  Leave.find()
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
        message: "success",
      });
    });
};

exports.leaveApply = (req, res) => {
  const username = req.headers["slug"];
  const leaves = new Leave({
    reason: req.body.reason,
    name: req.body.name,
    username: username,
    halfDay: req.body.halfDay,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    department: req.body.department,
  });
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

exports.leaveReply = (req, res) => {
  let hrUsername = req.headers["slug"];
  const username = req.body.username;
  const department = req.body.department;
  const name = req.body.name;
  const leavesData = {
    department: req.body.department,
    leaveStatus: req.body.leaveStatus,
    rejectReason: req.body.rejectReason,
    hrUsername: hrUsername,
  };
  Leave.updateOne(
    { username: username, department: department },
    leavesData,
    (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        data: user,
        message: "Success!",
      });
    }
  );
};

exports.leaveNotifications = (req, res) => {
  const username = req.body.username;
  Leave.find(
    { username: username },
    { username: 1, updatedAt: 1, reason: 1 },
    (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        data: user,
        message: "Success!",
      });
    }
  );
};
