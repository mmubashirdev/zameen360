// server/utils/uploadToCloudinary.js
const cloudinary = require("../configs/cloudinary");
const fs = require("fs");

// Upload from buffer (memoryStorage)
const uploadToCloudinary = (buffer, folder = "zameen360/properties") => {
  return new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      return reject(new Error("Invalid or empty buffer provided"));
    }
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        if (error)
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        else resolve(result.secure_url);
      },
    );
    stream.end(Buffer.from(buffer));
  });
};

// ✅ Upload from file path (diskStorage) — NEEDED for panoramas
const uploadToCloudinaryFromPath = (
  filePath,
  folder = "zameen360/properties",
) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }

    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        // Always delete temp file after upload
        try {
          fs.unlinkSync(filePath);
        } catch {
          /* ignore */
        }

        if (error)
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        else resolve(result.secure_url);
      },
    );
  });
};

const uploadMultipleToCloudinary = async (
  files,
  folder = "zameen360/properties",
) => {
  return Promise.all(files.map((f) => uploadToCloudinary(f.buffer, folder)));
};

const deleteFromCloudinary = async (url) => {
  try {
    if (!url || !url.includes("cloudinary.com")) return;
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return;
    const pathParts = parts.slice(uploadIndex + 1);
    if (pathParts[0].startsWith("v")) pathParts.shift();
    const publicId = pathParts.join("/").replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary delete failed:", err.message);
  }
};

// ✅ Must export ALL functions
module.exports = {
  uploadToCloudinary,
  uploadToCloudinaryFromPath,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
};
