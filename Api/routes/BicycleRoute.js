import express from "express";
import {
  getBicycles,
  getBicycleById,
  createBicycle,
  updateBicycle,
  deleteBicycle,
  getAvailableBicycleInPeriod,
} from "../controllers/BicycleController.js";

const router = express.Router();

// Route to get all bicycles
router.get("/", getBicycles);
// Route to get a bicycle by ID
router.get("/:id", getBicycleById);
// Route to create a new bicycle
router.post("/", createBicycle);
// Route to update a bicycle by ID
router.put("/:id", updateBicycle);
// Route to delete a bicycle by ID
router.delete("/:id", deleteBicycle);
// Route to get the available bicycle with date
router.get("/:startDate/:endDate", getAvailableBicycleInPeriod);
// Export the router
export default router;
