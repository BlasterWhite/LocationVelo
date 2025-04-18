import db from "../config/db.js";

/**
 * Get all rentals
 * @returns {Array} array of rentals
 */
export const getRentals = async () => {
  const result = await db.query(
    "SELECT r.rental_id, account_id, start_date, end_date, payment_status, rental_status, b.bicycle_id, bicycle_type, brand, model, lifetime, revision_cycle, last_km_service, counter_km, status, electric_assistance FROM rental r LEFT JOIN rental_association ra ON ra.rental_id=r.rental_id LEFT JOIN bicycle b ON b.bicycle_id=ra.bicycle_id"
  );
  return result.rows;
};

/**
 * Get a rental by its id
 * @param {Number} id id of the rental
 * @returns {Object|null} the rental object or null if not found
 */
export const getRentalById = async (id) => {
  const result = await db.query(
    "SELECT r.rental_id, account_id, start_date, end_date, payment_status, rental_status, b.bicycle_id, bicycle_type, brand, model, lifetime, revision_cycle, last_km_service, counter_km, status, electric_assistance FROM rental r LEFT JOIN rental_association ra ON ra.rental_id=r.rental_id LEFT JOIN bicycle b ON b.bicycle_id=ra.bicycle_id WHERE r.rental_id = $1",
    [id]
  );
  return result.rows;
};

/**
 * Get all rental by its bicycle id
 * @param {Number} bicycle_id id of the bicycle
 * @returns {Object|null} the rental object or null if not found
 */
export const getRentalByBicycleId = async (bicycle_id) => {
  const result = await db.query(
    "SELECT r.rental_id, account_id, start_date, end_date, payment_status, rental_status, b.bicycle_id, bicycle_type, brand, model, lifetime, revision_cycle, last_km_service, counter_km, status, electric_assistance FROM rental r LEFT JOIN rental_association ra ON ra.rental_id=r.rental_id LEFT JOIN bicycle b ON b.bicycle_id=ra.bicycle_id WHERE r.rental_id = $1",
    [id]
  );
  return result.rows;
};

/**
 * Get all unavailable rentals by bicycle id ans start date and end date
 * @param {Number} bicycle_id id of the bicycle
 * @param {Date} start_date start date
 * @param {Date} end_date end date
 * @returns {Object|null} the rental object or null if not found
 */
export const getAllUnavailableRentalsByDate = async (
  bicycle_id,
  start_date,
  end_date
) => {
  const result = await db.query(
    "SELECT r.rental_id, r.account_id, r.start_date, r.end_date, r.payment_status, r.rental_status FROM rental r JOIN rental_association ra ON ra.rental_id=r.rental_id WHERE ra.bicycle_id = $1 AND ((start_date <= $2 AND end_date >= $2) OR (start_date <= $3 AND end_date >= $3))",
    [bicycle_id, start_date, end_date]
  );
  return result.rows;
};

/**
 * Get a rental association by its ids
 * @param {Number} rental_id id of the rental
 * @param {Number} bicycle_id id of the bicycle
 * @returns {Object|null} the rental object or null if not found
 */
export const getRentalAssociationByIds = async (rental_id, bicycle_id) => {
  const result = await db.query(
    "SELECT * FROM rental_association WHERE rental_id = $1 AND bicycle_id = $2",
    [rental_id, bicycle_id]
  );
  return result.rows;
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
    [account_id, start_date, end_date, payment_status, rental_status]
  );
  return result.rows[0];
};

/**
 * Create a new rental association
 * @param {Object} rentalAssociationData object containing the rental data
 * @returns {Object} the created rental
 */
export const createRentalAssociation = async (rentalData) => {
  const { rental_id, bicycle_id } = rentalData;

  const result = await db.query(
    `INSERT INTO rental_association (
            rental_id, bicycle_id
        ) VALUES ($1, $2) 
        RETURNING *`,
    [rental_id, bicycle_id]
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
    [account_id, start_date, end_date, payment_status, rental_status, id]
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
    [id]
  );
  return result.rowCount > 0; // Return true if a row was deleted
};

/**
 * Delete a rental association by its ids
 * @param {Number} id id of the rental
 * @param {Number} id id of the bicycle
 * @returns {Boolean} true if deleted, false otherwise
 */
export const deleteRentalAssociation = async (rental_id, bicycle_id) => {
  const result = await db.query(
    `DELETE FROM rental_association WHERE rental_id = $1 AND bicycle_id = $2 RETURNING *`,
    [rental_id, bicycle_id]
  );
  return result.rowCount > 0; // Return true if a row was deleted
};

/**
 * Delete rental associations by its rental id
 * @param {Number} rental_id id of the rental
 * @returns {Boolean} true if deleted, false otherwise
 */
export const deleteRentalByRentalId = async (rental_id) => {
  const result = await db.query(
    `DELETE FROM rental_association WHERE rental_id = $1 RETURNING *`,
    [rental_id]
  );
  return result.rowCount > 0; // Return true if a row was deleted
};

/**
 * Get rental association from rental id
 * @param {Number} rental_id id of the rental
 * @returns {Array}
 */
export const getRentalAssociationByRentalId = async (rental_id) => {
  const result = await db.query(
    `SELECT * FROM rental_association WHERE rental_id = $1`,
    [rental_id]
  );
  return result.rows; // Return true if a row was deleted
};

/**
 * Get all rentals by account id
 * @param {Number} account_id id of the account
 * @returns {Array} array of rentals
 */
export const getRentalByAccountId = async (account_id) => {
  const result = await db.query("SELECT * FROM rental WHERE account_id = $1", [
    account_id,
  ]);
  return result.rows;
};
