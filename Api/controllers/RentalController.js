import * as rentalModel from "../models/RentalModel.js";
import * as accountModel from "../models/AccountModel.js";

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
  const { account_id, start_date, end_date, payment_status, rental_status } =
    req.body;

  if (
    !account_id ||
    !start_date ||
    !end_date ||
    !payment_status ||
    !rental_status
  ) {
    res
      .status(400)
      .send(
        "Account ID, start date, end date, payment status, and rental status are required",
      );
    return;
  }
  const account = await rentalModel.getAccountById(account_id);
  if (!account) {
    res.status(400).send("Invalid Account ID");
    return;
  }

  const rental = await rentalModel.createRental(req.body);

  if (!rental) {
    res.status(500).send("Internal Server Error");
    return;
  }

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
  const rental = await rentalModel.getRentalById(rentalId);
  if (!rental) {
    res.status(400).send("Invalid Rental");
    return;
  }

  const { account_id, start_date, end_date, payment_status, rental_status } =
    req.body;

  const account = await rentalModel.getAccountById(req.body.account_id);
  if (!account) {
    res.status(400).send("Invalid Account ID");
    return;
  }

  if (
    start_date >= end_date ||
    rental.start_date >= rental.end_date ||
    rental.start_date >= end_date
  ) {
    res.status(400).send("Invalid Dates : Start date must be before end date");
    return;
  }
  const mergedRental = {
    account_id: account_id || rental.account_id,
    start_date: start_date || rental.start_date,
    end_date: end_date || rental.end_date,
    payment_status: payment_status || rental.payment_status,
    rental_status: rental_status || rental.rental_status,
  };

  const updatedRental = await rentalModel.updateRental(rentalId, mergedRental);
  if (!updatedRental) {
    res.status(500).send("Internal Server Error");
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
  const rental = await rentalModel.getRentalById(rentalId);
  if (!rental) {
    res.status(400).send("Invalid Rental");
    return;
  }
  const deleted = await rentalModel.deleteRental(rentalId);
  if (!deleted) {
    res.status(500).send("Internal Server Error");
    return;
  }
  res.status(204).send();
};
