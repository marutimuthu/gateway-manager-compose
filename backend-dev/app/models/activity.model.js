module.exports = mongoose => {

    var schema = mongoose.Schema(
        {
            deviceID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Device' //relation betwen the device and the user
            },
            activity: String,
            old_value: String,
            new_value: String,
            type: String
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Activity = mongoose.model("Activity", schema);
    return Activity;
};