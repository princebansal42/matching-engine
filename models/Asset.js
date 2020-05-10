const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
        },
        tradable: {
            type: Boolean,
            required: true,
            default: true,
        },
        ltp: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Asset = mongoose.model("asset", assetSchema);
module.exports = Asset;
