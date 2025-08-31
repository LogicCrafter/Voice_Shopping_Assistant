import { Router } from "express";
import { searchItems } from "../controllers/search.controller.js";

const router = Router();
router.get("/", searchItems);

export default router;
