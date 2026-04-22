const express = require("express");
const cors = require("cors");
require("dotenv").config();
const prisma = require("./lib/prisma");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  }),
);
app.use(express.json());

const eventTypeRoutes = require("./routes/eventTypes");
const availabilityRoutes = require("./routes/availability");
const meetingRoutes = require("./routes/meetings");
const authRoutes = require("./routes/auth");
const contactsRoutes = require("./routes/contacts");

app.use("/api/event-types", eventTypeRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

app.get("/health", (req, res) => {
  res.json({status: "ok", database: "connected"});
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  prisma
    .$connect()
    .then(() => console.log("✓ Database connected"))
    .catch((err) => console.error("✗ Database connection error:", err.message));
});
