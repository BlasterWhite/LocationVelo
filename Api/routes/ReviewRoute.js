import express from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/ReviewController.js";

const router = express.Router();

router.get("/", getReviews); // Route to get all reviews
router.get("/:id", getReviewById); // Route to get a review by ID
router.post("/", createReview); // Route to create a new review
router.put("/:id", updateReview); // Route to update a review by ID
router.delete("/:id", deleteReview); // Route to delete a review by ID
// Export the router
export default router;
