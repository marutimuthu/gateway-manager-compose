const db = require("../models");
const Device = db.device;
const User = db.user;
const Logs = db.logs;

const client = require("../config/mqtt.config.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var Haikunator = require("haikunator");
var haikunator = new Haikunator();
// console.log(haikunator.haikunate({ tokenLength: 0 })) // => "cold-wildflower")

exports.register = (req, res) => {
  if (
    req.body.email == "" ||
    req.body.email == undefined ||
    req.body.password == "" ||
    req.body.password == undefined
  ) {
    res.status(400).send({ message: "Request Failed" });
    return;
  }

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
        return res.status(400).send({ message: "Request Failed" });
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

      var token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      // Auth done!
      if (req.body.data.mac_id !== undefined) {
        // Check if device exists
        Device.findOne({
          mac_id: req.body.data.mac_id,
        }).exec((err, device) => {
          // console.log(device)
          if (err) {
            res.status(500).send({ message: "Internal Server Error" });
            return;
          }

          if (device) {
            // If device exists
            // Device object ID is added to user schema
            User.findOneAndUpdate(
              { _id: user._id },
              { $addToSet: { devices: device._id } },
              function (error, success) {
                if (error) {
                  // console.log(error);
                  res.status(500).send({ message: "Internal Server Error" });
                  return;
                } else {
                  // console.log(success);
                  // res.status(200).send({ message: success });
                  return res.status(201).send({
                    message: "Device Registered",
                    data: {
                      deviceId: `${device._id}`,
                      accessToken: token,
                    },
                  });
                }
              }
            );
          } else {
            // If device does not exist create device
            var new_device = req.body.data;
            var _test = new_device;
            if (!req.body.data.name) {
              _test = Object.assign(new_device, {
                name: haikunator.haikunate(),
              });
            }
            // console.log(_test)
            const device = new Device(_test);

            device
              .save(device)
              .then((data) => {
                // console.log(data)
                // Device object ID is added to user schema
                User.findOneAndUpdate(
                  { _id: user._id },
                  { $push: { devices: data._id } },
                  function (error, success) {
                    if (error) {
                      res.status(500).send({ message: error });
                      console.log(error);
                    } else {
                      // res.status(200).send({ message: success });
                      // console.log(success);
                      res.status(201).send({
                        message: "Device Registered",
                        data: {
                          deviceId: `${device._id}`,
                          accessToken: token,
                        },
                      });
                    }
                  }
                );
              })
              .catch((err) => {
                // console.log("not ok")
                res.status(500).send({
                  message: "Internal Server Error",
                });
              });
          }
        });
      } else {
        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
};

// Find all user devices
exports.findByOIDarray = async (req, res) => {
  const user_id = req.params.userId;

  try {
    const data = await User.findById(user_id);
    // .equals(device_id)

    if (!data) {
      res.status(404).send({ message: "Invalid id" });
    } else {
      const devices = await Device.find({ _id: { $in: data.devices } });
      res.send({ data: devices });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Find a single Devoce with an id
exports.findDevice = async (req, res) => {
  const id = req.params.deviceId;

  try {
    const data = await Device.find({ _id: id });
    // .equals(device_id)

    if (!data) res.status(404).send({ message: "Device Not Found" });
    else res.send({ data: data });

    // console.log(data)
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Update a device by the id in the request
exports.update = (req, res) => {
  if (!req.body || !req.body.data) {
    return res.status(400).send({
      message: "Request Failed",
    });
  }

  const id = req.params.deviceId;
  var data = { ...req.body.data, timestamp: Math.floor(Date.now()) };
  const logs = new Logs(data);
  console.log(id);
  console.log(req.body.data);
  logs
    .save(logs)
    .then((data) => {
      //  console.log(data)
      // res.send(data);
    })
    .catch((err) => {
      console.log({
        message: "Request Failed",
      });
    });

  // console.log(req.body)

  Device.findByIdAndUpdate(id, req.body.data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        // console.error(req.body)
        res.status(400).send({
          message: `Request Failed`,
        });
      } else {
        // console.log(req.body)
        // console.log("Updated " + data.updatedAt)
        // console.log("Updated " + data)
        res.send({ message: "Received" });
      }
      // } else res.send({ message: "device was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
      });
    });
};

// Delete a device with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.deviceId;
  if (
    req.body.email == "" ||
    req.body.email == undefined ||
    req.body.password == "" ||
    req.body.password == undefined
  ) {
    res.status(400).send({ message: "Request Failed" });
    return;
  }

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
        return res.status(400).send({ message: "Request Failed" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password",
        });
      } else {
        // Passoword Valid
        console.log(user._id);
        Device.findByIdAndRemove(id)
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Device not found`,
              });
            } else {
              User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { devices: id } },
                { new: true },
                function (error, success) {
                  if (error) {
                    res.status(500).send({ message: "Internal Server Error" });
                    return;
                  } else {
                    return res.status(200).send({
                      message: "Device Deleted",
                    });
                  }
                }
              );
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Internal Server Error",
            });
          });
      }
    });
};

// Publish MQTT command
exports.mqttCommand = async (req, res) => {
  const id = req.params.deviceId;
  if (!id) {
    res.status(400).send({ message: "" });
    return;
  }
  let mqtt_check = 0;

  if (client.connected) {
    var topic = id + "/" + "cmd";
    client.publish(topic, JSON.stringify(req.body));
    res.status(200).send({ message: "Command Received" });
  } else {
    var mqttCheckConnection = setInterval(() => {
      mqtt_check++;
      if (client.connected) {
        clearInterval(mqttCheckConnection);
        var topic = id + "/" + "cmd";
        client.publish(topic, JSON.stringify(req.body));
        res.status(200).send({ message: "Command Received" });
      }
      if (mqtt_check > 5) {
        clearInterval(mqttCheckConnection);
        res.status(400).send({ message: "Broker not connected" });
      }
    }, 500);
  }
};

// Create and Save a new device
exports.ota = (req, res) => {
  // Validate request
  if (!req.body.mac_id) {
    res.status(400).send({ message: "mac_id can not be empty!" });
    return;
  }

  if (client.connected == true) {
    // console.log(req.body)
    var topic = req.body.mac_id + "/" + "cmd";
    // MT OTA URL
    // var msg = `{"OTA_URL":"${req.body.server_url}/api/file/download/${req.body.bin_file}"}`
    // setTimeout(() => {
    //     msg = `{"START_OTA"}`;
    //     client.publish(topic, msg);
    // }, 500);

    var msg = `{"action":"ota","url":"${req.body.server_url}/api/file/download/${req.body.bin_file}"}`;
    client.publish(topic, msg);
    res.status(200).send({ message: "OTA initiated" });
  } else {
    res.status(400).send({ message: "Broker not connected" });
  }
  // Save Log of OTA Update
  // const device = new Device(req.body);
  // device
  //     .save(device)
  //     .then(data => {
  //         res.send(data);
  //     })
  //     .catch(err => {
  //         res.status(500).send({
  //             message:
  //                 err.message || "Some error occurred while creating the device."
  //         });
  //     });
};
