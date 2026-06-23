const prisma = require("../../../configs/prisma");

// Helper function
function calculateProfileCompletion(user) {
  let total = 10;
  let filled = 0;

  if (user.fullName) filled++;
  if (user.email) filled++;
  if (user.phone) filled++;
  if (user.city) filled++;
  if (user.profilePicture) filled++;
  if (user.profile?.bio) filled++;
  if (user.profile?.whatsappNumber) filled++;
  if (user.profile?.address) filled++;
  if (user.profile?.gender) filled++;
  if (user.isVerified) filled++;

  return Math.round((filled / total) * 100);
}

const SELLER_PROFILE_ROLES = ["SELLER", "SOCIETY_OWNER"];

// Get Seller Profile
async function getSellerProfile(userId) {
  console.log("🔍 [getSellerProfile] userId:", userId);

  const seller = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      sellerDetail: true,
      properties: {
        select: { id: true, status: true },
      },
    },
  });

  console.log("🔍 Seller found:", seller ? `Yes - Role: ${seller.role}` : "No");

  if (!seller) {
    throw new Error("Seller not found");
  }

  if (!SELLER_PROFILE_ROLES.includes(seller.role)) {
    throw new Error(`User role is "${seller.role}", not allowed for seller profile`);
  }

  const profileCompletion = calculateProfileCompletion(seller);

  const verifications = {
    identity: seller.isVerified,
    phone: !!seller.phone,
    email: !!seller.email,
    business: seller.sellerDetail?.isPremium || false,
  };

  return {
    id: seller.id,
    fullName: seller.fullName,
    email: seller.email,
    phone: seller.phone,
    city: seller.city,
    profilePicture: seller.profilePicture,
    trustScore: seller.trustScore,
    isVerified: seller.isVerified,
    role: seller.role,
    createdAt: seller.createdAt,
    bio: seller.profile?.bio || "",
    whatsappNumber: seller.profile?.whatsappNumber || "",
    address: seller.profile?.address || "",
    gender: seller.profile?.gender,
    sellerDetail: seller.sellerDetail,
    profileCompletion,
    verifications,
    totalProperties: seller.properties.length,
  };
}

// Update Seller Profile
async function updateSellerProfile(userId, data) {
  const {
    fullName,
    phone,
    city,
    profilePicture,
    bio,
    whatsappNumber,
    address,
    gender,
    dateOfBirth,
  } = data;

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(city && { city }),
      ...(profilePicture && { profilePicture }),
    },
  });

  await prisma.userProfile.upsert({
    where: { userId },
    update: {
      ...(bio !== undefined && { bio }),
      ...(whatsappNumber && { whatsappNumber }),
      ...(address && { address }),
      ...(gender && { gender }),
      ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
    },
    create: {
      userId,
      bio: bio || null,
      whatsappNumber: whatsappNumber || null,
      address: address || null,
      gender: gender || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    },
  });

  return await getSellerProfile(userId);
}

// Get Stats
async function getSellerStats(userId) {
  const properties = await prisma.property.findMany({
    where: { userId },
    select: { id: true, status: true, price: true, createdAt: true },
  });

  const totalListings = properties.length;
  const activeListings = properties.filter((p) => p.status === "approved").length;
  const pendingListings = properties.filter((p) => p.status === "pending").length;
  const soldListings = properties.filter((p) => p.status === "sold").length;
  const rejectedListings = properties.filter((p) => p.status === "rejected").length;

  await prisma.sellerDetail.upsert({
    where: { userId },
    update: { totalListings, activeListings, soldProperties: soldListings },
    create: { userId, totalListings, activeListings, soldProperties: soldListings },
  });

  return {
    totalListings,
    activeListings,
    pendingListings,
    soldListings,
    rejectedListings,
  };
}

// Get My Listings
async function getSellerListings(userId, filters = {}) {
  const { status, page = 1, limit = 10 } = filters;

  const where = { userId };
  if (status) where.status = status;

  const skip = (page - 1) * limit;

  const [listings, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    }),
    prisma.property.count({ where }),
  ]);

  return {
    listings,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Get Activity
async function getRecentActivity(userId, limit = 10) {
  const activities = await prisma.userActivityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
  });
  return activities;
}

// ═══════════════════════════════════════════════════════════
// EXPORTS - BOHOT IMPORTANT!
// ═══════════════════════════════════════════════════════════
module.exports = {
  getSellerProfile,
  updateSellerProfile,
  getSellerStats,
  getSellerListings,
  getRecentActivity,
};
