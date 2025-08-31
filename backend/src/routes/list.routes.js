import express from "express";
import { getList, addItem, removeItem, updateItem, getTotalCost } from "../controllers/list.controller.js";

const router = express.Router();

router.get("/", getList);
router.get("/total-cost", getTotalCost);
router.post("/", addItem);
router.delete("/:id", removeItem);
router.patch("/:id", updateItem);

export default router;
