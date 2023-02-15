const db = require("../models");
const Inventory = db.inventory;

exports.inventoryAdd = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const inventory = new Inventory({
    email: req.body.email,
    username: req.body.username,
    totalItems: req.body.totalItems,
    itemName: req.body.itemName,
  });
  Inventory.find({ username: username, email: email }, (error, response) => {
    if (error) {
      res.status(500).send({ err: "error", message: error });
      return;
    }
    if (response) {
      res.status(400).send({
        err: "error",
        message: "Failed! Inventory user is already exist!",
      });
    }
    if (response == null || response == "") {
      inventory.save(
        { $ne: { email: req.body.email, username: req.body.username } },
        (err, result) => {
          if (err) {
            res.status(500).send({ err: "error", message: err });
            return;
          }
          res.send({ message: "Success! Inventory added successfully|" });
        }
      );
    }
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
  const id = req.body.username;
  const inventory = {
    email: req.body.email,
    username: req.body.username,
    totalItems: req.body.totalItems,
    itemName: req.body.itemName,
  };
  Inventory.updateOne({ username: id }, { $set: inventory }, (err, result) => {
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
