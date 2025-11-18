const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route untuk simpan user (Step 2)
router.post("/register", userController.createUser);

module.exports = router;