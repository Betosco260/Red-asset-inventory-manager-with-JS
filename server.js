const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./utils/db");
const baselineRoutes = require("./routes/baselineRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

connectDB();

// rutas de baseline
app.use("/", baselineRoutes);

// rutas de inventario
app.use("/inventory", inventoryRoutes);

// health
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "S3 Recursos/Baseline+Inventory" });
});

const PORT = 4003;
app.listen(PORT, () => {
    console.log(`S3 corriendo en http://localhost:${PORT}`);
});
