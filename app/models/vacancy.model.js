const mongoose = require("mongoose");

const Vacancy = mongoose.model(
  "Vacancy",
  new mongoose.Schema(
    {
      id: {
        type: Number,
        unique: true,
      },
      username: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        required: true,
      },
      experience: {
        type: String,
        required: true,
      },
      totalVacancy: {
        type: String,
      },
      description: {
        type: String,
      },
      positionActive: {
        type: Boolean,
      },
    },
    { timestamps: true }
  )
);

module.exports = Vacancy;
