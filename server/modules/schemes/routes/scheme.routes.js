const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = require("../../../configs/prisma");
const authenticate = require("../../auth/middlewares/auth.middleware");
const upload = require("../middleware/upload");
const schemeController = require("../controller/scheme.controllers");

// File fields to accept
const uploadFields = upload.fields([
  { name: "cnicFront", maxCount: 1 },
  { name: "cnicBack", maxCount: 1 },
  { name: "companyRegistration", maxCount: 1 },
  { name: "ntnCertificate", maxCount: 1 },
  { name: "authorityLetter", maxCount: 1 },
  { name: "nocCopy", maxCount: 1 },
  { name: "ownershipDocuments", maxCount: 1 },
  { name: "fardRegistry", maxCount: 1 },
  { name: "landTransfer", maxCount: 1 },
]);

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (user?.isActive) req.user = user;
  } catch (error) {
    req.user = undefined;
  }

  next();
};

// ─── USER ROUTES ─────────────────────────────────────────────────────────────
router.post(
  "/applications",
  optionalAuthenticate,
  uploadFields,
  schemeController.createApplication
);

router.get(
  "/applications/me",
  authenticate,
  schemeController.getUserApplications
);

router.put(
  "/applications/:id",
  authenticate,
  uploadFields,
  schemeController.updateApplication
);

router.patch(
  "/applications/:id/cover",
  authenticate,
  upload.single("coverImage"),
  schemeController.updateSocietyCover
);

router.post(
  "/setup-password",
  schemeController.setupSocietyOwnerPassword
);

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────
router.get(
  "/admin/applications",
  schemeController.getAllApplications
);

router.get(
  "/admin/applications/:id",
  schemeController.getApplicationById
);

router.patch(
  "/admin/applications/:id/status",
  schemeController.updateApplicationStatus
);

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────
router.get(
  "/public",
  schemeController.getPublicSocieties
);

router.get(
  "/public/:id",
  schemeController.getPublicSocietyById
);

module.exports = router;
