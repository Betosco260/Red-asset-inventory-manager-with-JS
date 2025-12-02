const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const compareRoutes = require("./routes/compareRoutes");

const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// rutas
app.use("/auth", authRoutes);
app.use("/activos", assetRoutes);
app.use("/comparar", compareRoutes);

// health
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "S1 API/CRUD" });
});

const PORT = 4001;
app.listen(PORT, () => {
    console.log(`S1 corriendo en http://localhost:${PORT}`);
});
