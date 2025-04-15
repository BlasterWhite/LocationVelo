import * as reviewModel from "../models/ReviewModel.js";
import * as rentalModel from "../models/RentalModel.js";

/**
 * Get all reviews
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const getReviews = async (req, res) => {
  const reviews = await reviewModel.getReviews();
  if (!reviews) {
    res.status(404).send("Reviews not found");
    return;
  }
  res.json(reviews);
};

/**
 * Get a review by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const getReviewById = async (req, res) => {
  const reviewId = req.params.id;
  if (!reviewId) {
    res.status(400).send("Review id not provided");
    return;
  }
  const review = await reviewModel.getReviewById(reviewId);
  if (!review) {
    res.status(404).send("Review not found");
    return;
  }
  res.json(review);
};

/**
 * Create a review
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const createReview = async (req, res) => {
  const { rental_id, rate, description, date_review } = req.body;

  if (!rental_id || !rate || !description || !date_review) {
    res.status(400).send("Rate, description, and date review are required");
    return;
  }
  const rental = await rentalModel.getRentalById(rental_id);
  if (!rental) {
    res.status(400).send("Invalid Rental ID");
    return;
  }

  const review = await reviewModel.createReview(req.body);

  if (!review) {
    res.status(500).send("Internal Server Error");
    return;
  }
  res.status(201).json(review);
};

/**
 * Update a review by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await reviewModel.getReviewById(reviewId);
  if (!review) {
    res.status(400).send("Invalid Review");
    return;
  }

  const { rental_id, rate, description, date_review } = req.body;

  const rentalId = req.body.rental_id;
  const rental = await rentalModel.getRentalById(rentalId);

  if (!rental) {
    res.status(400).send("Invalid Rental ID");
    return;
  }

  const mergedReview = {
    rental_id: rental_id || review.rental_id,
    rate: rate || review.rate,
    description: description || review.description,
    date_review: date_review || review.date_review,
  };

  const updatedReview = await reviewModel.updateReview(reviewId, mergedReview);
  if (!review) {
    res.status(500).send("INternal Server Error");
    return;
  }
  res.json(updatedReview);
};

/**
 * Delete a review by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  const review = await reviewModel.getReviewById(reviewId);
  if (!review) {
    res.status(400).send("Invalid Review");
    return;
  }
  const deleted = await reviewModel.deleteReview(reviewId);
  if (!deleted) {
    res.status(500).send("Internal Server Error");
    return;
  }
  res.status(204).send();
};
