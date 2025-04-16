import db from "../config/db.js";

/**
 * Get all maintenance
 * @returns {Array} array of maintenance
 */
export const getMaintenance = async () => {
  const result = await db.query(
    "SELECT m.maintenance_id, bicycle_id, start_date, end_date, replacement_id, part_ref, part_name FROM maintenance m LEFT JOIN replacement r ON r.maintenance_id=m.maintenance_id",
  );
  return result.rows;
};

/**
 * Get a maintenance by its id
 * @param {Number} id id of the maintenance
 * @returns {Object|null} the maintenance object or null if not found
 */
export const getMaintenanceById = async (id) => {
  const result = await db.query(
    "SELECT m.maintenance_id, bicycle_id, start_date, end_date, replacement_id, part_ref, part_name FROM maintenance m LEFT JOIN replacement r ON r.maintenance_id=m.maintenance_id WHERE m.maintenance_id = $1",
    [id],
  );
  return result.rows; // Return the first row or null if not found
};

/**
 * Create a new maintenance
 * @param {Object} maintenanceData object containing the maintenance data
 * @returns {Object} the created maintenance
 */
export const createMaintenance = async (maintenanceData) => {
  const { bicycle_id, start_date, end_date } = maintenanceData;

  const result = await db.query(
    `INSERT INTO maintenance (
          bicycle_id, start_date, end_date
        ) VALUES ($1, $2, $3) 
        RETURNING *`,
    [bicycle_id, start_date, end_date],
  );
  return result.rows[0];
};

/**
 *  Update a maintenance by its id (Merge with existing data)
 * @param {Number} id id of the maintenance to update
 * @param {Object} maintenanceData object containing the updated maintenance data
 * @returns {Object} the updated maintenance
 */
export const updateMaintenance = async (id, maintenanceData) => {
  const { bicycle_id, start_date, end_date } = maintenanceData;

  const result = await db.query(
    `UPDATE maintenance SET 
              bicycle_id = $1, start_date = $2, end_date = $3
              WHERE maintenance_id = $4 RETURNING *`,
    [bicycle_id, start_date, end_date, id],
  );
  return result.rows[0]; // Return the updated maintenance
};

/**
 * Delete a maintenance by its id
 * @param {Number} id id of the maintenance to delete
 * @returns {Boolean} true if deleted, false if not found
 */
export const deleteMaintenance = async (id) => {
  const result = await db.query(
    "DELETE FROM maintenance WHERE maintenance_id = $1 RETURNING *",
    [id],
  );
  return result.rowCount > 0; // Returns true if a row was deleted
};
