import * as replacementModel from "../models/ReplacementModel.js";
import * as maintenanceModel from "../models/MaintenanceModel.js";

/**
 * Get all replacements
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getReplacements = async (req, res) => {
  const replacement = await replacementModel.getReplacements();
  if (!replacement) {
    res.status(404).send("Replacement not found");
    return;
  }
  res.json(replacement);
};

/**
 * Get a by replacement by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getReplacementById = async (req, res) => {
  const replacementId = req.params.id;
  if (!replacementId) {
    res.status(400).send("Replacement id not provided");
    return;
  }
  const replacement = await replacementModel.getReplacementById(replacementId);
  if (!replacement) {
    res.status(404).send("Replacement not found");
    return;
  }
  res.json(replacement);
};

/**
 * Create a replacement
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const createReplacement = async (req, res) => {
  const { maintenance_id, part_ref, part_name } = req.body || {};

  if (!maintenance_id || !part_ref || !part_name) {
    res
      .status(400)
      .send("Maintenance id, part ref, and part name are required");
    return;
  }

  const maintenance = await maintenanceModel.getMaintenanceById(maintenance_id);
  if (!maintenance) {
    res.status(404).send("Maintenance not found");
    return;
  }

  const newReplacement = await replacementModel.createReplacement({
    maintenance_id,
    part_ref,
    part_name,
  });

  // Check if the replacement was created successfully
  if (!newReplacement) {
    res.status(500).send("Internal Server Error");
    return;
  }

  // Respond with the created replacement
  res.status(201).json(newReplacement);
};

/**
 * Update a replacement by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const updateReplacement = async (req, res) => {
  const replacementId = req.params.id;

  const replacement = await replacementModel.getReplacementById(replacementId);

  if (!replacement) {
    res.status(404).send("Replacement not found");
    return;
  }

  const { maintenance_id, part_ref, part_name } = req.body || {};

  const maintenance = await maintenanceModel.getMaintenanceById(maintenance_id);
  if (!maintenance) {
    res.status(404).send("Maintenance not found");
    return;
  }

  const mergedReplacement = {
    maintenance_id: maintenance_id || replacement.maintenance_id,
    part_ref: part_ref || replacement.part_ref,
    part_name: part_name || replacement.part_name,
  };
  const updatedReplacement = await replacementModel.updateReplacement(
    replacementId,
    mergedReplacement,
  );

  if (!updatedReplacement) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.json(updatedReplacement);
};

/**
 *  Delete a replacement by its ID
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const deleteReplacement = async (req, res) => {
  const replacementId = req.params.id;

  const maintenance = await maintenanceModel.getMaintenanceById(replacementId);

  if (!maintenance) {
    res.status(404).send("Maintenance not found");
    return;
  }

  const deleted = await maintenanceModel.deleteMaintenance(maintenanceId);

  if (!deleted) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.status(204).send();
};
