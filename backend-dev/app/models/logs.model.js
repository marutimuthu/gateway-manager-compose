module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            deviceID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Device' //relation betwen the device and the user
            },
            timestamp: Date,
            data: Object,
            // metadata: Object,
            wifi_rssi: Number,
            lte_rssi: Number,
            lat: String,
            long: String
        },
        { timestamps: true },
        {
        timeseries: {
            timeField: 'timestamp',
            metaField: 'metadata',
            granularity: 'seconds'
        }
        // autoCreate: false,
        // expireAfterSeconds: 86400
        }
    ); 

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Logs = mongoose.model("Logs", schema);
    return Logs;
};