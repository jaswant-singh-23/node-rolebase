const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
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
  });

  user.save((err, user) => {
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

            res.send({ message: "User was registered successfully!" });
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
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.addUser = async (req, res) => {
  const reader = require("xlsx");

  // const file = reader.readFile("app/public/excel/Book1.xlsx");
  const file = reader.readFile(req.file.destination + "/" + req.file.filename);

  let data = [];

  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  data = temp;

  data.forEach(async (item) => {
    User.find(
      { email: item.email, username: item.username },
      function (err, obj) {
        if (obj.length == 0 || obj.length == null) {
          const user = new User({
            avatar: "",
            name: item.name,
            username: item.username,
            email: item.email,
            phone: item.phone,
            password: bcrypt.hashSync(item.password.toString(), 8),
            designation: item.designation,
            department: item.department,
            dateofjoining: item.dateofjoining,
            currentCTC: item.currentCTC,
            panCard: item.panCard,
            aadharcard: item.aadharcard,
            address: item.address,
            dateofbirth: item.dateofbirth,
            bankDetail: item.bankDetail,
            activeStatus: true,
          });
          console.log('==================', user)
          user.save(function (err, user) {
            if (err) {
              return res.status(500).send({
                message: err.message || "some error occured",
              });
            }
            if (item.roles) {
              Role.find(
                {
                  name: { $in: item.roles },
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
                    res.send({ message: "User was registered successfully!" });
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
                  res.send({ message: "User was registered successfully!" });
                });
              });
            }
          });
        }
      }
    );
  });
};

exports.signin = (req, res) => {
  console.log("_____", req.body);
  User.findOne({
    username: req.body.username,
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

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      if (user.roles.length) {
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: authorities,
        accessToken: token,
        message: "User was signin successfully!",
      });
    });
};


