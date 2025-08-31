import Item from "../models/Item.js";
import History from "../models/History.js";
import { categorize } from "../utils/categorize.js";

export async function getList(req, res) {
  const items = await Item.find().sort({ addedAt: -1 });
  res.json(items);
}

export async function getTotalCost(req, res) {
  try {
    const items = await Item.find();
    const totalCost = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    res.json({ totalCost: Math.round(totalCost * 100) / 100 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to get total cost" });
  }
}

export async function addItem(req, res) {
  try {
    const { name, quantity, cost } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const item = await Item.create({ 
      name, 
      quantity: quantity || 1, 
      cost: cost || 0,
      category: categorize(name) 
    });

    // bump history
    await History.findOneAndUpdate(
      { name: name.toLowerCase() },
      { $inc: { count: 1 }, $set: { lastAddedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to add item" });
  }
}

export async function removeItem(req, res) {
  try {
    const { id } = req.params;
    const doc = await Item.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to remove" });
  }
}

export async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { quantity, checked, cost } = req.body;
    const doc = await Item.findByIdAndUpdate(id, { $set: { quantity, checked, cost } }, { new: true });
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to update" });
  }
}
