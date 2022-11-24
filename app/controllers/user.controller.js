const config = require("../config/auth.config");
const db = require("../models");
const uploadFile = require("../middlewares/upload");

const Profile = db.profile;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};


exports.profileGet = (req, res) => {
  console.log("_____", req.body);
  Profile.findOne({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    designation: req.body.designation,
    department: req.body.department,
    dateofjoining: req.body.dateofjoining,
    currentCTC: req.body.currentCTC,
    panCard: req.body.panCard,
    aadharcard: req.body.aadharcard,
    address: req.body.address,
    dateofbirth: req.body.dateofbirth,
    bankDetail: req.body.bankDetail,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        message: "Profile update successfully!",
      });
    });
};

exports.profileAdd = (req, res) => {
  console.log("_____", req.body);
  Profile.findOne({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    designation: req.body.designation,
    department: req.body.department,
    dateofjoining: req.body.dateofjoining,
    currentCTC: req.body.currentCTC,
    panCard: req.body.panCard,
    aadharcard: req.body.aadharcard,
    address: req.body.address,
    dateofbirth: req.body.dateofbirth,
    bankDetail: req.body.bankDetail,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        message: "Profile update successfully!",
      });
    });
};


exports.profileEdit = (req, res) => {
  console.log("_____", req.body);
  Profile.findOne({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    designation: req.body.designation,
    department: req.body.department,
    dateofjoining: req.body.dateofjoining,
    currentCTC: req.body.currentCTC,
    panCard: req.body.panCard,
    aadharcard: req.body.aadharcard,
    address: req.body.address,
    dateofbirth: req.body.dateofbirth,
    bankDetail: req.body.bankDetail,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        message: "Profile update successfully!",
      });
    });
};



const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};