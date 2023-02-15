const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const Leave = db.leave;
const User = db.user;

exports.leaveDetails = (req, res) => {
  const username = req.headers["slug"];
  Leave.find({ isActive: true })
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
exports.LeaveDetailsForTeamLead = (req, res) => {
  const username = req.headers["slug"];
  const department = req.headers["department"];
  Leave.find({ isActive: true, department: department, leaderResponse: "" })
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
    teamLeaderResponse: false,
    isActive: true,
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

exports.leaveReply = async (req, res) => {
  let hrUsername = req.headers["slug"];
  const username = req.body.username;
  const department = req.body.department;
  const name = req.body.name;
  const leavesData = {
    department: req.body.department,
    leaveStatus: req.body.leaveStatus,
    rejectReason: req.body.rejectReason,
    hrUsername: hrUsername,
    isActive: false,
  };

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(req.body.toDate);
  const secondDate = new Date(req.body.fromDate);

  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

  Leave.updateOne(
    { username: username, department: department },
    leavesData,
    (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (result) {
        if (req.body.rejectReason == "" && req.body.leaveStatus == "Approved") {
          User.updateOne(
            { username: username, department: department },
            {
              isActive: false,
              $inc: { totalPendingLeaves: -diffDays, leaveTaken: +diffDays },
            },
            (error, response) => {
              if (error) {
                res.status(500).send({ message: error });
                return;
              }
            }
          );
        }
        res.status(200).send({
          data: result,
          message: "Success!",
        });
      }
    }
  );
};

exports.leaveReplyByTeamLeader = async (req, res) => {
  let hrUsername = req.headers["slug"];
  const username = req.body.username;
  const department = req.body.department;
  const name = req.body.name;
  const leavesData = {
    teamLeaderResponse: req.body.teamLeaderResponse,
    leaderResponse: req.body.leaderResponse,
  };
  Leave.updateMany(
    { username: username, department: department },
    leavesData,
    (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        data: result,
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
