import express from "express";
import {
  getRentals,
  getRentalById,
  getRentalByAccountId,
  createRental,
  createRentalAssociation,
  updateRental,
  deleteRental,
  deleteRentalAssociation,
} from "../controllers/RentalController.js";

const router = express.Router();

// Route to get all rentals
router.get("/", getRentals);
// Route to get all rentals by account ID
router.get("/account", getRentalByAccountId);
// Route to get a rental by ID
router.get("/:id", getRentalById);
// Route to create a new rental association
router.post("/associate", createRentalAssociation);
// Route to create a new rental
router.post("/", createRental);
// Route to update a rental by ID
router.put("/:id", updateRental);
// Route to delete a rental association by rental ID and bicycle ID
router.delete("/associate", deleteRentalAssociation);
// Route to delete a rental by ID
router.delete("/:id", deleteRental);
// Export the router
export default router;
