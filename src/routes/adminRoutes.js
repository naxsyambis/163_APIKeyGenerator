const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authAdmin = require("../middleware/authAdmin"); // Middleware Anda

// Auth
router.post("/register", adminController.register);
router.post("/login", adminController.login);

// Dashboard Data (Perlu Login)
router.get("/dashboard", authAdmin, adminController.getDashboardData);

// CRUD Operations (Contoh: Delete)
router.delete("/delete/:id", authAdmin, adminController.deleteData);

module.exports = router;