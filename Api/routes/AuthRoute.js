import express from "express";
import { login, register } from "../controllers/AuthController.js";

const router = express.Router();

// Route to handle user login
router.post("/login", login);

// Route to handle user registration
router.post("/register", register);

// Export the router
export default router;
