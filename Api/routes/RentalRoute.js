import express from "express";
import {
  getRentals,
  getRentalById,
  createRental,
  createRentalAssociation,
  updateRental,
  deleteRental,
  deleteRentalAssociation,
  deleteRentalAssociationsByRentalId,
  getRentalAssociationByRentalId,
  getRentalByAccountId,
} from "../controllers/RentalController.js";

const router = express.Router();

// Route to get all rentals
router.get("/", getRentals);
// Route to get a rental by ID
router.get("/account", getRentalByAccountId);
router.get("/:id", getRentalById);
// Route to create a new rental association
router.post("/associate", createRentalAssociation);
// Route to get all association from the rental ID
router.get("/associate/:rentalId", getRentalAssociationByRentalId);
// Route to create a new rental
router.post("/", createRental);
// Route to update a rental by ID
router.put("/:id", updateRental);
// Route to delete a rental association by rental ID
router.delete("/associate/:rentalId", deleteRentalAssociationsByRentalId);
// Route to delete a rental association by rental ID and bicycle ID
router.delete("/associate", deleteRentalAssociation);
// Route to delete a rental by ID
router.delete("/:id", deleteRental);
// Export the router
export default router;
