const path = require("path");
require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const medicineRoutes = require("./routes/medicineRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { initReminderSchedulers } = require("./services/reminderSchedulers");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Behind Render / other reverse proxies so req.protocol and image URLs use https
app.set("trust proxy", 1);

function corsOrigin() {
  const raw = process.env.CLIENT_ORIGIN;
  if (!raw || raw === "*") return "*";
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length === 1 ? list[0] : list;
}

app.use(cors({ origin: corsOrigin() }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", medicineRoutes);
app.use("/api", notificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    try {
      await initReminderSchedulers();
    } catch (err) {
      console.error("Reminder scheduler init failed:", err.message || err);
    }
    app.listen(PORT, () => {
      console.log(`MedSafe server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
