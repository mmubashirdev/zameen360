const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const c = require("../controllers/profile.controller");

const auth = require("../middlewares/auth.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profiles/"),
  filename: (req, file, cb) => cb(null, `profile_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/profile", auth, c.getProfile);
router.put("/profile/update", auth, c.updateProfile);
router.post("/profile/upload-picture", auth, upload.single("profilePicture"), c.uploadPicture);
router.delete("/profile/remove-picture", auth, c.removePicture);
router.get("/profile", auth, c.getProfile);
module.exports = router;