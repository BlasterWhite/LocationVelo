import express from "express";
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/AccountController.js";

const router = express.Router();

// Route to get all accounts
router.get("/", getAccounts);
// Route to get an account by its id
router.get("/:id", getAccountById);
// Route to create an account
router.post("/", createAccount);
// Route to update an account
router.put("/:id", updateAccount);
// Route to delete an account
router.delete("/:id", deleteAccount);

// Export the router
export default router;
