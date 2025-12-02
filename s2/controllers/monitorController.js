// controllers/monitorController.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const monitorService = require("../services/monitorService");

router.post("/get_status", auth, async (req, res) => {
    const { ip, assetId } = req.body || {};
    if (!ip && !assetId) return res.status(400).json({ error: "Falta ip o assetId" });

    try {
        const result = await monitorService.getStatus({ ip, assetId, callerToken: req.headers["authorization"] });
        res.json(result);
    } catch (err) {
        console.error("get_status error:", err);
        res.status(500).json({ error: "Error interno S2" });
    }
});

router.post("/discover", auth, async (req, res) => {
    try {
        const result = await monitorService.discover({ networkSegment: req.body.networkSegment });
        res.json(result);
    } catch (err) {
        console.error("discover error:", err);
        res.status(500).json({ error: "Error interno S2" });
    }
});

module.exports = router;
