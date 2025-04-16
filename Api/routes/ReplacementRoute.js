import express from "express";
import {
  getReplacements,
  getReplacementById,
  createReplacement,
  updateReplacement,
  deleteReplacement,
} from "../controllers/ReplacementController.js";

const router = express.Router();

// Route to get all replacements
router.get("/", getReplacements);
// Route to get a replacement by ID
router.get("/:id", getReplacementById);
// Route to create a new replacement
router.post("/", createReplacement);
// Route to update a replacement by ID
router.put("/:id", updateReplacement);
// Route to delete a replacement by ID
router.delete("/:id", deleteReplacement);
// Export the router
export default router;
