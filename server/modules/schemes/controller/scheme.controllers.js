const prisma = require("../../../../server/configs/prisma");
const { uploadToCloudinary } = require("../../../../server/utils/uploadToCloudinary");
const { sendSocietyRegistrationEmail, sendSocietyApprovalEmail } = require("../../../../server/utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
// Create a new Society Verification application
exports.createApplication = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const body = req.body;

    // Parse availablePlotSizes if it was sent as JSON string
    let availablePlotSizes = [];
    if (body.availablePlotSizes) {
      try {
        availablePlotSizes = JSON.parse(body.availablePlotSizes);
      } catch (e) {
        availablePlotSizes = Array.isArray(body.availablePlotSizes) ? body.availablePlotSizes : [body.availablePlotSizes];
      }
    }

    // Upload files to Cloudinary
    const files = req.files || {};
    const getCloudinaryUrl = async (fieldName) => {
      if (files[fieldName] && files[fieldName].length > 0) {
        try {
          const url = await uploadToCloudinary(files[fieldName][0].buffer, "zameen360/schemes");
          return url;
        } catch (err) {
          console.error(`Error uploading ${fieldName} to Cloudinary:`, err);
          return null;
        }
      }
      return null;
    };

    const [
      cnicFront, cnicBack, companyRegistration, ntnCertificate,
      authorityLetter, nocCopy, ownershipDocuments, fardRegistry, landTransfer
    ] = await Promise.all([
      getCloudinaryUrl("cnicFront"),
      getCloudinaryUrl("cnicBack"),
      getCloudinaryUrl("companyRegistration"),
      getCloudinaryUrl("ntnCertificate"),
      getCloudinaryUrl("authorityLetter"),
      getCloudinaryUrl("nocCopy"),
      getCloudinaryUrl("ownershipDocuments"),
      getCloudinaryUrl("fardRegistry"),
      getCloudinaryUrl("landTransfer")
    ]);

    const newApplication = await prisma.societyVerification.create({
      data: {
        userId,
        societyName: body.societyName,
        societyType: body.societyType,
        city: body.city,
        areaSector: body.areaSector,
        address: body.address,
        googleMapsLocation: body.googleMapsLocation,
        website: body.website,
        officialEmail: body.officialEmail,
        officialContact: body.officialContact,

        developerCompany: body.developerCompany,
        ownerName: body.ownerName,
        cnicNumber: body.cnicNumber,
        designation: body.designation,
        contactNumber: body.contactNumber,
        emailAddress: body.emailAddress,

        nocStatus: body.nocStatus,
        approvingAuthority: body.approvingAuthority,
        nocNumber: body.nocNumber,
        nocIssueDate: body.nocIssueDate,
        nocExpiryDate: body.nocExpiryDate,

        availablePlotSizes,

        cnicFront,
        cnicBack,
        companyRegistration,
        ntnCertificate,
        authorityLetter,
        nocCopy,
        ownershipDocuments,
        fardRegistry,
        landTransfer,

        status: "PENDING",
      },
    });

    if (body.emailAddress) {
      sendSocietyRegistrationEmail(body.emailAddress).catch(err => console.error("Failed to send registration email:", err));
    }

    res.status(201).json({ success: true, application: newApplication });
  } catch (error) {
    console.error("Error creating society application:", error);
    res.status(500).json({ success: false, message: "Failed to submit application" });
  }
};

// Get all applications for the logged-in user
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await prisma.societyVerification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

// Update application (Only if PENDING)
exports.updateApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const body = req.body;

    const existing = await prisma.societyVerification.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ success: false, message: "Application not found" });
    if (existing.userId !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });
    if (existing.status !== "PENDING") return res.status(400).json({ success: false, message: "Can only update pending applications" });

    let availablePlotSizes = existing.availablePlotSizes;
    if (body.availablePlotSizes) {
      try {
        availablePlotSizes = JSON.parse(body.availablePlotSizes);
      } catch (e) {
        availablePlotSizes = Array.isArray(body.availablePlotSizes) ? body.availablePlotSizes : [body.availablePlotSizes];
      }
    }

    const files = req.files || {};
    const getCloudinaryUrl = async (fieldName) => {
      if (files[fieldName] && files[fieldName].length > 0) {
        try {
          const url = await uploadToCloudinary(files[fieldName][0].buffer, "zameen360/schemes");
          return url;
        } catch (err) {
          console.error(`Error uploading ${fieldName} to Cloudinary:`, err);
          return existing[fieldName];
        }
      }
      return existing[fieldName];
    };

    const [
      cnicFront, cnicBack, companyRegistration, ntnCertificate,
      authorityLetter, nocCopy, ownershipDocuments, fardRegistry, landTransfer
    ] = await Promise.all([
      getCloudinaryUrl("cnicFront"),
      getCloudinaryUrl("cnicBack"),
      getCloudinaryUrl("companyRegistration"),
      getCloudinaryUrl("ntnCertificate"),
      getCloudinaryUrl("authorityLetter"),
      getCloudinaryUrl("nocCopy"),
      getCloudinaryUrl("ownershipDocuments"),
      getCloudinaryUrl("fardRegistry"),
      getCloudinaryUrl("landTransfer")
    ]);

    const updated = await prisma.societyVerification.update({
      where: { id: Number(id) },
      data: {
        societyName: body.societyName || existing.societyName,
        societyType: body.societyType || existing.societyType,
        city: body.city || existing.city,
        areaSector: body.areaSector || existing.areaSector,
        address: body.address || existing.address,
        googleMapsLocation: body.googleMapsLocation || existing.googleMapsLocation,
        website: body.website || existing.website,
        officialEmail: body.officialEmail || existing.officialEmail,
        officialContact: body.officialContact || existing.officialContact,

        developerCompany: body.developerCompany || existing.developerCompany,
        ownerName: body.ownerName || existing.ownerName,
        cnicNumber: body.cnicNumber || existing.cnicNumber,
        designation: body.designation || existing.designation,
        contactNumber: body.contactNumber || existing.contactNumber,
        emailAddress: body.emailAddress || existing.emailAddress,

        nocStatus: body.nocStatus || existing.nocStatus,
        approvingAuthority: body.approvingAuthority || existing.approvingAuthority,
        nocNumber: body.nocNumber || existing.nocNumber,
        nocIssueDate: body.nocIssueDate || existing.nocIssueDate,
        nocExpiryDate: body.nocExpiryDate || existing.nocExpiryDate,

        availablePlotSizes,

        cnicFront,
        cnicBack,
        companyRegistration,
        ntnCertificate,
        authorityLetter,
        nocCopy,
        ownershipDocuments,
        fardRegistry,
        landTransfer,
      },
    });

    res.status(200).json({ success: true, application: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update application" });
  }
};

// ADMIN: Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await prisma.societyVerification.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch all applications" });
  }
};

// ADMIN: Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.societyVerification.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch application" });
  }
};

// ADMIN: Update status and notes
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await prisma.societyVerification.update({
      where: { id: Number(id) },
      data: {
        status: status || undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    if (status === "APPROVED" && application.emailAddress) {
      try {
        let user = await prisma.user.findUnique({
          where: { email: application.emailAddress }
        });

        if (!user) {
          const randomPassword = crypto.randomBytes(8).toString("hex");
          const passwordHash = await bcrypt.hash(randomPassword, 10);

          user = await prisma.user.create({
            data: {
              fullName: application.ownerName || "Society Owner",
              email: application.emailAddress,
              phone: application.contactNumber,
              passwordHash,
              role: "SOCIETY_OWNER",
              isVerified: false,
              isActive: false,
            }
          });
        }

        // Link the society application to the user
        await prisma.societyVerification.update({
          where: { id: Number(id) },
          data: { userId: user.id }
        });


        // Generate token and save in PasswordReset
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.passwordReset.create({
          data: {
            userId: user.id,
            resetToken,
            tokenExpiry,
          }
        });

        // Send Approval Email with token
        await sendSocietyApprovalEmail(application.emailAddress, resetToken);
      } catch (err) {
        console.error("Error creating user or sending approval email:", err);
      }
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update application status" });
  }
};

// Setup Password for Society Owner via Token
exports.setupSocietyOwnerPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, message: "Token and password are required" });

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        resetToken: token,
        isUsed: false,
        tokenExpiry: { gt: new Date() }
      },
      include: { user: true }
    });

    if (!passwordReset) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: passwordReset.userId },
      data: {
        passwordHash,
        isVerified: true,
        isActive: true,
      }
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { isUsed: true, resetAt: new Date() }
    });

    // Initialize Profile and Seller Detail if not exists
    await prisma.userProfile.upsert({
      where: { userId: updatedUser.id },
      update: {},
      create: { userId: updatedUser.id }
    });

    await prisma.sellerDetail.upsert({
      where: { userId: updatedUser.id },
      update: {},
      create: { userId: updatedUser.id }
    });

    // Generate tokens
    const { generateAccessToken, generateRefreshToken } = require("../../../../server/utils/generateToken");
    const accessToken = generateAccessToken(updatedUser.id, updatedUser.role);
    const refreshToken = generateRefreshToken(updatedUser.id, updatedUser.role);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Password set successfully. You are now logged in.",
      accessToken,
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified
      }
    });

  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ success: false, message: "Failed to setup password" });
  }
};

// PUBLIC: Get all approved societies
exports.getPublicSocieties = async (req, res) => {
  try {
    const societies = await prisma.societyVerification.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        societyName: true,
        city: true,
        areaSector: true,
        address: true,
        nocStatus: true,
        nocCopy: true,
        availablePlotSizes: true,
        createdAt: true,
        userId: true,
      }
    });

    // Fetch properties for each society
    const societiesWithProperties = await Promise.all(
      societies.map(async (society) => {
        let properties = [];
        if (society.userId) {
          properties = await prisma.property.findMany({
            where: {
              userId: society.userId,
              status: "approved"
            },
            orderBy: { createdAt: "desc" }
          });

          // Need to serialize bigints for properties
          const serializeBigInt = (obj) => {
            return JSON.parse(
              JSON.stringify(obj, (_, value) =>
                typeof value === "bigint" ? value.toString() : value,
              ),
            );
          };
          properties = serializeBigInt(properties);
        }
        return {
          ...society,
          properties
        };
      })
    );

    res.status(200).json({ success: true, societies: societiesWithProperties });
  } catch (error) {
    console.error("Error fetching public societies:", error);
    res.status(500).json({ success: false, message: "Failed to fetch societies" });
  }
};

// PUBLIC: Get a specific approved society by ID with its properties
exports.getPublicSocietyById = async (req, res) => {
  try {
    const { id } = req.params;
    const society = await prisma.societyVerification.findFirst({
      where: {
        id: Number(id),
        status: "APPROVED"
      },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } }
      }
    });

    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found or not approved" });
    }

    // Fetch properties posted by the society owner (userId of the society)
    let properties = [];
    if (society.userId) {
      properties = await prisma.property.findMany({
        where: {
          userId: society.userId,
          status: "approved"
        },
        orderBy: { createdAt: "desc" }
      });

      // Need to serialize bigints for properties
      const serializeBigInt = (obj) => {
        return JSON.parse(
          JSON.stringify(obj, (_, value) =>
            typeof value === "bigint" ? value.toString() : value,
          ),
        );
      };
      properties = serializeBigInt(properties);
    }

    res.status(200).json({
      success: true,
      society,
      properties
    });
  } catch (error) {
    console.error("Error fetching public society:", error);
    res.status(500).json({ success: false, message: "Failed to fetch society" });
  }
};
