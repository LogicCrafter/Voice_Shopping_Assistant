import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  count: { type: Number, default: 0 },
  lastAddedAt: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model("History", HistorySchema);
