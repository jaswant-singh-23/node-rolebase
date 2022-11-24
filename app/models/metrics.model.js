const mongoose = require("mongoose");

const Metrics = mongoose.model(
  "Metrics",
  new mongoose.Schema({
    id: String,
    metric: String,
    weightage: Number,
    customerview: String,
  },
  {timestamps: true}
  )
);

module.exports = Metrics;
