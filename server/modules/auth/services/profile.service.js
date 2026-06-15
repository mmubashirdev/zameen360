const prisma = require("../../../configs/prisma");

const getProfileService = async (userId) => {
  return await prisma.user.findUnique({ where: { id: userId }, include: { profile: true, sellerDetail: true } });
};

const updateProfileService = async (userId, currentUser, data, ip) => {
  const { fullName, phone, city, bio, whatsappNumber, dateOfBirth, gender, address } = data;

  const updatedUser = await prisma.user.update({ where: { id: userId }, data: { fullName: fullName || currentUser.fullName, phone: phone || currentUser.phone, city: city || currentUser.city } });

  const updatedProfile = await prisma.userProfile.upsert({
    where: { userId },
    update: { bio: bio || undefined, whatsappNumber: whatsappNumber || undefined, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, gender: gender || undefined, address: address || undefined, profileComplete: true },
    create: { userId, bio, whatsappNumber, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, gender, address, profileComplete: true },
  });

  await prisma.userActivityLog.create({ data: { userId, action: "UPDATE_PROFILE", description: "Updated", ipAddress: ip, status: "SUCCESS" } });
  return { user: updatedUser, profile: updatedProfile };
};

const uploadPictureService = async (userId, filename) => {
  const pic = `/uploads/profiles/${filename}`;
  await prisma.user.update({ where: { id: userId }, data: { profilePicture: pic } });
  return pic;
};

const removePictureService = async (userId) => {
  await prisma.user.update({ where: { id: userId }, data: { profilePicture: null } });
  return true;
};

const becomeSellerService = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw Object.assign(new Error("User not found."), { status: 404 });
  if (user.role === "SELLER") throw Object.assign(new Error("You are already a seller."), { status: 400 });
  const updated = await prisma.user.update({ where: { id: userId }, data: { role: "SELLER" } });
  await prisma.userActivityLog.create({ data: { userId, action: "BECOME_SELLER", description: "User upgraded to seller", ipAddress: "system", status: "SUCCESS" } });
  return { userId: updated.id, role: updated.role };
};

module.exports = { getProfileService, updateProfileService, uploadPictureService, removePictureService, becomeSellerService };