const db = require("../models");
const Logs = db.logs;

// Create and Save a log
exports.create = (req, res) => {
  // Validate request
  if (!req.params.deviceID) {
    res.status(400).send({ message: "deviceID can not be empty" });
    return;
  }
  const deviceID = { deviceID: req.params.deviceID };
  const data = { ...req.body, ...deviceID };
  const logs = new Logs(data);

  // Save device in the database
  logs
    .save(logs)
    .then((data) => {
      // console.log(data);
      res.status(200).send({ message: "Received" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
      });
    });
};

exports.findByID = async (req, res) => {
  const deviceID = req.params.deviceID;

  if (!deviceID) {
    res.status(400).send({ message: "deviceID can not be empty" });
    return;
  }

  try {
    const data = await Logs.find({ deviceID: deviceID }).sort("-createdAt");
    if (!data) res.status(404).send({ message: "Logs Not Found" });
    else {
      const page = parseInt(req.query.page || 1);
      const limit = parseInt(req.query.limit || 50);

      // calculating the starting and ending index
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (endIndex < data.length) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      results.data = data.slice(startIndex, endIndex);

      res.status(200).send(results);
    }

    // console.log(data)
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getstats = async (req, res) => {
  const deviceID = req.params.deviceID;
  if (!deviceID) {
    res.status(400).send({ message: "deviceID can not be empty" });
    return;
  }

  // Get the current date and time
  const dateObj = new Date();

  // Note: Currently date is in UTC Format. To convert to IST uncomment following lines
  // Calculate the IST offset in minutes (+5 hours and 30 minutes)
  // const istOffsetMinutes = 330;
  // Adjust the date's UTC time by adding the IST offset
  // dateObj.setUTCMinutes(dateObj.getUTCMinutes() + istOffsetMinutes);

  // get past hour date
  const pastHour = new Date(dateObj.getTime() - 1 * 60 * 60 * 1000);
  // get past day date
  const pastDay = new Date(dateObj.getTime() - 1 * 24 * 60 * 60 * 1000);
  // get past week date
  const pastWeek = new Date(dateObj.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    const activity_1h = await Logs.countDocuments({
      deviceID: deviceID,
      createdAt: {
        $gte: pastHour,
        $lt: dateObj,
      },
    });

    const activity_7d = await Logs.countDocuments({
      deviceID: deviceID,
      createdAt: {
        $gte: pastWeek,
        $lt: dateObj,
      },
    });

    const activity_24h = await Logs.countDocuments({
      deviceID: deviceID,
      createdAt: {
        $gte: pastDay,
        $lt: dateObj,
      },
    });

    res.json({
      data: {
        throughput_1h: ((activity_1h / 60) * 100).toFixed(2), // Percentage of pings recevied every minute in 1d
        throughput_24h: ((activity_24h / 24 / 60) * 100).toFixed(2), // Percentage of pings recevied every minute in 24h
        throughput_7d: ((activity_7d / 7 / 24 / 60) * 100).toFixed(2), // Percentage of pings recevied every minute in 7d
      },
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};
