const prisma = require("../../../configs/prisma");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateToken");

// ═══════════════════════════════════════════════════════════
// Helper: Profile completion percentage
// ═══════════════════════════════════════════════════════════
function calculateProfileCompletion(user) {
  let total = 8;
  let filled = 0;

  if (user.fullName) filled++;
  if (user.email) filled++;
  if (user.phone) filled++;
  if (user.city) filled++;
  if (user.profilePicture) filled++;
  if (user.profile?.bio) filled++;
  if (user.profile?.address) filled++;
  if (user.isVerified) filled++;

  return Math.round((filled / total) * 100);
}

// ═══════════════════════════════════════════════════════════
// Get Buyer Profile
// ═══════════════════════════════════════════════════════════
async function getBuyerProfile(userId) {
  console.log("🔍 [getBuyerProfile] userId:", userId);

  const buyer = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  console.log("🔍 Buyer found:", buyer ? `Yes - Role: ${buyer.role}` : "No");

  if (!buyer) {
    throw new Error("User not found");
  }

  if (buyer.role !== "BUYER") {
    throw new Error(`User role is "${buyer.role}", not BUYER`);
  }

  const profileCompletion = calculateProfileCompletion(buyer);

  const verifications = {
    identity: buyer.isVerified,
    phone: !!buyer.phone,
    email: !!buyer.email,
  };

  return {
    id: buyer.id,
    fullName: buyer.fullName,
    email: buyer.email,
    phone: buyer.phone,
    city: buyer.city,
    profilePicture: buyer.profilePicture,
    trustScore: buyer.trustScore,
    isVerified: buyer.isVerified,
    role: buyer.role,
    createdAt: buyer.createdAt,
    bio: buyer.profile?.bio || "",
    whatsappNumber: buyer.profile?.whatsappNumber || "",
    address: buyer.profile?.address || "",
    gender: buyer.profile?.gender,
    dateOfBirth: buyer.profile?.dateOfBirth,
    profileCompletion,
    verifications,
  };
}

// ═══════════════════════════════════════════════════════════
// Update Buyer Profile
// ═══════════════════════════════════════════════════════════
async function updateBuyerProfile(userId, data) {
  console.log("🔄 [updateBuyerProfile] userId:", userId);

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

  return await getBuyerProfile(userId);
}

// ═══════════════════════════════════════════════════════════
// Convert Buyer to Seller (with additional info) - UPDATED with JWT
// ═══════════════════════════════════════════════════════════
async function convertToSeller(userId, sellerData) {
  console.log("🔄 [convertToSeller] userId:", userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "SELLER") {
    throw new Error("User is already a seller");
  }

  if (user.role === "ADMIN") {
    throw new Error("Admin cannot be converted to seller");
  }

  const { companyName, experience, licenseNumber, specialization, aboutBusiness } = sellerData;

  // Update user role to SELLER
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: "SELLER" },
  });

  // Create SellerDetail entry
  await prisma.sellerDetail.create({
    data: {
      userId,
      totalListings: 0,
      activeListings: 0,
      soldProperties: 0,
      sellerRating: 0,
      isPremium: false,
    },
  });

  // Update bio with business info if provided
  if (aboutBusiness || companyName) {
    const bioText = companyName
      ? `${companyName}${aboutBusiness ? ' - ' + aboutBusiness : ''}`
      : aboutBusiness;

    await prisma.userProfile.upsert({
      where: { userId },
      update: { bio: bioText },
      create: { userId, bio: bioText },
    });
  }

  // Activity log
  await prisma.userActivityLog.create({
    data: {
      userId,
      action: "ROLE_CHANGED",
      description: `User converted from BUYER to SELLER${companyName ? ` (${companyName})` : ''}`,
      status: "SUCCESS",
    },
  });

  // Generate NEW tokens with updated role
  const accessToken = generateAccessToken(updatedUser.id, "SELLER");
  const refreshToken = generateRefreshToken(updatedUser.id, "SELLER");

  return {
    success: true,
    message: "Successfully converted to seller account",
    userId,
    newRole: "SELLER",
    accessToken,
    refreshToken,
    user: {
      userId: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    },
  };
}

// ═══════════════════════════════════════════════════════════
// Get Recent Activity
// ═══════════════════════════════════════════════════════════
async function getRecentActivity(userId, limit = 10) {
  const activities = await prisma.userActivityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
  });
  return activities;
}

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════
module.exports = {
  getBuyerProfile,
  updateBuyerProfile,
  convertToSeller,
  getRecentActivity,
};