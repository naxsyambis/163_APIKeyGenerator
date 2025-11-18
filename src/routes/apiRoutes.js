const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// Route untuk generate dan save API Key (Step 1)
router.post("/generate-key", apiController.createApiKey);

module.exports = router;