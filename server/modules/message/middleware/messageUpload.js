const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImages = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  const allowedVideos = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
  if ([...allowedImages, ...allowedVideos].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPG, PNG, WEBP, GIF) and videos (MP4, WEBM, MOV, AVI) are allowed"), false);
  }
};

// 50MB cap at multer level — actual per-type limits enforced in controller
const uploadMessageMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = { uploadMessageMedia };
