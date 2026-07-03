const prisma = require("../../../configs/prisma");
const { uploadToCloudinary } = require("../../../utils/uploadToCloudinary");
const {
  sendSocietyRegistrationEmail,
  sendSocietyApprovalEmail,
} = require("../../../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const optionalTrimmedString = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

const optionalUrl = optionalTrimmedString.refine(
  (value) => !value || z.string().url().safeParse(value).success,
  "Must be a valid URL",
);

const societyApplicationSchema = z.object({
  societyName: z.string().trim().min(2, "Society name is required"),
  societyType: z.enum(["Residential", "Commercial", "Mixed Use"], {
    message: "Society type is required",
  }),
  city: z.string().trim().min(2, "City is required"),
  areaSector: z.string().trim().min(2, "Area / Sector is required"),
  address: z.string().trim().min(5, "Complete address is required"),
  googleMapsLocation: optionalUrl,
  website: optionalUrl,
  officialEmail: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().email("Invalid official email").optional(),
  ),
  officialContact: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "Official contact must contain 10 to 15 digits only"),

  developerCompany: z.string().trim().min(2, "Company name is required"),
  ownerName: z.string().trim().min(2, "Owner/Rep name is required"),
  cnicNumber: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "CNIC must contain exactly 13 digits only"),
  designation: z.string().trim().min(2, "Designation is required"),
  contactNumber: z
    .string()
    .trim()
    .regex(/^03\d{9}$/, "Mobile number must be 11 digits and start with 03"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email"),

  nocStatus: z.enum(["Approved", "Under Process", "Not Available"], {
    message: "NOC Status is required",
  }),
  approvingAuthority: z.enum(
    ["LDA", "RDA", "CDA", "FDA", "MDA", "PHATA", "Other"],
    { message: "Approving authority is required" },
  ),
  nocNumber: optionalTrimmedString,
  nocIssueDate: optionalTrimmedString,
  nocExpiryDate: optionalTrimmedString,
  availablePlotSizes: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one plot size"),
});

const requiredApplicationFiles = [
  "cnicFront",
  "cnicBack",
  "companyRegistration",
  "nocCopy",
  "ownershipDocuments",
  "fardRegistry",
  "landTransfer",
];

const acceptedDocumentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const maxDocumentSize = 5 * 1024 * 1024;

const hasUploadedFile = (files, fieldName) =>
  Array.isArray(files?.[fieldName]) && files[fieldName].length > 0;

// Create a new Society Verification application
exports.createApplication = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    let body = req.body;

    // Parse availablePlotSizes if it was sent as JSON string
    let availablePlotSizes = [];
    if (body.availablePlotSizes) {
      try {
        availablePlotSizes = JSON.parse(body.availablePlotSizes);
      } catch (e) {
        availablePlotSizes = Array.isArray(body.availablePlotSizes)
          ? body.availablePlotSizes
          : [body.availablePlotSizes];
      }
    }

    const validation = societyApplicationSchema.safeParse({
      ...body,
      availablePlotSizes,
    });

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: firstIssue?.message || "Invalid society verification details",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    // Upload files to Cloudinary
    const files = req.files || {};
    const missingFiles = requiredApplicationFiles.filter(
      (fieldName) => !hasUploadedFile(files, fieldName),
    );

    if (missingFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required documents are missing",
        errors: missingFiles.reduce((acc, fieldName) => {
          acc[fieldName] = ["This document is required"];
          return acc;
        }, {}),
      });
    }

    const invalidFiles = Object.entries(files)
      .flatMap(([fieldName, fileList]) =>
        (fileList || []).map((file) => ({ fieldName, file })),
      )
      .filter(({ file }) => {
        return (
          !acceptedDocumentTypes.has(file.mimetype) ||
          file.size > maxDocumentSize
        );
      });

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Only JPG, PNG, WebP, PDF, DOC, or DOCX files up to 5MB are allowed",
        errors: invalidFiles.reduce((acc, { fieldName }) => {
          acc[fieldName] = ["Invalid file type or size"];
          return acc;
        }, {}),
      });
    }

    body = validation.data;
    availablePlotSizes = body.availablePlotSizes;

    const getCloudinaryUrl = async (fieldName) => {
      if (files[fieldName] && files[fieldName].length > 0) {
        try {
          const url = await uploadToCloudinary(
            files[fieldName][0].buffer,
            "zameen360/schemes",
          );
          return url;
        } catch (err) {
          console.error(`Error uploading ${fieldName} to Cloudinary:`, err);
          return null;
        }
      }
      return null;
    };

    const [
      cnicFront,
      cnicBack,
      companyRegistration,
      ntnCertificate,
      authorityLetter,
      nocCopy,
      ownershipDocuments,
      fardRegistry,
      landTransfer,
    ] = await Promise.all([
      getCloudinaryUrl("cnicFront"),
      getCloudinaryUrl("cnicBack"),
      getCloudinaryUrl("companyRegistration"),
      getCloudinaryUrl("ntnCertificate"),
      getCloudinaryUrl("authorityLetter"),
      getCloudinaryUrl("nocCopy"),
      getCloudinaryUrl("ownershipDocuments"),
      getCloudinaryUrl("fardRegistry"),
      getCloudinaryUrl("landTransfer"),
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
      sendSocietyRegistrationEmail(body.emailAddress).catch((err) =>
        console.error("Failed to send registration email:", err),
      );
    }

    res.status(201).json({ success: true, application: newApplication });
  } catch (error) {
    console.error("Error creating society application:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit application" });
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
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch applications" });
  }
};

// Update application (Only if PENDING)
exports.updateApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const body = req.body;

    const existing = await prisma.societyVerification.findUnique({
      where: { id: Number(id) },
    });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    if (existing.userId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });
    if (existing.status !== "PENDING")
      return res
        .status(400)
        .json({
          success: false,
          message: "Can only update pending applications",
        });

    let availablePlotSizes = existing.availablePlotSizes;
    if (body.availablePlotSizes) {
      try {
        availablePlotSizes = JSON.parse(body.availablePlotSizes);
      } catch (e) {
        availablePlotSizes = Array.isArray(body.availablePlotSizes)
          ? body.availablePlotSizes
          : [body.availablePlotSizes];
      }
    }

    const files = req.files || {};
    const getCloudinaryUrl = async (fieldName) => {
      if (files[fieldName] && files[fieldName].length > 0) {
        try {
          const url = await uploadToCloudinary(
            files[fieldName][0].buffer,
            "zameen360/schemes",
          );
          return url;
        } catch (err) {
          console.error(`Error uploading ${fieldName} to Cloudinary:`, err);
          return existing[fieldName];
        }
      }
      return existing[fieldName];
    };

    const [
      cnicFront,
      cnicBack,
      companyRegistration,
      ntnCertificate,
      authorityLetter,
      nocCopy,
      ownershipDocuments,
      fardRegistry,
      landTransfer,
    ] = await Promise.all([
      getCloudinaryUrl("cnicFront"),
      getCloudinaryUrl("cnicBack"),
      getCloudinaryUrl("companyRegistration"),
      getCloudinaryUrl("ntnCertificate"),
      getCloudinaryUrl("authorityLetter"),
      getCloudinaryUrl("nocCopy"),
      getCloudinaryUrl("ownershipDocuments"),
      getCloudinaryUrl("fardRegistry"),
      getCloudinaryUrl("landTransfer"),
    ]);

    const updated = await prisma.societyVerification.update({
      where: { id: Number(id) },
      data: {
        societyName: body.societyName || existing.societyName,
        societyType: body.societyType || existing.societyType,
        city: body.city || existing.city,
        areaSector: body.areaSector || existing.areaSector,
        address: body.address || existing.address,
        googleMapsLocation:
          body.googleMapsLocation || existing.googleMapsLocation,
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
        approvingAuthority:
          body.approvingAuthority || existing.approvingAuthority,
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
    res
      .status(500)
      .json({ success: false, message: "Failed to update application" });
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
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch all applications" });
  }
};

// ADMIN: Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.societyVerification.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    });

    if (!application)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    res.status(200).json({ success: true, application });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch application" });
  }
};

// ADMIN: Update status and notes
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
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
          where: { email: application.emailAddress },
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
            },
          });
        }

        // Link the society application to the user
        await prisma.societyVerification.update({
          where: { id: Number(id) },
          data: { userId: user.id },
        });

        // Generate a single-use setup token that remains valid for 24 hours.
        await prisma.passwordReset.updateMany({
          where: {
            userId: user.id,
            isUsed: false,
          },
          data: {
            isUsed: true,
          },
        });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.passwordReset.create({
          data: {
            userId: user.id,
            resetToken,
            tokenExpiry,
          },
        });

        // Send Approval Email with token
        await sendSocietyApprovalEmail(application.emailAddress, resetToken);
      } catch (err) {
        console.error("Error creating user or sending approval email:", err);
      }
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update application status" });
  }
};

// Setup Password for Society Owner via Token
exports.setupSocietyOwnerPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res
        .status(400)
        .json({ success: false, message: "Token and password are required" });

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        resetToken: token,
        isUsed: false,
        tokenExpiry: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!passwordReset) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: passwordReset.userId },
      data: {
        passwordHash,
        isVerified: true,
        isActive: true,
      },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { isUsed: true, resetAt: new Date() },
    });

    // Initialize Profile and Seller Detail if not exists
    await prisma.userProfile.upsert({
      where: { userId: updatedUser.id },
      update: {},
      create: { userId: updatedUser.id },
    });

    await prisma.sellerDetail.upsert({
      where: { userId: updatedUser.id },
      update: {},
      create: { userId: updatedUser.id },
    });

    // Generate tokens
    const {
      generateAccessToken,
      generateRefreshToken,
    } = require("../../../utils/generateToken");
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
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Error setting password:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to setup password" });
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
      },
    });

    // Fetch properties for each society
    const societiesWithProperties = await Promise.all(
      societies.map(async (society) => {
        let properties = [];
        if (society.userId) {
          properties = await prisma.property.findMany({
            where: {
              userId: society.userId,
              status: "approved",
            },
            orderBy: { createdAt: "desc" },
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
          properties,
        };
      }),
    );

    res.status(200).json({ success: true, societies: societiesWithProperties });
  } catch (error) {
    console.error("Error fetching public societies:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch societies" });
  }
};

// PUBLIC: Get a specific approved society by ID with its properties
exports.getPublicSocietyById = async (req, res) => {
  try {
    const { id } = req.params;
    const society = await prisma.societyVerification.findFirst({
      where: {
        id: Number(id),
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!society) {
      return res
        .status(404)
        .json({ success: false, message: "Society not found or not approved" });
    }

    // Fetch properties posted by the society owner (userId of the society)
    let properties = [];
    if (society.userId) {
      properties = await prisma.property.findMany({
        where: {
          userId: society.userId,
          status: "approved",
        },
        orderBy: { createdAt: "desc" },
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
      properties,
    });
  } catch (error) {
    console.error("Error fetching public society:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch society" });
  }
};

// OWNER: Update public society cover image
exports.updateSocietyCover = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Cover image is required" });
    }

    if (!req.file.mimetype?.startsWith("image/")) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Only image files are allowed for the cover",
        });
    }

    const society = await prisma.societyVerification.findUnique({
      where: { id: Number(id) },
      select: { id: true, userId: true },
    });

    if (!society) {
      return res
        .status(404)
        .json({ success: false, message: "Society not found" });
    }

    if (society.userId !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the society owner can update the cover image",
        });
    }

    const coverImage = await uploadToCloudinary(
      req.file.buffer,
      "zameen360/schemes/covers",
    );

    const updated = await prisma.societyVerification.update({
      where: { id: Number(id) },
      data: { coverImage },
    });

    res.status(200).json({ success: true, coverImage, society: updated });
  } catch (error) {
    console.error("Error updating society cover:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update cover image" });
  }
};
