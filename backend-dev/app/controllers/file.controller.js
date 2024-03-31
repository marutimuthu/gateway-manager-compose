const db = require("../models");
const File = db.file;
const { MONGO_URI, BASE_URL, MONGO_UPLOADS_DB, MONGO_UPLOADS_BUCKET } = require("../config/env.config");
const baseUrl = BASE_URL + "api/file/download/";

const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const mongoClient = new MongoClient(MONGO_URI+MONGO_UPLOADS_DB, { authSource: "admin" });

// Create and save new file record
exports.create = async (req, res) => {
  const _file = {
    name: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size,
    fileId: req.file.id,
    deviceID: req.params.deviceID,
  };
  // console.log(req.body.user_id)
  const file = new File(_file);

  // Save device in the database
  file
    .save(file)
    .then((data) => {
      res.status(200).send({
        message: "File Uploaded",
      });
    })
    .catch((err) => {
      res.status(500).send({
        // message: err.message || "Some error occurred while creating the file."
        message: "Internal Server Error",
      });
    });
};

// Find a single file with an id
exports.getAllFiles = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(MONGO_UPLOADS_DB);
    const images = database.collection(MONGO_UPLOADS_BUCKET + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        id: doc._id,
        name: doc.filename,
        uploadDate: doc.uploadDate,
        contentType: doc.contentType,
        deviceID: doc.metadata.deviceID,
        url: baseUrl + doc._id,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (err) {
    // console.log(err);
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};

// Donwload file
exports.download = async (req, res) => {
  try {
    const fileId = req.params.fileID;
    // console.log(fileId)
    await mongoClient.connect();

    const database = mongoClient.db(MONGO_UPLOADS_DB);
    const bucket = new GridFSBucket(database, {
      bucketName: MONGO_UPLOADS_BUCKET,
    });

    let downloadStream = bucket.openDownloadStream(
      mongoose.Types.ObjectId(fileId)
    );

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      console.log(err);
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

// Find a single file with an id
exports.delete = async (req, res) => {
  const fileID = req.params.fileID;

  try {
    await mongoClient.connect();
    const database = mongoClient.db(MONGO_UPLOADS_DB);
    // const images = database.collection(dbConfig.imgBucket + ".files");
    
    const bucket = new GridFSBucket(database, {
      bucketName: MONGO_UPLOADS_BUCKET + ".files",
    });
    
    bucket.delete(mongoose.Types.ObjectId(fileID));

    console.log("File deleted successfully.");
    return res.status(200).send({ message: "deleted" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};

// Find a single file with an id
exports.getOneFile = async (req, res) => {
  const deviceID = req.params.deviceID;

  try {
    await mongoClient.connect();
    // console.log(user_id)

    const database = mongoClient.db(MONGO_UPLOADS_DB);
    const images = await database
      .collection(MONGO_UPLOADS_BUCKET + ".files")
      .findOne({ _id: mongoose.Types.ObjectId(deviceID) });
    console.log(images);
    return res.status(200).send(images);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error retrieving data id: " + err.message });
  }
};
