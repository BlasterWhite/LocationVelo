import db from "../config/db.js";

/**
 * Get all reviews
 * @returns {Array} array of reviews
 */
export const getReviews = async () => {
  const result = await db.query("SELECT * FROM review");
  return result.rows;
};

/**
 * Get a review by its id
 * @param {Number} id id of the review
 * @returns {Object|null} the review object or null if not found
 */
export const getReviewById = async (id) => {
  const result = await db.query("SELECT * FROM review WHERE review_id = $1", [
    id,
  ]);
  return result?.rows?.[0] || null; // Return the first row or null if not found
};
/**
 * Create a new review
 * @param {Object} reviewData object containing the review data
 * @returns {Object} the created review
 */
export const createReview = async (reviewData) => {
  const { rental_id, rate, description, date_review } = reviewData;

  const result = await db.query(
    `INSERT INTO review (
        rental_id, rate, description, date_review
      ) VALUES ($1, $2, $3, $4) 
      RETURNING *`,
    [rental_id, rate, description, date_review]
  );
  return result.rows[0];
};

/**
 * Update a review by its id
 * @param {Number} id id of the review to update
 * @returns {Object|null} the updated review object or null if not found
 */
export const updateReview = async (id, reviewData) => {
  const { rental_id, rate, description, date_review } = reviewData;

  const result = await db.query(
    `UPDATE review
      SET rental_id = $1, rate = $2, description = $3, date_review = $4
      WHERE review_id = $5
      RETURNING *`,
    [rental_id, rate, description, date_review, id]
  );
  return result.rows[0];
};
/**
 * Delete a review by its id
 * @param {Number} id id of the review to delete
 * @returns {Boolean} true if the review was deleted, false otherwise
 */

export const deleteReview = async (id) => {
  const result = await db.query("DELETE FROM review WHERE review_id = $1", [
    id,
  ]);
  return result.rowCount > 0;
};

/**
 * Get reviews by rental id
 * @param {Number} rentalId id of the rental
 * @returns {Array} array of reviews for the rental
 */
export const getReviewsByRentalId = async (rentalId) => {
  const result = await db.query("SELECT * FROM review WHERE rental_id = $1", [
    rentalId,
  ]);
  return result.rows;
};
