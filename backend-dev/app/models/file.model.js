module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      createdAt: {
        type: Date,
        default: Date.now,
      },
      name: {
        type: String,
        required: [true, "Uploaded file must have a name"],
      },
      type: String,
      size: Number,
      deviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const File = mongoose.model("File", schema);
  return File;
};