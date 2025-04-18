import * as bicycleModel from "../models/BicycleModel.js";

/**
 * Get all bicycles
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getBicycles = async (req, res) => {
  const bicycles = await bicycleModel.getBicycles();
  if (!bicycles) {
    res.status(404).send("Bicycles not found");
    return;
  }
  res.json(bicycles);
};

/**
 * Get a by bicycle by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getBicycleById = async (req, res) => {
  const bicycleId = req.params.id;
  if (!bicycleId) {
    res.status(400).send("Bicycle id not provided");
    return;
  }
  const bicycle = await bicycleModel.getBicycleById(bicycleId);
  if (!bicycle) {
    res.status(404).send("Bicycle not found");
    return;
  }
  res.json(bicycle);
};

/**
 * Create a bicycle
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const createBicycle = async (req, res) => {
  let {
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
  } = req.body || {};

  if (!bicycle_type || !brand || !model || !lifetime || !revision_cycle) {
    res
      .status(400)
      .send(
        "Bicycle type, brand, model, lifetime, and revision cycle are required",
      );
    return;
  }

  last_km_service = last_km_service || 0;
  counter_km = counter_km || 0;
  price_per_day = price_per_day || 20.0;
  image = image || "https://placehold.co/600x400";
  electric_assistance = electric_assistance || false;

  const newBicycle = await bicycleModel.createBicycle({
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
  });

  // Check if the bicycle was created successfully
  if (!newBicycle) {
    res.status(500).send("Internal Server Error");
    return;
  }

  // Respond with the created bicycle
  res.status(201).json(newBicycle);
};

/**
 * Update a bicycle by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const updateBicycle = async (req, res) => {
  const bicycleId = req.params.id;

  const bicycle = await bicycleModel.getBicycleById(bicycleId);

  if (!bicycle) {
    res.status(404).send("Bicycle not found");
    return;
  }

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
  } = req.body || {};

  const mergedBicycle = {
    bicycle_type: bicycle_type || bicycle.bicycle_type,
    brand: brand || bicycle.brand,
    model: model || bicycle.model,
    image: image || bicycle.image,
    lifetime: lifetime || bicycle.lifetime,
    price_per_day: price_per_day || bicycle.price_per_day,
    revision_cycle: revision_cycle || bicycle.revision_cycle,
    last_km_service: last_km_service || bicycle.last_km_service,
    counter_km: counter_km || bicycle.counter_km,
    electric_assistance: electric_assistance || bicycle.electric_assistance,
  };
  const updatedBicycle = await bicycleModel.updateBicycle(
    bicycleId,
    mergedBicycle,
  );

  if (!updatedBicycle) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.json(updatedBicycle);
};

/**
 *  Delete a bicycle by its ID
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const deleteBicycle = async (req, res) => {
  const bicycleId = req.params.id;

  const bicycle = await bicycleModel.getBicycleById(bicycleId);

  if (!bicycle) {
    res.status(404).send("Bicycle not found");
    return;
  }

  const deleted = await bicycleModel.deleteBicycle(bicycleId);

  if (!deleted) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.status(204).send();
};

export const getAvailableBicycleInPeriod = async (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  if (!startDate || !endDate) {
    res.status(400).send("Start date and end date are required");
    return;
  }

  // Check date format
  if (
    !/^2[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(startDate) ||
    !/^2[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(endDate)
  ) {
    res.status(400).send("Bad date format");
  }

  const available = await bicycleModel.getAvailableBicyclesOnPeriod(
    startDate,
    endDate
  );

  if (!available) {
    res.status(404).send("Bicycle not found");
    return;
  }

  res.json(available);
};