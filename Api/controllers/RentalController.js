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

  let mergedRentals = [];
  rentals.forEach((rental) => {
    // si la location n'est pas présente dans le tableau mergedRentals 
    if(!mergedRentals.find(mergedRental => mergedRental.rental_id === rental.rental_id)) {
      mergedRentals.push({rental_id: rental.rental_id,
                          account_id: rental.account_id, 
                          start_date: rental.start_date, 
                          end_date: rental.end_date, 
                          payment_status: rental.payment_status, 
                          rental_status: rental.rental_status, 
                          bicycles: [],
                        });
    }
    
    if(rental.bicycle_id !== null) {
      const index = mergedRentals.findIndex(mergedRental => mergedRental.rental_id === rental.rental_id);
      mergedRentals[index].bicycles.push({
        bicycle_id: rental.bicycle_id,
        bicycle_type: rental.bicycle_type,
        brand: rental.brand,
        model: rental.model,
        lifetime: rental.lifetime,
        revision_cycle: rental.revision_cycle,
        last_km_service: rental.last_km_service,
        counter_km: rental.counter_km,
        counter_km: rental.counter_km,
        status: rental.status,
        electric_assistance: rental.electric_assistance,
      });
    }
  });

  res.json(mergedRentals);
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

  const rentals = await rentalModel.getRentalById(rentalId);
  if (!rentals || rentals.length === 0) {
    res.status(404).send("Rental not found");
    return;
  }

  let mergedRental = {
    rental_id: rentals[0].rental_id,
    account_id: rentals[0].account_id,
    start_date: rentals[0].start_date,
    end_date: rentals[0].end_date,
    payment_status: rentals[0].payment_status,
    rental_status: rentals[0].rental_status,
    bicycles: [],
  };

  rentals.forEach((rental) => {
    if (rental.bicycle_id !== null) {
      mergedRental.bicycles.push({
        bicycle_id: rental.bicycle_id,
        bicycle_type: rental.bicycle_type,
        brand: rental.brand,
        model: rental.model,
        lifetime: rental.lifetime,
        revision_cycle: rental.revision_cycle,
        last_km_service: rental.last_km_service,
        counter_km: rental.counter_km,
        status: rental.status,
        electric_assistance: rental.electric_assistance,
      });
    }
  });

  res.json(mergedRental);
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
  const account = await accountModel.getAccountById(account_id);
  if (!account) {
    res.status(404).send("Account not found");
    return;
  }

  if (start_date >= end_date) {
    res.status(400).send("Invalid Dates : Start date must be before end date");
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
    res.status(404).send("Rental not found");
    return;
  }

  const { account_id, start_date, end_date, payment_status, rental_status } =
    req.body;

  const account = await accountModel.getAccountById(req.body.account_id);
  if (!account) {
    res.status(404).send("Account not found");
    return;
  }

  if (
    start_date >= end_date ||
    start_date >= rental.end_date ||
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
    res.status(500).send("Invalid Server Error");
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
    res.status(404).send("Rental not found");
    return;
  }
  const deleted = await rentalModel.deleteRental(rentalId);
  if (!deleted) {
    res.status(500).send("Internal Server Error");
    return;
  }
  res.status(204).send();
};
