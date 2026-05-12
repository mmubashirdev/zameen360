const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendOTPEmail } = require("../../../utils/sendEmail");

const registerUser = async (data, ip, userAgent) => {
  const { fullName, email, phone, password, confirmPassword, role, city } = data;

  if (!fullName || !email || !password || !confirmPassword){
    throw { status: 400, message: "All fields required." };
  }
  if (password !== confirmPassword){
     throw { status: 400, message: "Passwords don't match." };
  }
  if (password.length < 8) {
    throw { status: 400, message: "Min 8 characters." };
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing){
     throw { status: 400, message: "Email already registered." };
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userRole = role === "SELLER" ? "SELLER" : "BUYER";

  const user = await prisma.user.create({
    data: {
      fullName,
       email, 
       phone: phone,
        passwordHash: hashedPassword,
        role: userRole,
       city: city,
        isVerified: false,
         isActive: true,
    },
  });

  await prisma.userProfile.create({ data: { userId: user.id, profileComplete: false } });
  if (userRole === "SELLER"){
   await prisma.sellerDetail.create({
     data: { userId: user.id }
     });
  }
  const otp = generateOTP();
  await prisma.userVerification.create({
    data: { userId: user.id,
         otpCode: otp, 
         otpType: "EMAIL",
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
           ipAddress: ip },
  });

  await sendOTPEmail(email, otp, "Email Verification");
  await prisma.userActivityLog.create({
     data: { userId: user.id,
         action: "REGISTER",
          description: `Registered as ${userRole}`,
           ipAddress: ip, 
           device: userAgent,
            status: "SUCCESS"
         } });


  return {
     userId: user.id,
     fullName: user.fullName,
      email: user.email,
       role: user.role,
        isVerified: false
     };
};

module.exports = { registerUser };