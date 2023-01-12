const mongoose = require("mongoose");

const Vacancy = mongoose.model(
  "Vacancy",
  new mongoose.Schema({
    username: String,
    position: String,
    experience: String,
    totalVacancy: String,
    positionActive: Boolean,
  },
    { timestamps: true })
);
module.exports = Vacancy;
