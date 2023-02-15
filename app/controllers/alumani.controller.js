const db = require("../models");
const User = db.user;

exports.alumnidetails = (req, res) => {
  User.find(
    { activeStatus: false },
    ($project = {
      panCard: 0,
      _id: 0,
      aadharcard: 0,
      currentCTC: 0,
      bankDetail: 0,
      __v: 0,
      roles: 0,
    })
  )
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

exports.addToAlumni = (req, res) => {
  const username = req.body.id;
  User.find({ username: username }, (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    } else {
      User.updateOne(
        { username: username },
        { activeStatus: false },
        (err, result) => {
          res.status(200).send({
            data: result,
            message: "User account deleted successfully",
          });
        }
      );
    }
  });
};

exports.deleteEmployeeAccount = async (req, res) => {
  const username = req.body.id;

  User.deleteOne({ username: username }, (err, user) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.status(200).send({
      data: user,
      message: "Employee account delete successfully",
    });
  });
};

exports.restoreEmployeeAccount = async (req, res) => {
  const username = req.body.id;

  User.updateOne(
    { username: username },
    { activeStatus: true },
    (err, user) => {
      if (err) {
        res.status(500).send({ err: "error", message: err });
        return;
      }
      res.status(200).send({
        data: user,
        message: "Employee account restore successfully",
      });
    }
  );
};
