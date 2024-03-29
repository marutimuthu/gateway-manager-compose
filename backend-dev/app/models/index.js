const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["user", "admin", "moderator"];

db.data = require("./data.model.js")(mongoose);
db.device = require("./device.model.js")(mongoose);
db.activity = require("./activity.model.js")(mongoose);
db.file = require("./file.model.js")(mongoose);
db.logs = require("./logs.model.js")(mongoose);

module.exports = db;
