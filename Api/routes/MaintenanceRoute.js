import express from "express";
import {
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/MaintenanceController.js";

const router = express.Router();

// Route to get all maintenance
router.get("/", getMaintenance);
// Route to get a maintenance by ID
router.get("/:id", getMaintenanceById);
// Route to create a new maintenance
router.post("/", createMaintenance);
// Route to update a maintenance by ID
router.put("/:id", updateMaintenance);
// Route to delete a maintenance by ID
router.delete("/:id", deleteMaintenance);
// Export the router
export default router;
