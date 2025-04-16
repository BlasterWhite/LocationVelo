import express from "express";
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/AccountController.js";
import { adminOrItself } from "../middlewares/adminOrItselfMiddleware.js";
import { onlyAdminMiddleware } from "../middlewares/onlyAdminMiddleware.js";

const router = express.Router();

// Route to get all accounts
router.get("/", onlyAdminMiddleware, getAccounts);
// Route to get an account by its id
router.get("/:id", adminOrItself, getAccountById);
// Route to create an account
router.post("/", onlyAdminMiddleware, createAccount);
// Route to update an account
router.put("/:id", adminOrItself, updateAccount);
// Route to delete an account
router.delete("/:id", adminOrItself, deleteAccount);

// Export the router
export default router;
