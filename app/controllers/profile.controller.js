const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const User = db.user;
const Role = db.role;
const Inventory = db.inventory;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.profileDetails = (req, res) => {
  console.log(req.headers["slug"]);
  User.find(
    {},
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

exports.ProfileGetById = (req, res) => {
  console.log(req.headers["slug"]);
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
      console.log(user)
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
  console.log("_____", req.body);
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

exports.profileEdit = (req, res) => {
  console.log("_____", req.body);
  const profile = new Profile({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  Profile.findOne({
    avatar: req.body.avatar,
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8),
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

exports.avatarUpload = (req, res) => {
  console.log(req.file.path, "================================")
  res.send({ message: "Success", data: req.body });
}

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
    { department: { $ne: "Admin", $ne: "HRM" } },
    { department: 1, name: 1, designation: 1, username: 1 },

    (err, user) => {
      if (err) {
        res.status(500).send({ err: "error", message: err });
        return;
      }
      //       React JS
      // Web Designer
      // Dot Net
      // Data Entry
      // Python
      // Angular
      // Digital Marketing
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
      console.log(data);
      res.send({ data: data, message: "Success!" });
    }
  );
};

exports.updateEmployeeDetails = (req, res) => {
  console.log(req.headers["slug"]);
  res.send({ data: req.body })
  // User.findOne(
  //   {
  //     username: req.headers["slug"],
  //   },
  //   ($project = {
  //     panCard: 0,
  //     _id: 0,
  //     aadharcard: 0,
  //     currentCTC: 0,
  //     bankDetail: 0,
  //     __v: 0,
  //     roles: 0,
  //   })
  // )
  //   .populate("roles", "-__v")
  //   .exec((err, user) => {
  //     if (err) {
  //       res.status(500).send({ message: err });
  //       return;
  //     }

  //     if (!user) {
  //       return res.status(404).send({ message: "User Not found." });
  //     }

  //     res.status(200).send({
  //       data: user,
  //       message: "success",
  //     });
  //   });
};


exports.deleteEmployeeAccount = async (req, res) => {
  const uid = req.body.id;
  res.send(req.body)

  // await fs.readFile('app/public/excel/Book1.xlsx', function (err, result) {

  //   if (err) {
  //     res.status(500).send({ message: err });
  //     return;
  //   }
  //   var results = JSON.parse(result);

  //   results.forEach((element, index) => {
  //     if (element.id == uid) {
  //       results.splice(index, 1);
  //     }
  //   })

  //   fs.writeFile("app/public/excel/Book1.xlsx", JSON.stringify(results), function (err, response) {
  //     if (err) {
  //       res.status(500).send({ message: err });
  //       return;
  //     }

  //     res.status(200).send({
  //       message: response,
  //       message: "Employee Data was delete successfully"
  //     });
  //   });
  // });
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
  })
};
exports.inventoryView = async (req, res) => {
  Inventory.find({},(err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  })
};

exports.inventoryEdit = async (req, res) => {
  const inventory = new Inventory({
    email: req.body.email,
    username: req.body.username,
    totalItems: req.body.totalItems,
    itemName: req.body.itemName,
  });

  inventory.updateOne((err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  })
};

///////////////////////////////////////  Alumni /////////////////////////////////////

exports.alumnidetails = (req, res) => {
  console.log(req.headers["slug"]);
  User.find(
    {activeStatus: false},
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
