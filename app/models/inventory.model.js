const mongoose = require("mongoose");

const Inventory = mongoose.model(
  "Inventory",
  new mongoose.Schema({
    username:{
      type:String,
      required: true
    },
    email:{
      type:String,
      required: true,
    },
    totalItems:{
      type:Number,
      required: true,
    },
    itemName:{
      type:Array,
      required: true,
    },
  },{ timestamps: true })
);

module.exports = Inventory;