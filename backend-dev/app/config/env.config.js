const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.dev`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  AUTH_SECRET: process.env.AUTH_SECRET,
  BROKER_URL: process.env.BROKER_URL,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DB: process.env.MONGO_DB,
  MONGO_UPLOADS_DB: process.env.MONGO_UPLOADS_DB,
  MONGO_UPLOADS_BUCKET: process.env.MONGO_UPLOADS_BUCKET,
  BROKER_USERNAME: process.env.BROKER_USERNAME,
  BROKER_PASSWORD: process.env.BROKER_PASSWORD,
  ORIGIN: process.env.ORIGIN,
  BASE_URL: process.env.BASE_URL
};