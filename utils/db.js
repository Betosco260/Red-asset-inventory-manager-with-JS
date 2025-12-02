const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/s3_resources");
        console.log("MongoDB conectado (S3)");
    } catch (error) {
        console.error("Error al conectar MongoDB:", error);
    }
};

module.exports = { connectDB };
