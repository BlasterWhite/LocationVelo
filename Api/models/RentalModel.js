import db from "../config/db.js";

/**
 * Get all rentals
 * @returns {Array} array of rentals
 */
export const getRentals = async () => {
  const result = await db.query("SELECT * FROM rental");
  return result.rows;
};

/**
 * Get a rental by its id
 * @param {Number} id id of the rental
 * @returns {Object|null} the rental object or null if not found
 */
export const getRentalById = async (id) => {
  const result = await db.query("SELECT * FROM rental WHERE rental_id = $1", [
    id,
  ]);
  return result?.rows?.[0] || null; // Return the first row or null if not found
};

/**
 * Get all rentals with its bicycles
 * @returns {Array} array of rentals with its bicycles
 */
export const getAllRentalsWithItsBicycles = async () => {
  const result = await db.query("SELECT r.rental_id, b.bicycle_id, account_id, start_date, end_date, payment_status, rental_status, bicycle_type, brand, model, lifetime, revision_cycle, last_km_service, status, electric_assistance FROM rental_association ra JOIN rental r ON r.rental_id=ra.rental_id JOIN bicycle b ON b.bicycle_id=ra.bicycle_id");
  return result.rows;
}

/**
 * Get a rental by its id with its bicycles
 * @param {Number} id id of the rental
 * @returns {Object|null} the rental with its bicycles object or null if not found
 */
export const getRentalByIdWithItsBicycles = async (id) => {
  const result = await db.query("SELECT r.rental_id, b.bicycle_id, account_id, start_date, end_date, payment_status, rental_status, bicycle_type, brand, model, lifetime, revision_cycle, last_km_service, status, electric_assistance FROM rental_association ra JOIN rental r ON r.rental_id=ra.rental_id JOIN bicycle b ON b.bicycle_id=ra.bicycle_id WHERE r.rental_id = $1", [
    id,
  ]);
  return result?.rows?.[0] || null; // Return the first row or null if not found
};



/**
 * Create a new rental
 * @param {Object} rentalData object containing the rental data
 * @returns {Object} the created rental
 */
export const createRental = async (rentalData) => {
  const { account_id, start_date, end_date, payment_status, rental_status } =
    rentalData;

  const result = await db.query(
    `INSERT INTO rental (
            account_id, start_date, end_date, payment_status, rental_status
        ) VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
    [account_id, start_date, end_date, payment_status, rental_status],
  );
  return result.rows[0];
};

/**
 * Update a rental by its id
 * @param {Number} id id of the rental to update
 * @returns {Object|null} the updated rental object or null if not found
 */
export const updateRental = async (id, rentalData) => {
  const { account_id, start_date, end_date, payment_status, rental_status } =
    rentalData;
  const result = await db.query(
    `UPDATE rental SET 
            account_id = $1, 
            start_date = $2, 
            end_date = $3, 
            payment_status = $4, 
            rental_status = $5
        WHERE rental_id = $6
        RETURNING *`,
    [account_id, start_date, end_date, payment_status, rental_status, id],
  );
  return result.rows[0] || null; // Return the first row or null if not found
};

/**
 * Delete a rental by its id
 * @param {Number} id id of the rental to delete
 * @returns {Boolean} true if deleted, false otherwise
 */
export const deleteRental = async (id) => {
  const result = await db.query(
    `DELETE FROM rental WHERE rental_id = $1 RETURNING *`,
    [id],
  );
  return result.rowCount > 0; // Return true if a row was deleted
};
