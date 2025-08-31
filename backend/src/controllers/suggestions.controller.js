import History from "../models/History.js";
import { SEASONAL } from "../data/seasonal.js";
import { SUBSTITUTES } from "../data/substitutes.js";

export async function getSuggestions(req, res) {
  const month = new Date().getMonth() + 1;
  const topHistory = await History.find().sort({ count: -1, lastAddedAt: -1 }).limit(5);
  const seasonal = SEASONAL.filter(s => s.months.includes(month)).map(s => s.name);
  res.json({
    likely: topHistory.map(h => h.name),
    seasonal
  });
}

export async function getSubstitutes(req, res) {
  const name = (req.query.name || "").toLowerCase();
  res.json({ name, substitutes: SUBSTITUTES[name] || [] });
}
