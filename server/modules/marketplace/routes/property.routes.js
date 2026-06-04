const express = require("express");
const router = express.Router();
const { uploadProperty } = require("../middleware/upload");
const  authenticate  = require("../../auth/middlewares/auth.middleware");
const propertyController = require("../Controller/property.controllers");

// ==================== PUBLIC ROUTES ====================

// Create property (user submit karta hai - status pending)
router.post(
  "/",
   authenticate,
  uploadProperty.array("images", 30),
  propertyController.createProperty
);

// Get all approved properties (public)
router.get("/", propertyController.getProperties);

// ==================== ⭐ ADMIN ROUTES (upar rakho warna :id ma fas jayenge) ====================

// Admin - Dashboard stats
router.get("/admin/stats", propertyController.getDashboardStats);

// Admin - Get all properties (with filter by status)
router.get("/admin/all", propertyController.getAdminProperties);

// Admin - Update property status (approve/reject)
router.put("/admin/:id/status", propertyController.updatePropertyStatus);

// ==================== ID ROUTES (niche rakho) ====================

// Get by ID
router.get("/:id", propertyController.getPropertyById);

// Update full property
router.put(
  "/:id",
  uploadProperty.array("images", 30),
  propertyController.updateProperty
);

// Delete
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;