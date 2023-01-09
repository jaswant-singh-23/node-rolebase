const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const User = db.user;
const Role = db.role;
const Inventory = db.inventory;
const Single = db.single;

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
  console.log(req.body);
  const profileData = {
    avatar: req.body.avatar,
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

/////////////////////////// Inventory Control ////////////////////////////////

exports.inventoryAdd = async (req, res) => {
  const inventory = new Inventory({
    email: req.body.email,
    username: req.body.username,
    totalItems: req.body.totalItems,
    itemName: req.body.itemName,
  });

  inventory.save((err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  });
};
exports.inventoryView = async (req, res) => {
  Inventory.find({}, (err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  });
};

exports.inventoryGetById = async (req, res) => {
  const username = req.body.id;
  Inventory.find({ username: username }, (err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  });
};

exports.inventoryEdit = async (req, res) => {
  const id = req.body.id;
  const inventory = {
    email: req.body.email,
    username: req.body.username,
    totalItems: req.body.totalItems,
    itemName: req.body.itemName,
  };
  Inventory.updateMany({ username: id }, { $set: inventory }, (err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  });
};

exports.inventoryDelete = async (req, res) => {
  const username = req.body.id;

  Inventory.deleteOne({ username: username }, (err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  });
};

///////////////////////////////////////  Alumni /////////////////////////////////////

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
