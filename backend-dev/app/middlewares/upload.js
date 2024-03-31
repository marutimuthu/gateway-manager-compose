const { MONGO_URI, MONGO_UPLOADS_DB} = require("../config/env.config");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create storage engine
const multerStorage = new GridFsStorage({
  url: MONGO_URI+MONGO_UPLOADS_DB,
  options: {
    authSource: "admin",
  },
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads", // Must match the collection name used with gfs
      metadata: {
        deviceID: req.params.deviceID ? req.params.deviceID : null,
      },
    };
  },
});

// Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  // fileFilter: multerFilter,
});

module.exports = upload;
