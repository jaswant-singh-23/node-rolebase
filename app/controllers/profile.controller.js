const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { request } = require("http");
const { response } = require("express");

exports.profileDetails = (req, res) => {
  User.find(
    { activeStatus: true },
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

////////////////////////////// General //////////////////////////

exports.departmentAndEmployeeCount = (req, res) => {
  User.aggregate([
    { $match: { activeStatus: true } },
    {
      $group: {
        _id: {
          department: "$department",
        },
        totalCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec((err, user) => {
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

exports.ProfileGetById = (req, res) => {
  User.findOne(
    {
      username: req.headers["slug"],
    },
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

exports.GetParticularProfile = (req, res) => {
  User.findOne(
    {
      username: req.body.id,
    },
    ($project = {
      panCard: 0,
      _id: 0,
      aadharcard: 0,
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

exports.getUpcomingBirthday = async (req, res) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  User.aggregate([
    {
      $project: {
        _id: 0,
        name: "$name",
        designation: "$designation",
        dateParts: { $dateToParts: { date: "$dateofbirth" } },
      },
    },
    {
      $project: {
        name: "$name",
        designation: "$designation",
        birthMonth: "$dateParts.month",
        birthDay: "$dateParts.day",
      },
    },
  ]).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!users) {
      return res.status(404).send({ message: "User Not found." });
    }
    if (users) {
      const todayBirthdays = [];
      const upcomingBirthdays = [];
      const previousBirthdays = [];
      users.forEach((user) => {
        if (user.birthMonth == currentMonth && currentDay == user.birthDay) {
          todayBirthdays.push(user);
        } else if (
          user.birthMonth == currentMonth &&
          user.birthDay >= currentDay
        ) {
          upcomingBirthdays.push(user);
        } else if (
          user.birthMonth == currentMonth &&
          user.birthDay < currentDay
        ) {
          previousBirthdays.push(user);
        }
      });

      const todayBirthday = todayBirthdays.sort((a, b) =>
        a.birthDay > b.birthDay ? 1 : -1
      );
      const upcomingBirthday = upcomingBirthdays.sort((a, b) =>
        a.birthDay > b.birthDay ? 1 : -1
      );
      const previousBirthday = previousBirthdays.sort((a, b) =>
        a.birthDay > b.birthDay ? 1 : -1
      );

      res.status(200).send({
        todayBirthdays: todayBirthday,
        upcomingBirthdays: upcomingBirthday,
        previousBirthdays: previousBirthday,
        message: "success",
      });
    }
  });
};

exports.profileAdd = (req, res) => {
  const profile = new Profile({
    avatar: req.body.avatar,
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    designation: req.body.designation,
    department: req.body.department,
    dateofjoining: req.body.dateofjoining,
    currentCTC: req.body.currentCTC,
    panCard: req.body.panCard,
    aadharcard: req.body.aadharcard,
    address: req.body.address,
    dateofbirth: req.body.dateofbirth,
    bankDetail: req.body.bankDetail,
  });
  profile.save((err, user) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "Profile was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Profile was registered successfully!" });
        });
      });
    }
  });
};

exports.updateUserPassword = async (req, res) => {
  User.findOne({
    activeStatus: true,
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.oldPass, user.password);
      let password = { password: bcrypt.hashSync(req.body.newPass.trim(), 8) };

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      User.updateOne(
        { username: req.body.username },
        password,
        (err, result) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          res.status(200).send({
            data: result,
            message: "Password updated successfully",
          });
        }
      );
    });
};

exports.updateEmployeeDetails = async (req, res) => {
  const username = req.body.username;
  const profileData = {
    avatar: req.body.avatar,
    name: req.body.name.trim(),
    username: req.body.username.trim(),
    email: req.body.email.trim(),
    phone: req.body.phone,
    designation: req.body.designation.trim(),
    department: req.body.department.trim(),
    dateofjoining: req.body.dateofjoining,
    currentCTC: req.body.currentCTC,
    panCard: req.body.panCard,
    aadharcard: req.body.aadharcard,
    address: req.body.address.trim(),
    dateofbirth: req.body.dateofbirth,
    bankDetail: req.body.bankDetail,
  };
  User.updateOne({ username: username }, profileData, (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    } else {
      res.status(200).send({
        data: user,
        message: "Profile updated successfully!",
      });
    }
  });
};

exports.avatarUpload = (req, res) => {
  let username = req.headers["slug"];
  User.updateOne(
    { username: username },
    { avatar: req.file.path },
    (err, result) => {
      res.status(200).send({
        data: result,
        message: "Profile image uploaded successfully",
      });
    }
  );
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

exports.departmentDetails = (req, res) => {
  const data = {
    dotnet: [],
    reactjs: [],
    designer: [],
    dataentry: [],
    angular: [],
    python: [],
    marketing: [],
  };
  User.find(
    { department: { $ne: "Admin", $ne: "HRM" }, activeStatus: true },
    { department: 1, name: 1, designation: 1, username: 1 },
    (err, user) => {
      if (err) {
        res.status(500).send({ err: "error", message: err });
        return;
      }
      user.forEach((item, i) => {
        if (item.department == "Dot Net") {
          data.dotnet.push(item);
        } else if (item.department == "React js") {
          data.reactjs.push(item);
        } else if (item.department == "Web Designer") {
          data.designer.push(item);
        } else if (item.department == "Data Entry") {
          data.dataentry.push(item);
        } else if (item.department == "Angular") {
          data.angular.push(item);
        } else if (item.department == "Python") {
          data.python.push(item);
        } else if (item.department == "Digital Marketing") {
          data.marketing.push(item);
        }
      });
      res.send({ data: data, message: "Success!" });
    }
  );
};

exports.departmentNames = (req, res) => {
  User.aggregate([
    {
      $match: { activeStatus: true, department: { $ne: "Admin", $ne: "HRM" } },
    },
    {
      $group: {
        _id: {
          department: "$department",
        },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec((err, user) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ data: user, message: "Success!" });
  });
};

exports.getPariculardepartment = (req, res) => {
  const department = req.body.department;
  User.find(
    {
      department: { $ne: "Admin", $ne: "HRM" },
      activeStatus: true,
      department: department,
    },
    { department: 1, name: 1, avatar: 1, designation: 1, username: 1 },
    (err, user) => {
      if (err) {
        res.status(500).send({ err: "error", message: err });
        return;
      }
      res.send({ data: user, message: "Success!" });
    }
  );
};
