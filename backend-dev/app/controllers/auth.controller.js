const { AUTH_SECRET } = require("../config/env.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  if (req.body.username == "" || req.body.email == "" || req.body.username == undefined || req.body.email == undefined ) {
    res.status(400).send({ message: "Request Failed" });
    return;
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    phoneno: req.body.phoneno,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: "Internal Server Error" });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: "Internal Server Error" });
              return;
            }

            res
              .status(200)
              .send({ message: "User was registered successfully" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: "Internal Server Error" });
            return;
          }
          res
            .status(201)
            .send({ message: "User was registered successfully" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  if (req.body.email == '' || req.body.email == undefined) {
    return res.status(400).send({ message: "Request failed" })
  } else {
    User.findOne({
      email: req.body.email,
    })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }
  
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            message: "Invalid Password",
          });
        }
  
        var token = jwt.sign({ id: user.id }, AUTH_SECRET, {
          expiresIn: 86400, // 24 hours
        });
  
        var authorities = [];
  
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          devices: user.devices,
          roles: authorities,
          accessToken: token,
        });
      });
  }
};
