// server/utils/uploadToCloudinary.js
const cloudinary = require("../configs/cloudinary");

/**
 * Upload a single buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
const uploadToCloudinary = (buffer, folder = "zameen360/properties") => {
  return new Promise((resolve, reject) => {

    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      return reject(new Error("Invalid or empty buffer provided"));
    }
    
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto:good" }, // Auto compress
          { fetch_format: "auto" }, // Auto format (webp on modern browsers)
        ],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      },
    );

    stream.end(buffer);
  });
};

/**
 * Upload multiple buffers to Cloudinary
 * @param {Express.Multer.File[]} files - Array of multer files
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string[]>} - Array of secure URLs
 */
const uploadMultipleToCloudinary = async (
  files,
  folder = "zameen360/properties",
) => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder),
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary by URL
 * @param {string} url - Cloudinary secure URL
 */
const deleteFromCloudinary = async (url) => {
  try {
    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.jpg
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return;

    // Remove version (v123) if present
    const pathParts = parts.slice(uploadIndex + 1);
    if (pathParts[0].startsWith("v")) pathParts.shift();

    // Remove file extension
    const publicId = pathParts.join("/").replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary delete failed:", err.message);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
};
