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
    lifetime,
    revision_cycle,
    last_km_service,
    status,
    electric_assistance,
  } = bicycleData;

  const result = await db.query(
    `INSERT INTO bicycle (
        bicycle_type, brand, model, lifetime, revision_cycle, 
        last_km_service, status, electric_assistance
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
    [
      bicycle_type,
      brand,
      model,
      lifetime,
      revision_cycle,
      last_km_service,
      status,
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
    lifetime,
    revision_cycle,
    last_km_service,
    status,
    electric_assistance,
  } = bicycleData;

  const result = await db.query(
    `UPDATE bicycle SET 
            bicycle_type = $1, brand = $2, model = $3, lifetime = $4, 
            revision_cycle = $5, last_km_service = $6, status = $7, 
            electric_assistance = $8 WHERE bicycle_id = $9 RETURNING *`,
    [
      bicycle_type,
      brand,
      model,
      lifetime,
      revision_cycle,
      last_km_service,
      status,
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
