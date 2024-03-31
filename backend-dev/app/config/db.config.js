const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const { MONGO_URI, MONGO_DB } = require("./env.config");

const db = require("../models");
const Role = db.role;
const User = db.user;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(MONGO_URI + MONGO_DB, {
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `🚀 MongoDB Connected: [ ${conn.connection.host} - ${conn.connection.name} ]`
    );
    initial();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });

      // Add admin account
      new User({
        username: "admin",
        email: "admin",
        password: bcrypt.hashSync("1234", 8),
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("admin user added");
      });
    }
  });
}

module.exports = connectDB;
