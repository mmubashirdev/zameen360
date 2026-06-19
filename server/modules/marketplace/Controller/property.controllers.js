
const prisma = require("../../../configs/prisma");
const cloudinary = require("../../../configs/cloudinary");


const {
  uploadToCloudinaryFromPath,
} = require("../../../utils/uploadToCloudinary");


console.log(
  "Cloudinary upload_stream available:",
  typeof cloudinary.uploader?.upload_stream,
);


const toBigInt = (val) => {
  if (val === null || val === undefined || val === "") return null;
  try {
    const clean = String(val).replace(/,/g, "");
    if (clean === "" || isNaN(Number(clean))) return null;
    return BigInt(clean);
  } catch {
    return null;
  }
};

const parseAmenities = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toBool = (val) => {
  if (val === true || val === "true") return true;
  return false;
};

const serializeBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};

const uploadToCloudinary = (buffer, folder = "zameen360/properties") => {
  return new Promise((resolve, reject) => {
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
    stream.end(buffer);
  });
};

const uploadMultipleToCloudinary = async (
  files,
  folder = "zameen360/properties",
) => {
  const promises = files.map((file) => uploadToCloudinary(file.buffer, folder));
  return Promise.all(promises);
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

exports.panorama = async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const files = req.files || [];
    const roomNames = JSON.parse(req.body.roomNames || "[]");

    if (isNaN(propertyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID" });
    }

    if (files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No panorama files uploaded" });
    }

    const panoramas = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const roomName = roomNames[i] || `Room ${i + 1}`;

      // ✅ Use the CORRECT function — uploadToCloudinaryFromPath
      const imageUrl = await uploadToCloudinaryFromPath(
        file.path,
        "zameen360/panoramas",
      );

      const panorama = await prisma.panorama.create({
        data: {
          propertyId,
          roomName,
          imageUrl,
          hotspots: [],
          order: i,
        },
      });

      panoramas.push(panorama);
    }

    console.log(
      `✅ ${panoramas.length} panoramas saved for property ${propertyId}`,
    );

    res.status(201).json({
      success: true,
      message: `${panoramas.length} panorama(s) uploaded`,
      data: panoramas,
    });
  } catch (err) {
    console.error("PANORAMA UPLOAD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to upload panoramas",
      error: err.message,
    });
  }
};


exports.createProperty = async (req, res) => {
  try {
    const d = req.body;
    const files = req.files || [];
    const userId =
      req.user?.id ?? req.user?.userId ?? req.user?._id ?? d.userId;

    if (userId === null || userId === undefined || userId === "") {
      return res.status(400).json({
        success: false,
        message: "User ID is required. Please login to post a property.",
      });
    }

    
    let imageUrls = [];
    if (files.length > 0) {
      try {
        imageUrls = await uploadMultipleToCloudinary(files);
        console.log(`✅ Uploaded ${imageUrls.length} images to Cloudinary`);
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr.message);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. Please try again.",
          error: uploadErr.message,
        });
      }
    }

    const property = await prisma.property.create({
      data: {
        user: {
          connect: { id: Number(userId) }, 
        },
        purpose: d.purpose || null,
        propertyType: d.propertyType || null,
        title: d.title || null,
        description: d.description || null,
        areaSize: d.areaSize || null,
        areaUnit: d.areaUnit || null,
        bedrooms: d.bedrooms || null,
        bathrooms: d.bathrooms || null,
        floors: d.floors || null,
        parking: d.parking || null,
        yearBuilt: d.yearBuilt || null,
        furnishing: d.furnishing || null,
        possession: d.possession || null,
        facing: d.facing || null,
        price: toBigInt(d.price),
        negotiable: toBool(d.negotiable),
        installmentAvailable: toBool(d.installmentAvailable),
        downPayment: toBigInt(d.downPayment),
        monthlyInstallment: toBigInt(d.monthlyInstallment),
        duration: d.duration || null,
        monthlyRent: toBigInt(d.monthlyRent),
        securityDeposit: toBigInt(d.securityDeposit),
        advanceMonths: d.advanceMonths || null,
        amenities: parseAmenities(d.amenities),
        city: d.city || null,
        locality: d.locality || null,
        address: d.address || null,
        latitude: d.lat ? Number(d.lat) : null,
        longitude: d.lng ? Number(d.lng) : null,
        images: imageUrls, 
        videoUrl: d.videoUrl || null,
        floorPlan: d.floorPlan || null,
        status: "pending",
      },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    const serialized = serializeBigInt(property);

    
    const io = req.app.get("io");
    if (io) {
      io.to("admin_room").emit("new_property_pending", {
        message: `New property submitted by ${property.user?.fullName || "User"}`,
        property: serialized,
        timestamp: new Date().toISOString(),
      });
      io.to(`user_${userId}`).emit("property_submitted", {
        message: "Your property has been submitted and is pending approval.",
        propertyId: property.id,
        status: "pending",
        timestamp: new Date().toISOString(),
      });
    }

    res.status(201).json({
      success: true,
      message: "Property submitted successfully. Waiting for admin approval.",
      data: serialized,
    });
  } catch (err) {
    console.error("CREATE PROPERTY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create property",
      error: err.message,
    });
  }
};


exports.getProperties = async (req, res) => {
  try {
    const {
      search,
      purpose,
      propertyType,
      city,
      locality,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minBeds,
      maxBeds,
      minBaths,
      maxBaths,
      minArea,
      maxArea,
      areaUnit,
      amenities,
    } = req.query;

    const where = { status: "approved" };

    if (purpose) where.purpose = purpose;
    if (propertyType) where.propertyType = propertyType;
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (locality) where.locality = { contains: locality, mode: "insensitive" };
    if (areaUnit) where.areaUnit = areaUnit;

    if (bedrooms) {
      where.bedrooms = bedrooms;
    } else if (minBeds || maxBeds) {
      where.bedrooms = {};
      if (minBeds) where.bedrooms.gte = minBeds;
      if (maxBeds) where.bedrooms.lte = maxBeds;
    }

    if (bathrooms) {
      where.bathrooms = bathrooms;
    } else if (minBaths || maxBaths) {
      where.bathrooms = {};
      if (minBaths) where.bathrooms.gte = minBaths;
      if (maxBaths) where.bathrooms.lte = maxBaths;
    }

    if (minArea || maxArea) {
      where.areaSize = {};
      if (minArea) where.areaSize.gte = minArea;
      if (maxArea) where.areaSize.lte = maxArea;
    }

    if (amenities) {
      const amenityList = amenities.split(",").map((a) => a.trim());
      if (amenityList.length > 0) where.amenities = { hasEvery: amenityList };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { locality: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = BigInt(minPrice);
      if (maxPrice) where.price.lte = BigInt(maxPrice);
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    });

    res.json({
      success: true,
      count: properties.length,
      data: serializeBigInt(properties),
    });
  } catch (err) {
    console.error("GET PROPERTIES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: err.message,
    });
  }
};


exports.getAdminProperties = async (req, res) => {
  try {
    const { status, search, page } = req.query;
    const where = {};

    if (status && status !== "all") where.status = status;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = 10;
    const skip = (pageNumber - 1) * pageSize;
    const total = await prisma.property.count({ where });

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    });

    res.json({
      success: true,
      data: serializeBigInt(properties),
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("GET ADMIN PROPERTIES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: err.message,
    });
  }
};

// ==================== ADMIN - Update Status ====================
exports.updatePropertyStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, rejectionReason } = req.body;
    const adminId = req.user?.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID" });
    }

    const allowedStatus = ["pending", "approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be: pending, approved, or rejected",
      });
    }

    const existing = await prisma.property.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const updateData = { status };

    if (status === "approved") {
      updateData.approvedAt = new Date();
      updateData.approvedBy = adminId || 0;
      updateData.rejectionReason = null;
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
      updateData.approvedBy = adminId || 0;
      updateData.rejectionReason = rejectionReason || "No reason provided";
    }

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });

    const serialized = serializeBigInt(property);
    const io = req.app.get("io");

    if (io) {
      if (status === "approved") {
        io.to("public_room").emit("property_approved", {
          message: "A new property is now available!",
          property: serialized,
          timestamp: new Date().toISOString(),
        });
        if (existing.userId) {
          io.to(`user_${existing.userId}`).emit("your_property_approved", {
            message: `Congratulations! Your property "${existing.title}" has been approved and is now live.`,
            propertyId: id,
            status: "approved",
            timestamp: new Date().toISOString(),
          });
        }
        io.to("admin_room").emit("property_status_updated", {
          propertyId: id,
          status: "approved",
          timestamp: new Date().toISOString(),
        });
      } else if (status === "rejected") {
        if (existing.userId) {
          io.to(`user_${existing.userId}`).emit("your_property_rejected", {
            message: `Your property "${existing.title}" was rejected.`,
            reason: rejectionReason || "No reason provided",
            propertyId: id,
            status: "rejected",
            timestamp: new Date().toISOString(),
          });
        }
        io.to("admin_room").emit("property_status_updated", {
          propertyId: id,
          status: "rejected",
          timestamp: new Date().toISOString(),
        });
      } else {
        io.to("admin_room").emit("property_status_updated", {
          propertyId: id,
          status: "pending",
          timestamp: new Date().toISOString(),
        });
      }
    }

    res.json({
      success: true,
      message: `Property ${status} successfully`,
      data: serialized,
    });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: err.message,
    });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "pending" } }),
      prisma.property.count({ where: { status: "approved" } }),
      prisma.property.count({ where: { status: "rejected" } }),
    ]);

    res.json({ success: true, data: { total, pending, approved, rejected } });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch stats",
        error: err.message,
      });
  }
};


// In property.controllers.js — fix getPropertyById
exports.getPropertyById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID" });
    }

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        // ✅ MUST include this — buyer needs panoramas to see 360° button
        panoramas: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // ✅ Debug log
    console.log(
      `Property ${id} has ${property.panoramas?.length || 0} panoramas`,
    );

    res.json({ success: true, data: serializeBigInt(property) });
  } catch (err) {
    console.error("GET PROPERTY BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: err.message,
    });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const d = req.body;
    const files = req.files || [];

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID" });
    }

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // ✅ Upload new images to Cloudinary, delete old ones
    let newImageUrls = [];
    if (files.length > 0) {
      newImageUrls = await uploadMultipleToCloudinary(files);

      // Delete old Cloudinary images
      if (Array.isArray(existing.images) && existing.images.length > 0) {
        await Promise.allSettled(
          existing.images.map((url) => deleteFromCloudinary(url)),
        );
      }
    }

    const updateData = {
      ...(d.purpose !== undefined && { purpose: d.purpose }),
      ...(d.propertyType !== undefined && { propertyType: d.propertyType }),
      ...(d.title !== undefined && { title: d.title }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.areaSize !== undefined && { areaSize: d.areaSize }),
      ...(d.areaUnit !== undefined && { areaUnit: d.areaUnit }),
      ...(d.bedrooms !== undefined && { bedrooms: d.bedrooms }),
      ...(d.bathrooms !== undefined && { bathrooms: d.bathrooms }),
      ...(d.floors !== undefined && { floors: d.floors }),
      ...(d.parking !== undefined && { parking: d.parking }),
      ...(d.yearBuilt !== undefined && { yearBuilt: d.yearBuilt }),
      ...(d.furnishing !== undefined && { furnishing: d.furnishing }),
      ...(d.possession !== undefined && { possession: d.possession }),
      ...(d.facing !== undefined && { facing: d.facing }),
      ...(d.price !== undefined && { price: toBigInt(d.price) }),
      ...(d.negotiable !== undefined && { negotiable: toBool(d.negotiable) }),
      ...(d.installmentAvailable !== undefined && {
        installmentAvailable: toBool(d.installmentAvailable),
      }),
      ...(d.downPayment !== undefined && {
        downPayment: toBigInt(d.downPayment),
      }),
      ...(d.monthlyInstallment !== undefined && {
        monthlyInstallment: toBigInt(d.monthlyInstallment),
      }),
      ...(d.duration !== undefined && { duration: d.duration }),
      ...(d.monthlyRent !== undefined && {
        monthlyRent: toBigInt(d.monthlyRent),
      }),
      ...(d.securityDeposit !== undefined && {
        securityDeposit: toBigInt(d.securityDeposit),
      }),
      ...(d.advanceMonths !== undefined && { advanceMonths: d.advanceMonths }),
      ...(d.amenities !== undefined && {
        amenities: parseAmenities(d.amenities),
      }),
      ...(d.city !== undefined && { city: d.city }),
      ...(d.locality !== undefined && { locality: d.locality }),
      ...(d.address !== undefined && { address: d.address }),
      ...(d.lat !== undefined && { latitude: Number(d.lat) }),
      ...(d.lng !== undefined && { longitude: Number(d.lng) }),
      ...(d.videoUrl !== undefined && { videoUrl: d.videoUrl }),
      ...(d.floorPlan !== undefined && { floorPlan: d.floorPlan }),
      ...(d.status !== undefined && { status: d.status }),
      ...(newImageUrls.length > 0 && { images: newImageUrls }),
    };

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    });
    const serialized = serializeBigInt(property);

    const io = req.app.get("io");
    if (io && d.status === "approved") {
      io.to("public_room").emit("property_approved", {
        message: "A new property is now available!",
        property: serialized,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: "Property updated successfully",
      data: serialized,
    });
  } catch (err) {
    console.error("UPDATE PROPERTY ERROR:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update property",
        error: err.message,
      });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID" });
    }

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // ✅ Delete images from Cloudinary
    if (Array.isArray(existing.images) && existing.images.length > 0) {
      await Promise.allSettled(
        existing.images.map((url) => deleteFromCloudinary(url)),
      );
      console.log(
        `🗑️ Deleted ${existing.images.length} images from Cloudinary`,
      );
    }

    await prisma.property.delete({ where: { id } });

    const io = req.app.get("io");
    if (io) {
      io.to("public_room").emit("property_deleted", {
        propertyId: id,
        timestamp: new Date().toISOString(),
      });
      io.to("admin_room").emit("property_deleted", {
        propertyId: id,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete property",
        error: err.message,
      });
  }
};
