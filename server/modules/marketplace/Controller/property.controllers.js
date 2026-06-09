const prisma = require("../../../configs/prisma");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// ─── Socket helper ────────────────────────────────────────────────────────────
// req se io nikaalta hai aur event emit karta hai
const emitEvent = (req, event, room, data) => {
  try {
    const io = req.app.get("io");
    if (io) {
      io.to(room).emit(event, data);
    }
  } catch (err) {
    console.warn("Socket emit error:", err.message);
  }
};

// ==================== CREATE Property ====================
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

    const imageUrls = files.map(
      (file) => `${BASE_URL}/uploads/properties/${file.filename}`
    );

    const property = await prisma.property.create({
      data: {
        userId: userId,
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
        images: imageUrls,
        videoUrl: d.videoUrl || null,
        floorPlan: d.floorPlan || null,
        status: "pending",
      },
      // User info bhi include karo
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    const serialized = serializeBigInt(property);

    // ── Socket Events ──────────────────────────────────────────────────
    const io = req.app.get("io");
    if (io) {
      // 1. Admin ko notify karo - naya pending property aaya
      io.to("admin_room").emit("new_property_pending", {
        message: `New property submitted by ${property.user?.fullName || "User"}`,
        property: serialized,
        timestamp: new Date().toISOString(),
      });

      // 2. Property post karne wale user ko confirm karo
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

// ==================== GET All Properties (Public - Only Approved) ====================
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
      status,
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

    // ── IMPORTANT FIX: Hamesha sirf "approved" status return karo
    // Yahi bug tha — pehle koi bhi status accept ho raha tha
    const where = {
      status: "approved", // ← FIXED: hardcoded, override nahi hoga
    };

    // Purpose filter
    if (purpose) where.purpose = purpose;

    // Property type filter
    if (propertyType) where.propertyType = propertyType;

    // City filter
    if (city) where.city = { contains: city, mode: "insensitive" };

    // Locality filter
    if (locality) {
      where.locality = { contains: locality, mode: "insensitive" };
    }

    // Area unit filter
    if (areaUnit) where.areaUnit = areaUnit;

    // Bedrooms filter - exact ya range
    if (bedrooms) {
      where.bedrooms = bedrooms;
    } else if (minBeds || maxBeds) {
      // Bedrooms string field hai, compare karo
      // Simple approach: agar minBeds set hai
      if (minBeds && !maxBeds) {
        where.bedrooms = { gte: minBeds };
      } else if (!minBeds && maxBeds) {
        where.bedrooms = { lte: maxBeds };
      } else if (minBeds && maxBeds) {
        where.bedrooms = { gte: minBeds, lte: maxBeds };
      }
    }

    // Bathrooms filter
    if (bathrooms) {
      where.bathrooms = bathrooms;
    } else if (minBaths || maxBaths) {
      if (minBaths && !maxBaths) {
        where.bathrooms = { gte: minBaths };
      } else if (!minBaths && maxBaths) {
        where.bathrooms = { lte: maxBaths };
      } else if (minBaths && maxBaths) {
        where.bathrooms = { gte: minBaths, lte: maxBaths };
      }
    }

    // Area size filter
    if (minArea || maxArea) {
      where.areaSize = {};
      if (minArea) where.areaSize.gte = minArea;
      if (maxArea) where.areaSize.lte = maxArea;
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(",").map((a) => a.trim());
      if (amenityList.length > 0) {
        where.amenities = { hasEvery: amenityList };
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { locality: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // Price filter
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
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
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

// ==================== ADMIN - Get All Properties ====================
exports.getAdminProperties = async (req, res) => {
  try {
    const { status, search, page } = req.query;

    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

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
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
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

// ==================== ADMIN - Update Status (Approve / Reject) ====================
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
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
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
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    const serialized = serializeBigInt(property);

    // ── Socket Events ──────────────────────────────────────────────────
    const io = req.app.get("io");
    if (io) {
      if (status === "approved") {
        // 1. Sab public users ko live broadcast karo - nai property available hai
        io.to("public_room").emit("property_approved", {
          message: "A new property is now available!",
          property: serialized,
          timestamp: new Date().toISOString(),
        });

        // 2. Property owner ko notify karo
        if (existing.userId) {
          io.to(`user_${existing.userId}`).emit("your_property_approved", {
            message: `Congratulations! Your property "${existing.title}" has been approved and is now live.`,
            propertyId: id,
            status: "approved",
            timestamp: new Date().toISOString(),
          });
        }

        // 3. Admin room ko bhi update bhejo
        io.to("admin_room").emit("property_status_updated", {
          propertyId: id,
          status: "approved",
          timestamp: new Date().toISOString(),
        });
      } else if (status === "rejected") {
        // Owner ko rejection notify karo
        if (existing.userId) {
          io.to(`user_${existing.userId}`).emit("your_property_rejected", {
            message: `Your property "${existing.title}" was rejected.`,
            reason: rejectionReason || "No reason provided",
            propertyId: id,
            status: "rejected",
            timestamp: new Date().toISOString(),
          });
        }

        // Admin room update
        io.to("admin_room").emit("property_status_updated", {
          propertyId: id,
          status: "rejected",
          timestamp: new Date().toISOString(),
        });
      } else if (status === "pending") {
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

// ==================== ADMIN - Dashboard Stats ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "pending" } }),
      prisma.property.count({ where: { status: "approved" } }),
      prisma.property.count({ where: { status: "rejected" } }),
    ]);

    res.json({
      success: true,
      data: { total, pending, approved, rejected },
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: err.message,
    });
  }
};

// ==================== GET BY ID ====================
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
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

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

// ==================== UPDATE Property ====================
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

    const newImageUrls = files.map(
      (file) => `${BASE_URL}/uploads/properties/${file.filename}`
    );

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

    // ── Socket: agar status update hua to emit karo ───────────────────
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
    res.status(500).json({
      success: false,
      message: "Failed to update property",
      error: err.message,
    });
  }
};

// ==================== DELETE Property ====================
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

    // Image files delete karo disk se
    if (Array.isArray(existing.images)) {
      existing.images.forEach((url) => {
        try {
          const filename = url.split("/uploads/properties/")[1];
          if (filename) {
            const filepath = path.join(
              __dirname,
              "..",
              "..",
              "..",
              "uploads",
              "properties",
              filename
            );
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
          }
        } catch (e) {
          console.warn("Could not delete file:", e.message);
        }
      });
    }

    await prisma.property.delete({ where: { id } });

    // ── Socket: property deleted notify karo ──────────────────────────
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

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete property",
      error: err.message,
    });
  }
};