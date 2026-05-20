const express = require("express");
const router = express.Router();
const { uploadProperty } = require("../middleware/upload");
const propertyController = require("../Controller/property.controllers");

// ⭐ Create with image upload (max 30 files, field name "images")
router.post(
  "/",
  uploadProperty.array("images", 30),
  propertyController.createProperty
);

// Get all
router.get("/", propertyController.getProperties);

// Get by ID
router.get("/:id", propertyController.getPropertyById);

// Update
router.put(
  "/:id",
  uploadProperty.array("images", 30),
  propertyController.updateProperty
);

// Delete
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;