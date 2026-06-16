// server/modules/marketplace/routes/property.routes.js
const express = require("express");
const router = express.Router();
const { uploadProperty } = require("../middleware/upload");
const authenticate = require("../../auth/middlewares/auth.middleware");
const propertyController = require("../Controller/property.controllers");

// ✅ Separate multer instance for panoramas (diskStorage for Node v25)
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const panoramaDir = path.join(process.cwd(), "uploads", "panoramas", "temp");
if (!fs.existsSync(panoramaDir)) fs.mkdirSync(panoramaDir, { recursive: true });

const panoramaUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, panoramaDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, unique);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Images only"));
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB for panoramas
});

// ── PUBLIC ────────────────────────────────────────────────────────────────────
router.get("/", propertyController.getProperties);

// ── PROTECTED ─────────────────────────────────────────────────────────────────
router.post(
  "/",
  authenticate,
  uploadProperty.array("images", 30),
  propertyController.createProperty,
);

// ✅ Panorama upload — separate route with its own multer
router.post(
  "/:id/panoramas",
  authenticate,
  panoramaUpload.array("panoramas", 10), // ✅ panoramaUpload not uploadProperty
  propertyController.panorama,
);

// ── ADMIN ─────────────────────────────────────────────────────────────────────
router.get("/admin/stats", propertyController.getDashboardStats);
router.get("/admin/all", propertyController.getAdminProperties);
router.put("/admin/:id/status", propertyController.updatePropertyStatus);

// ── ID ROUTES ─────────────────────────────────────────────────────────────────
router.get("/:id", propertyController.getPropertyById);
router.put(
  "/:id",
  uploadProperty.array("images", 30),
  propertyController.updateProperty,
);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;
