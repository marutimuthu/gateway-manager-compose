const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const { PORT, ORIGIN } = require("./config/env.config");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const basicAuth = require('express-basic-auth');
const options = require("./config/swagger.config.js");
const specs = swaggerJsdoc(options);
const swaggerUiOptions = {
  explorer: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/api-docs",
  basicAuth({
    users: { admin: "1234" },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(specs, swaggerUiOptions)
);

var corsOptions = {
  origin: ORIGIN,
};
app.use(cors(corsOptions));

const connectDB = require("./config/db.config.js");
require("./routes/1.auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/2.device.routes")(app);
require("./routes/4.activity.routes")(app);
require("./routes/3.log.routes")(app);
require("./routes/data.routes")(app);
require("./routes/5.file.routes")(app);
connectDB();

const connectMQTT = require("./config/mqtt.config.js");

app.listen(PORT, () => {
  console.log(`🚀 Server Started. API Docs: [ http://localhost:${PORT}/api-docs ]`);
});