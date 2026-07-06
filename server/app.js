const path = require("path");
const dotenvPath = path.resolve(__dirname, ".env");
const morgan = require("morgan");
require("dotenv").config({ path: dotenvPath });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const prisma = require("./configs/prisma");
const passport = require("./configs/passport");
const cors = require("cors");
const fs = require("fs");

const index = require("./modules/auth/routes/index");
const propertyRoutes = require("./modules/marketplace/routes/property.routes");
const sellerRoutes = require("./modules/sellerProfile/routes/sellerRoutes");
const buyerRoutes = require("./modules/buyerProfile/routes/buyerRoutes");
const supportRoutes = require("./modules/support/routes/support.routes");
const contactusRoutes = require("./modules/contactus/routes/contactus.routes");
const messageRoutes = require("./modules/message/routes/message.routes");
const schemeRoutes = require("./modules/schemes/routes/scheme.routes");
const reviewRoutes = require("./modules/review/routes/review.routes");
const aiRoutes = require("./modules/ai/routes/ai.routes");
const paymentRoutes = require("./modules/payment/routes/payment.routes");
const paymentController = require("./modules/payment/controllers/payment.controller");

const chatRoutes = require("./modules/chatbot/routes/chat.routes");
const app = express();

const defaultClientOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredClientOrigin = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.replace(/\/$/, "")
  : null;
const allowedOrigins = new Set(
  [configuredClientOrigin, ...defaultClientOrigins]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, "")),
);

const isAllowedNgrokOrigin = (origin) => {
  try {
    const hostname = new URL(origin).hostname;
    return hostname.endsWith(".ngrok-free.dev");
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.has(origin.replace(/\/$/, "")) ||
      isAllowedNgrokOrigin(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// ─── Create HTTP server (Socket.IO ke liye zaruri) ────────────────────────────
const httpServer = http.createServer(app);

// ─── Socket.IO setup ──────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: corsOptions,
});

// ─── Socket.IO ko globally available karo (controllers mein use karne ke liye)
app.set("io", io);

// ─── Online Users Tracking ──────────────────────────────────────────────────────
const onlineUsers = new Map(); // Map<socketId, userId>
app.set("onlineUsers", onlineUsers);

// ─── Socket.IO connection handling ────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // User apne userId ke room mein join kare
  // (taake sirf use notification mile)
  socket.on("join_user_room", async (userId) => {
    console.log(`Received join_user_room event with userId:`, userId);
    if (userId) {
      socket.join(`user_${userId}`);
      onlineUsers.set(socket.id, Number(userId));
      console.log(`👤 User ${userId} joined room: user_${userId}`);

      // Notify others
      io.emit("user_status_update", { userId: Number(userId), isOnline: true });

      // Update DB
      try {
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { lastActiveAt: new Date() },
        });
      } catch (err) {
        console.error("Error updating lastActiveAt on connect:", err);
      }
    }
  });

  // Admin apne room mein join kare
  socket.on("join_admin_room", () => {
    socket.join("admin_room");
    console.log(`🔑 Admin joined admin_room`);
  });

  // Public room - sab approved properties dekhne ke liye
  socket.on("join_public", () => {
    socket.join("public_room");
    console.log(`🌍 Client joined public_room`);
  });

  socket.on("disconnect", async () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    const userId = onlineUsers.get(socket.id);
    if (userId) {
      onlineUsers.delete(socket.id);

      // Update DB
      try {
        const now = new Date();
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { lastActiveAt: now },
        });

        // Notify others
        io.emit("user_status_update", {
          userId: Number(userId),
          isOnline: false,
          lastActiveAt: now.toISOString(),
        });
      } catch (err) {
        console.error("Error updating lastActiveAt on disconnect:", err);
      }
    }
  });
});

// ─── Middleware ────────────────────────────────────────────────────────────────
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(morgan("dev"));

app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/ai", aiRoutes);

app.use("/api/payments", paymentRoutes);
console.log("Payment router mounted");

[
  "uploads/profiles",
  "uploads/properties",
  "uploads/messages",
  "uploads/schemes",
].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", index);
app.use("/api/properties", propertyRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/contactus", contactusRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Zameen 360 API v1.0" });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message });
});

// ─── Start Server (app.listen → httpServer.listen) ───────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Zameen 360 running on http://0.0.0.0:${PORT}`);
  console.log(`Socket.IO ready`);
});
