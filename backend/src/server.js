import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listRoutes from "./routes/list.routes.js";
import suggestionRoutes from "./routes/suggestions.routes.js";
import searchRoutes from "./routes/search.routes.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api/list", listRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/search", searchRoutes);

// Mongo
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/voice_shopping";
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error("Mongo connection failed", err);
  process.exit(1);
});
