import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, default: 1 },
  cost: { type: Number, default: 0, min: 0 },
  category: { type: String, default: "other" },
  addedAt: { type: Date, default: Date.now },
  checked: { type: Boolean, default: false }
}, { versionKey: false });

export default mongoose.model("Item", ItemSchema);
