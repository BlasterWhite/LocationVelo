import express from "express";
import { createNewsletter } from "../controllers/newsletterController.js";

const router = express.Router();
// Route to create a new newsletter
router.post("/", createNewsletter);
// Export the router
export default router;
