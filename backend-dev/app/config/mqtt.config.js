var mqtt = require("mqtt");
const { BROKER_URL, BROKER_USERNAME, BROKER_PASSWORD } = require("./env.config");

const db = require("../models");
const Activity = db.activity;
const max_restart = 5;
var check_restart = 0;

// Broker config
const options = {
  clientId: "data_db",
  clean: true,
  username: BROKER_USERNAME,
  password: BROKER_PASSWORD,
};

// Connect to broker
var client = mqtt.connect(BROKER_URL, options);

let i = 0;
client.on("connect", function () {
  i ? 0 : console.log(`🚀 MQTT Broker Connected: [ ${BROKER_URL} ]`) | i++;
});

client.on("error", function (error) {
  console.error(error);
  if (!client.connected) {
    setTimeout(() => {
      client.end();
      check_restart++;
      console.log("Broker connection failed - Reattempting" + error);
      client = mqtt.connect(BROKER_URL, options);
      if (check_restart > max_restart) {
        console.log("Broker connection failed - Process Exit" + error);
        process.exit(1);
      }
    }, 500);
  }
});

// Subscribe
var topic_list = ["system/logs"];
client.subscribe(topic_list, { qos: 1 });

// Listener
client.on("message", function (topic, message, packet) {
  console.log("-[ message received: " + message + " at topic " + topic);
  // console.log(message)
  let rec_message = JSON.parse(message);
  const activity = new Activity(rec_message);

  // Save device in the database
  activity
    .save(activity)
    .then((data) => {
      // console.log(data)
      // res.send(data);
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).send({
      //     message:
      //         err.message || "Some error occurred while creating the log."
      // });
    });
});

module.exports = client;
