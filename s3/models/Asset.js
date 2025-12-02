const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ip: { type: String, required: true },
    type: { type: String, enum: ["server", "router", "firewall", "switch"], required: true },
    description: String
});

module.exports = mongoose.model("Asset", assetSchema);
