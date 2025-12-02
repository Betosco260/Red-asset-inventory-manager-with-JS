const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/compareController");

router.get("/:assetId", auth, controller.compare);

module.exports = router;
