import { getAccountById } from "../models/AccountModel.js";

/**
 * Middleware
 * @param {Object} req object containing the request data
 * @param {Object} res object containing the response data
 * @param {Object} next function to call the next middleware
 * @returns {void}
 */
export const onlyAdminMiddleware = async (req, res, next) => {
  if (!req.user) {
    res.status(403).send("Unauthorized");
    return;
  }

  // Avoid having a old JWT token with old roles
  const account = await getAccountById(req.user.account_id);

  // Check if the user is authorized to delete the account
  if (account.account_role !== "admin") {
    res.status(403).send("Unauthorized");
    return;
  }

  next();
};
