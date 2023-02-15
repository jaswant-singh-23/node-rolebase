const db = require("../models");
const Vacancy = db.vacancy;

exports.vacancyDetails = (req, res) => {
  Vacancy.find({ positionActive: true }, (err, result) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!result) {
      return res.status(404).send({ message: "Result Not found." });
    }

    res.status(200).send({
      data: result,
      message: "success",
    });
  });
};
exports.addnewVacancy = async (req, res) => {
  const username = req.headers["slug"];
  const vacancy = new Vacancy({
    username: username,
    position: req.body.position,
    experience: req.body.experience,
    totalVacancy: req.body.totalVacancy,
    positionActive: true,
  });
  vacancy.save((err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.send({ message: "success", data: result });
  });
};
exports.vacancyDelete = async (req, res) => {
  const id = req.body.id;

  User.deleteOne({ id: id }, (err, result) => {
    if (err) {
      res.status(500).send({ err: "error", message: err });
      return;
    }
    res.status(200).send({
      data: result,
      message: "Employee account delete successfully",
    });
  });
};
