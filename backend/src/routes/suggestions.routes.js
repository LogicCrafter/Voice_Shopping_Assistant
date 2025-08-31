import { Router } from "express";
import { getSuggestions, getSubstitutes } from "../controllers/suggestions.controller.js";

const router = Router();
router.get("/", getSuggestions);
router.get("/substitutes", getSubstitutes);

export default router;
