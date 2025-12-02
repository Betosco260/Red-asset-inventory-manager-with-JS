// S2 - server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const monitorRoutes = require("./controllers/monitorController");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/rpc", monitorRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "S2 RPC Monitoreo" });
});

const PORT = 4002;
app.listen(PORT, () => {
    console.log(`S2 RPC Monitoreo corriendo en http://localhost:${PORT}`);
});
