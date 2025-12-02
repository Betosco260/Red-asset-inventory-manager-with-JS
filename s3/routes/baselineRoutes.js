// routes/baselineRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const baselineController = require("../controllers/baselineController");

// Crear baseline
router.post("/baseline", auth, baselineController.crearBaseline);

// Obtener baseline por assetId
router.get("/baseline/:id", auth, baselineController.obtenerBaseline);

// Actualizar baseline
router.put("/baseline/:id", auth, baselineController.actualizarBaseline);

// Listar todas las baselines (cliente móvil)
router.get("/baselines", auth, baselineController.listarBaselines);

module.exports = router;
