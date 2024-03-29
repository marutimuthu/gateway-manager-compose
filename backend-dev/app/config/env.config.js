const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  AUTH_SECRET: process.env.AUTH_SECRET,
  BROKER_URL: process.env.BROKER_URL,
  BROKER_USERNAME: process.env.BROKER_USERNAME,
  BROKER_PASSWORD: process.env.BROKER_PASSWORD,
  ORIGIN: process.env.ORIGIN
};