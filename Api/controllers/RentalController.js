import * as rentalModel from '../models/RentalModel.js';

/**
 * Get all rentals
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const getRentals = async (req, res) => {
  const rentals = await rentalModel.getRentals();
  if (!rentals) {
    res.status(404).send("Rentals not found");
    return;
  }
  res.json(rentals);
};

/**
 * Get a rental by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const getRentalById = async (req, res) => {
  const rentalId = req.params.id;
  if (!rentalId) {
    res.status(400).send("Rental id not provided");
    return;
  }
  const rental = await rentalModel.getRentalById(rentalId);
  if (!rental) {
    res.status(404).send("Rental not found");
    return;
  }
  res.json(rental);
};

/**
 * Create a rental
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const createRental = async (req, res) => {
  const {
    account_id,
    start_date,
    end_date,
    payment_status,
    rental_status,
  } = req.body;

  if (!account_id || !start_date || !end_date || !payment_status || !rental_status) {
    res.status(400).send("Account ID, start date, end date, payment status, and rental status are required");
    return;
  }

  const rentalData = {
    account_id,
    start_date,
    end_date,
    payment_status,
    rental_status,
  };

  const rental = await rentalModel.createRental(rentalData);
  res.status(201).json(rental);
};

/**
 * Update a rental by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const updateRental = async (req, res) => {
  const rentalId = req.params.id;
  if (!rentalId) {
    res.status(400).send("Rental id not provided");
    return;
  }
  const rentalData = req.body;

  const updatedRental = await rentalModel.updateRental(rentalId, rentalData);
  if (!updatedRental) {
    res.status(404).send("Rental not found");
    return;
  }
  res.json(updatedRental);
};

/**
 * Delete a rental by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */

export const deleteRental = async (req, res) => {
  const rentalId = req.params.id;
  if (!rentalId) {
    res.status(400).send("Rental id not provided");
    return;
  }
  const deleted = await rentalModel.deleteRental(rentalId);
  if (!deleted) {
    res.status(404).send("Rental not found");
    return;
  }
  res.status(204).send();
};