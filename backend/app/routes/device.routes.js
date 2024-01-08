module.exports = (app) => {
  const device = require("../controllers/device.controller.js");

  var router = require("express").Router();

  router.post("/", device.create); // Create Device
  
  router.get("/", device.findAll); // Retrieve all device
  
  router.get("/find/:mac_id", device.findByMacid); // Retrieve a single Device with id
  
  router.get("/:id", device.findByOIDarray); // Retrieve gateways from user device_ID array

  router.post("/ota", device.ota);

  // router.get("/:id", device.findOne); // Retrieve a single Device with id

  router.put("/:id", device.update); // Update using id

  router.post("/:id", device.update); // Update using id

  router.delete("/:id", device.delete); // Delete with id

  router.post("/config/update", device.mqttCommand); // Delete with id

  // router.delete("/", device.deleteAll);

  app.use("/api/device", router);
};
