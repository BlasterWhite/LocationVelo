import db from "../config/db.js";

/**
 * Get all bicycles
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getBicycles = (req, res) => {
  db.query("SELECT * FROM bicycle", (err, result) => {
    if (err) {
      console.error("Error fetching bicycles:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(result.rows);
  });
};

/**
 * Get a by bicycle by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getBicycleById = (req, res) => {
  const bicycleId = req.params.id;
  db.query(
    "SELECT * FROM bicycle WHERE bicycle_id = $1",
    [bicycleId],
    (err, result) => {
      if (err) {
        console.error("Error fetching bicycle:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      if (result.rows.length === 0) {
        res.status(404).send("Bicycle not found");
        return;
      }
      res.json(result.rows[0]);
    }
  );
};

/**
 * Create a bicycle
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const createBicycle = (req, res) => {
  const {
    bicycle_type,
    brand,
    model,
    lifetime,
    revision_cycle,
    last_km_service,
    status,
    electric_assistance,
  } = req.body;
  db.query(
    "INSERT INTO bicycle (bicycle_type, brand, model, lifetime, revision_cycle, last_km_service, status, electric_assistance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *",
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
    (err, result) => {
      if (err) {
        console.error("Error creating bicycle:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(201).json(result.rows[0]);
    }
  );
};

/**
 * Update a bicycle by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const updateBicycle = (req, res) => {
  const bicycleId = req.params.id;
  if (bicycleId) {
    const {
      bicycle_type,
      brand,
      model,
      lifetime,
      revision_cycle,
      last_km_service,
      status,
      electric_assistance,
    } = req.body;
    // TODO: Check for each field if it is provided in the request body and only update those fields
    db.query(
      "UPDATE bicycle SET bicycle_type = $1, brand = $2, model = $3, lifetime = $4, revision_cycle = $5, last_km_service = $6, status = $7, electric_assistance = $8 WHERE bicycle_id = $9 RETURNING *",
      [
        bicycle_type,
        brand,
        model,
        lifetime,
        revision_cycle,
        last_km_service,
        status,
        electric_assistance,
        bicycleId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating bicycle:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        if (result.rows.length === 0) {
          res.status(404).send("Bicycle not found");
          return;
        }
        res.json(result.rows[0]);
      }
    );
  } else {
    res.status(401).send("Bicycle id not provided");
  }
};

/**
 *  Delete a bicycle by its ID
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const deleteBicycle = (req, res) => {
  const bicycleId = req.params.id;
  db.query(
    "DELETE FROM bicycle WHERE bicycle_id = $1 RETURNING *",
    [bicycleId],
    (err, result) => {
      if (err) {
        console.error("Error deleting bicycle:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      if (result.rows.length === 0) {
        res.status(404).send("Bicycle not found");
        return;
      }
      res.json(result.rows[0]);
    }
  );
};
