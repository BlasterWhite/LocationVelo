import express from "express";
import { getAllFilters } from "../controllers/FilterController.js";

const router = express.Router();

// Route to get all bicycles
router.get("/", getAllFilters);
// Export the router
export default router;
