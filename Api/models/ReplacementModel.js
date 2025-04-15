import db from "../config/db.js";

/**
 * Get all replacements
 * @returns {Array} array of replacements
 */
export const getReplacements = async () => {
  const result = await db.query("SELECT * FROM replacement");
  return result.rows;
};

/**
 * Get a replacement by its id
 * @param {Number} id id of the replacement
 * @returns {Object|null} the replacement object or null if not found
 */
export const getReplacementById = async (id) => {
  const result = await db.query(
    "SELECT * FROM replacement WHERE replacement_id = $1",
    [id],
  );
  return result?.rows?.[0] || null; // Return the first row or null if not found
};

/**
 * Create a new replacement
 * @param {Object} replacementData object containing the replacement data
 * @returns {Object} the created replacement
 */
export const createReplacement = async (replacementData) => {
  const { maintenance_id, part_ref, part_name } = replacementData;

  const result = await db.query(
    `INSERT INTO replacement (
          maintenance_id, part_ref, part_name
        ) VALUES ($1, $2, $3) 
        RETURNING *`,
    [maintenance_id, part_ref, part_name],
  );
  return result.rows[0];
};

/**
 *  Update a replacement by its id (Merge with existing data)
 * @param {Number} id id of the replacement to update
 * @param {Object} replacementData object containing the updated replacement data
 * @returns {Object} the updated replacement
 */
export const updateReplacement = async (id, replacementData) => {
  const { maintenance_id, part_ref, part_name } = replacementData;

  const result = await db.query(
    `UPDATE replacement SET 
              maintenance_id = $1, part_ref = $2, part_name = $3
              WHERE replacement_id = $4 RETURNING *`,
    [maintenance_id, part_ref, part_name, id],
  );
  return result.rows[0]; // Return the updated maintenance
};

/**
 * Delete a replacement by its id
 * @param {Number} id id of the replacement to delete
 * @returns {Boolean} true if deleted, false if not found
 */
export const deleteReplacement = async (id) => {
  const result = await db.query(
    "DELETE FROM replacement WHERE replacement_id = $1 RETURNING *",
    [id],
  );
  return result.rowCount > 0; // Returns true if a row was deleted
};
