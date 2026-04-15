import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db";
import authRoutes from "./routes/auth_routes";

dotenv.config();
connectDB();

const app = express();

// ── Security & CORS ──────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body Parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Request Logging ───────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ── Health Check ─────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "🏥 MediQueue API is running" });
});

// ── API Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── 404 Handler ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} | ENV: ${process.env.NODE_ENV || "development"}`)
);
