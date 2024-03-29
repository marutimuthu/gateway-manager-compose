module.exports = app => {
    const logs = require("../controllers/device_logs.controller.js");

    var router = require("express").Router();
     
    router.post("/", logs.create);

    // Retrieve all gateways from user device array
    router.get("/:mac_id", logs.findByMacid); 
    
    // Retrieve throughput and activities
    router.get("/getstats/:mac_id", logs.getstats); 
    
    router.get("/rssi/:mac_id", logs.findRSSIByMacid); 

    app.use('/api/logs', router);
};
