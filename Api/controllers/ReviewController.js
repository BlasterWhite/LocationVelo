import * as reviewModel from '../models/ReviewModel.js';

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
    const { rate, description, date_review } = req.body;

    if (!rate || !description || !date_review) {
        res.status(400).send("Rate, description, and date review are required");
        return;
    }

    const review = await reviewModel.createReview(req.body);
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
    if (!reviewId) {
        res.status(400).send("Review id not provided");
        return;
    }
    const review = await reviewModel.updateReview(reviewId, req.body);
    if (!review) {
        res.status(404).send("Review not found");
        return;
    }
    res.json(review);
};

/**
 * Delete a review by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    if (!reviewId) {
        res.status(400).send("Review id not provided");
        return;
    }
    const review = await reviewModel.deleteReview(reviewId);
    if (!review) {
        res.status(404).send("Review not found");
        return;
    }
    res.json({ message: "Review deleted successfully" });
};