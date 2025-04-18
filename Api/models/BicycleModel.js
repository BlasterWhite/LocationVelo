import db from "../config/db.js";

/**
 * Get all bicycles
 * @returns {Array} array of bicycles
 */
export const getBicycles = async () => {
  const result = await db.query("SELECT * FROM bicycle");
  return result.rows;
};

/**
 * Get a bicycle by its id
 * @param {Number} id id of the bicycle
 * @returns {Object|null} the bicycle object or null if not found
 */
export const getBicycleById = async (id) => {
  const result = await db.query("SELECT * FROM bicycle WHERE bicycle_id = $1", [
    id,
  ]);
  return result?.rows?.[0] || null; // Return the first row or null if not found
};

/**
 * Create a new bicycle
 * @param {Object} bicycleData object containing the bicycle data
 * @returns {Object} the created bicycle
 */
export const createBicycle = async (bicycleData) => {
  const {
    bicycle_type,
    brand,
    model,
    image,
    lifetime,
    price_per_day,
    revision_cycle,
    last_km_service,
    counter_km,
    electric_assistance,
  } = bicycleData;

  const result = await db.query(
    `INSERT INTO bicycle (
        bicycle_type, brand, model, image, lifetime, price_per_day, revision_cycle,
        last_km_service, counter_km, electric_assistance
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
    [
      bicycle_type,
      brand,
      model,
      image,
      lifetime,
      price_per_day,
      revision_cycle,
      last_km_service,
      counter_km,
      electric_assistance,
    ],
  );
  return result.rows[0];
};

/**
 *  Update a bicycle by its id (Merge with existing data)
 * @param {Number} id id of the bicycle to update
 * @param {Object} bicycleData object containing the updated bicycle data
 * @returns {Object} the updated bicycle
 */
export const updateBicycle = async (id, bicycleData) => {
  const {
    bicycle_type,
    brand,
    model,
    image,
    lifetime,
    price_per_day,
    revision_cycle,
    last_km_service,
    counter_km,
    electric_assistance,
  } = bicycleData;

  const result = await db.query(
    `UPDATE bicycle SET 
            bicycle_type = $1, brand = $2, model = $3, image = $4, 
            lifetime = $5, price_per_day = $6, revision_cycle = $7, 
            last_km_service = $8, counter_km = $9, electric_assistance = $10 WHERE bicycle_id = $11 RETURNING *`,
    [
      bicycle_type,
      brand,
      model,
      image,
      lifetime,
      price_per_day,
      revision_cycle,
      last_km_service,
      counter_km,
      electric_assistance,
      id,
    ],
  );
  return result.rows[0]; // Return the updated bicycle
};

/**
 * Delete a bicycle by its id
 * @param {Number} id id of the bicycle to delete
 * @returns {Boolean} true if deleted, false if not found
 */
export const deleteBicycle = async (id) => {
  const result = await db.query(
    "DELETE FROM bicycle WHERE bicycle_id = $1 RETURNING *",
    [id],
  );
  return result.rowCount > 0; // Returns true if a row was deleted
};

/**
 * Get pricing information for a bicycles
 * @returns {Object} object containing pricing information
 */
export const getBicyclePricing = async () => {
  const result = await db.query(
    "SELECT MAX(price_per_day) AS max_price, MIN(price_per_day) AS min_price, AVG(price_per_day) AS avg_price FROM bicycle",
  );
  return result.rows;
};

export const getAllBrands = async () => {
  const result = await db.query("SELECT DISTINCT brand FROM bicycle");
  return result.rows;
};

export const getAllModels = async () => {
  const result = await db.query("SELECT DISTINCT model FROM bicycle");
  return result.rows;
};

export const getAllTypes = async () => {
  const result = await db.query("SELECT DISTINCT bicycle_type FROM bicycle");
  return result.rows;
};

export const getAvailableBicyclesOnPeriod = async (startDate, endDate) => {
  const result = await db.query(
    `SELECT * FROM bicycle b
    LEFT JOIN rental_association ra ON ra.bicycle_id=b.bicycle_id
    LEFT JOIN rental r ON r.rental_id=ra.rental_id
    LEFT JOIN maintenance m ON m.bicycle_id=b.bicycle_id
    WHERE ((r.start_date IS NULL AND r.end_date IS NULL) AND
    (m.start_date IS NULL AND m.end_date IS NULL))
    OR (
        ((
        r.start_date < $1 AND 
        r.start_date < $2 AND
        r.end_date < $1 AND 
        r.end_date < $2
        ) OR
        (
            r.start_date > $1 AND 
            r.start_date > $2 AND
            r.end_date > $1 AND 
            r.end_date > $2
        )) AND
        ((
            m.start_date < $1 AND 
            m.start_date < $2 AND
            m.end_date < $1 AND 
            m.end_date < $2
        ) OR
        (
            m.start_date > $1 AND 
            m.start_date > $2 AND
            m.end_date > $1 AND 
            m.end_date > $2
        ))
    )`,
    [startDate, endDate]
  );
  return result.rows;
};