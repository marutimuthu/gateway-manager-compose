const db = require("../models");
const Activity = db.activity;

const paginatedResults = require("../middlewares/paginate");

// Create and Save a new device
exports.create = (req, res) => {
  // Validate request
  if (!req.body.deviceID) {
    res.status(400).send({ message: "deviceID can not be empty" });
    return;
  }

  const activity = new Activity(req.body);

  // Save device in the database
  activity
    .save(activity)
    .then((data) => {
      console.log(data);
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
  // const device_id = req.params.device_id;
  if (!deviceID) {
    res.status(400).send({ message: "deviceID can not be empty" });
    return;
  }

  try {
    const data = await Activity.find({ deviceID: deviceID }).sort("-createdAt");
    if (!data) res.status(404).send({ message: "Activity Not Found" });
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
    const activity_7d = await Activity.countDocuments({
      deviceID: deviceID,
      createdAt: {
        $gte: pastWeek,
        $lt: dateObj,
      },
    });

    const activity_24h = await Activity.countDocuments({
      deviceID: deviceID,
      createdAt: {
        $gte: pastDay,
        $lt: dateObj,
      },
    });

    res.json({ data : {
      activity_past_7d: activity_7d,
      activity_past_24h: activity_24h,
    }});
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};