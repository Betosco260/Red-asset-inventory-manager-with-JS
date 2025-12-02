// models/Baseline.js
const mongoose = require("mongoose");

const BaselineSchema = new mongoose.Schema({
    assetId: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ["server", "router", "firewall", "switch"],
        required: true,
    },

    // Un solo campo dinámico según tipo
    config: {
        type: Object,
        required: true,
    },

    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Baseline", BaselineSchema);
