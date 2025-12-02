const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/assetController");

router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getOne ? controller.getOne : async (req,res)=>res.status(501).json({msg:"not implemented getOne"})); // si tenías getOne en S1, déjalo; sino placeholder
router.get("/:id/estado", auth, controller.getEstado); // <-- NUEVA RUTA
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.delete);

module.exports = router;
