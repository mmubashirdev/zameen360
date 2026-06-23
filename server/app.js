const path = require("path");
const dotenvPath = path.resolve(__dirname, ".env");
const morgan = require("morgan");
require("dotenv").config({ path: dotenvPath });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const prisma = require("../server/configs/prisma");
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

const app = express();

// ─── Create HTTP server (Socket.IO ke liye zaruri) ────────────────────────────
const httpServer = http.createServer(app);

// ─── Socket.IO setup ──────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
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
          data: { lastActiveAt: new Date() }
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
          data: { lastActiveAt: now }
        });
        
        // Notify others
        io.emit("user_status_update", { userId: Number(userId), isOnline: false, lastActiveAt: now.toISOString() });
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

// const apiLogger = (req, res, next) => {
//   const start = Date.now();
//   const originalSend = res.send;

//   res.send = function (data) {
//     console.log(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${Date.now() - start}ms`);
//     return originalSend.call(this, data);
//   };

//   next();
// };

// app.use(apiLogger);
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

["uploads/profiles", "uploads/properties", "uploads/messages", "uploads/schemes"].forEach((d) => {
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