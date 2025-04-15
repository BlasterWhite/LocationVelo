import express from "express";
import {
  getRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental,
} from "../controllers/RentalController.js";

const router = express.Router();

// Route to get all rentals
router.get("/", getRentals);
// Route to get a rental by ID
router.get("/:id", getRentalById);
// Route to create a new rental
router.post("/", createRental);
// Route to update a rental by ID
router.put("/:id", updateRental);
// Route to delete a rental by ID
router.delete("/:id", deleteRental);
// Export the router
export default router;

