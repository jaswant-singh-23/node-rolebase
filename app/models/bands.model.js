const mongoose = require("mongoose");

const Bands = mongoose.model(
    "Bands",
    new mongoose.Schema({
        id: Number,
        name: String,
        minRange: Number,
        maxRange: Number,
        status: String,
    },
        { timestamps: true }
    )
);

module.exports = Bands;
