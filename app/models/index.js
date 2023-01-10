const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.leave = require("./leave.model");
db.profile = require("./profile.model");
db.inventory = require("./inventory.model");
db.vacancy = require("./vacancy.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
