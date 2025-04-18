import * as maintenanceModel from "../models/MaintenanceModel.js";
import * as bicycleModel from "../models/BicycleModel.js";

/**
 * Get all maintenance
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getMaintenance = async (req, res) => {
  const maintenance = await maintenanceModel.getMaintenance();
  if (!maintenance) {
    res.status(404).send("Maintenance not found");
    return;
  }

  let mergedMaintenance = [];
  maintenance.forEach((item) => {
    // si la maintenance n'est pas présente dans le tableau mergedMaintenance
    if (
      !mergedMaintenance.find(
        (mergedItem) => mergedItem.maintenance_id === item.maintenance_id,
      )
    ) {
      mergedMaintenance.push({
        maintenance_id: item.maintenance_id,
        bicycle_id: item.bicycle_id,
        start_date: item.start_date,
        end_date: item.end_date,
        replacements: [],
      });
    }

    if (item.replacement_id !== null) {
      const index = mergedMaintenance.findIndex(
        (mergedItem) => mergedItem.maintenance_id === item.maintenance_id,
      );
      mergedMaintenance[index].replacements.push({
        replacement_id: item.replacement_id,
        part_ref: item.part_ref,
        part_name: item.part_name,
      });
    }
  });

  res.json(mergedMaintenance);
};

/**
 * Get a maintenance by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getMaintenanceById = async (req, res) => {
  const maintenanceId = req.params.id;
  if (!maintenanceId) {
    res.status(400).send("Maintenance id not provided");
    return;
  }
  const maintenance = await maintenanceModel.getMaintenanceById(maintenanceId);
  if (!maintenance) {
    res.status(404).send("Maintenance not found");
    return;
  }

  let mergedMaintenance = {
    maintenance_id: maintenance[0].maintenance_id,
    bicycle_id: maintenance[0].bicycle_id,
    start_date: maintenance[0].start_date,
    end_date: maintenance[0].end_date,
    replacements: [],
  };

  maintenance.forEach((item) => {
    if (item.replacement_id !== null) {
      mergedMaintenance.replacements.push({
        replacement_id: item.replacement_id,
        part_ref: item.part_ref,
        part_name: item.part_name,
      });
    }
  });

  res.json(mergedMaintenance);
};

/**
 * Create a maintenance
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const createMaintenance = async (req, res) => {
  const { bicycle_id, start_date, end_date } = req.body || {};

  if (!bicycle_id || !start_date || !end_date) {
    res.status(400).send("Bicycle id, start date, and end date are required");
    return;
  }

  if (start_date >= end_date) {
    res.status(400).send("start date must be before end date");
    return;
  }

  const bicycle = await bicycleModel.getBicycleById(bicycle_id);
  if (!bicycle) {
    res.status(404).send("Bicycle not found");
    return;
  }

  const newMaintenance = await maintenanceModel.createMaintenance({
    bicycle_id,
    start_date,
    end_date,
  });

  // Check if the maintenance was created successfully
  if (!newMaintenance) {
    res.status(500).send("Internal Server Error");
    return;
  }

  // Respond with the created maintenance
  res.status(201).json(newMaintenance);
};

/**
 * Update a maintenance by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const updateMaintenance = async (req, res) => {
  const maintenanceId = req.params.id;

  const maintenance = await maintenanceModel.getMaintenanceById(maintenanceId);

  if (!maintenance) {
    res.status(404).send("Maintenance not found");
    return;
  }

  const { bicycle_id, start_date, end_date } = req.body || {};

  if (
    start_date >= end_date ||
    start_date >= maintenance.end_date ||
    maintenance.start_date >= maintenance.end_date
  ) {
    res.status(400).send("start date must be before end date");
    return;
  }

  const bicycle = await bicycleModel.getBicycleById(bicycle_id);
  if (!bicycle) {
    res.status(404).send("Bicycle not found");
    return;
  }

  const mergedMaintenance = {
    bicycle_id: bicycle_id || maintenance.bicycle_id,
    start_date: start_date || maintenance.start_date,
    end_date: end_date || maintenance.end_date,
  };
  const updatedMaintenance = await maintenanceModel.updateMaintenance(
    maintenanceId,
    mergedMaintenance,
  );

  if (!updatedMaintenance) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.json(updatedMaintenance);
};

/**
 *  Delete a maintenance by its ID
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const deleteMaintenance = async (req, res) => {
  const maintenanceId = req.params.id;

  const maintenance = await maintenanceModel.getMaintenanceById(maintenanceId);

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
