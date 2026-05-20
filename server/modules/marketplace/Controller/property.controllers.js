const prisma = require("../../../configs/prisma");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Helper - safely convert string/number to BigInt
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

// Helper - parse amenities (FormData se string aata hai)
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

// Helper - boolean parse
const toBool = (val) => {
  if (val === true || val === "true") return true;
  return false;
};

// ==================== CREATE Property ====================
exports.createProperty = async (req, res) => {
  try {
    const d = req.body;
    const files = req.files || [];

    // ⭐ Multer se aayi files ke URLs banao
    const imageUrls = files.map(
      (file) => `${BASE_URL}/uploads/properties/${file.filename}`
    );

    const property = await prisma.property.create({
      
      data: {
        // Basic Info
        purpose: d.purpose || null,
        propertyType: d.propertyType || null,
        title: d.title || null,
        description: d.description || null,

        // Property Details
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

        // Pricing
        price: toBigInt(d.price),
        negotiable: toBool(d.negotiable),
        installmentAvailable: toBool(d.installmentAvailable),
        downPayment: toBigInt(d.downPayment),
        monthlyInstallment: toBigInt(d.monthlyInstallment),
        duration: d.duration || null,
        monthlyRent: toBigInt(d.monthlyRent),
        securityDeposit: toBigInt(d.securityDeposit),
        advanceMonths: d.advanceMonths || null,

        // Amenities
        amenities: parseAmenities(d.amenities),

        // Location
        city: d.city || null,
        locality: d.locality || null,
        address: d.address || null,

        // ⭐ Media — actual uploaded image URLs
        images: imageUrls,
        videoUrl: d.videoUrl || null,
        floorPlan: d.floorPlan || null,

        // Status
        status: d.status || "published",
      },
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
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

// ==================== GET ALL ====================
exports.getProperties = async (req, res) => {
  try {
    const {
      search,
      purpose,
      propertyType,
      city,
      minPrice,
      maxPrice,
      status,
      bedrooms,
      bathrooms,
    } = req.query;

    const where = {};
    where.status = status || "published";

    if (purpose) where.purpose = purpose;
    if (propertyType) where.propertyType = propertyType;
    if (bedrooms) where.bedrooms = bedrooms;
    if (bathrooms) where.bathrooms = bathrooms;

    if (city) where.city = { contains: city, mode: "insensitive" };

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
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
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

// ==================== GET BY ID ====================
exports.getPropertyById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, data: property });
  } catch (err) {
    console.error("GET PROPERTY BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: err.message,
    });
  }
};

// ==================== UPDATE ====================
exports.updateProperty = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const d = req.body;
    const files = req.files || [];

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Naye image URLs (agar files aayi hain)
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
      ...(d.downPayment !== undefined && { downPayment: toBigInt(d.downPayment) }),
      ...(d.monthlyInstallment !== undefined && {
        monthlyInstallment: toBigInt(d.monthlyInstallment),
      }),
      ...(d.duration !== undefined && { duration: d.duration }),
      ...(d.monthlyRent !== undefined && { monthlyRent: toBigInt(d.monthlyRent) }),
      ...(d.securityDeposit !== undefined && {
        securityDeposit: toBigInt(d.securityDeposit),
      }),
      ...(d.advanceMonths !== undefined && { advanceMonths: d.advanceMonths }),
      ...(d.amenities !== undefined && { amenities: parseAmenities(d.amenities) }),
      ...(d.city !== undefined && { city: d.city }),
      ...(d.locality !== undefined && { locality: d.locality }),
      ...(d.address !== undefined && { address: d.address }),
      ...(d.videoUrl !== undefined && { videoUrl: d.videoUrl }),
      ...(d.floorPlan !== undefined && { floorPlan: d.floorPlan }),
      ...(d.status !== undefined && { status: d.status }),
    };

    // ⭐ Agar naye files aayi to images replace karo
    if (newImageUrls.length > 0) {
      updateData.images = newImageUrls;
    }

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Property updated successfully",
      data: property,
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

// ==================== DELETE ====================
exports.deleteProperty = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // ⭐ Image files delete karo disk se
    if (Array.isArray(existing.images)) {
      existing.images.forEach((url) => {
        try {
          const filename = url.split("/uploads/properties/")[1];
          if (filename) {
            const filepath = path.join(
              __dirname, "..", "..", "..", "uploads", "properties", filename
            );
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
          }
        } catch (e) {
          console.warn("Could not delete file:", e.message);
        }
      });
    }

    await prisma.property.delete({ where: { id } });

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