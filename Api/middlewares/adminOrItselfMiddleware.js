import { getAccountById } from "../models/AccountModel.js";

/**
 * Middleware to check if the user is an admin or the account itself
 * @param {Object} req object containing the request data
 * @param {Object} res object containing the response data
 * @param {Object} next function to call the next middleware
 * @returns {void}
 */
export const adminOrItself = async (req, res, next) => {
  let accountId = req.params.id;

  try {
    accountId = parseInt(accountId);
  } catch (error) {
    console.log(error);

    res.status(400).send("Account id not valid");
    return;
  }

  if (!accountId || !req.user) {
    res.status(400).send("You must be logged in to access this resource");
    return;
  }

  // Avoid having a old JWT token with old roles
  const account = await getAccountById(req.user.account_id);

  // Check if the user is authorized to delete the account
  if (account.account_role !== "admin" && req.user.account_id !== accountId) {
    res.status(403).send("Unauthorized");
    return;
  }

  next();
};
