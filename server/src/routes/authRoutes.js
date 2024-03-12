// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/create-account", authController.createAccount);
router.post("/login", authController.login);
// Add routes for password recovery, etc.

module.exports = router;
