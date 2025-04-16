import { createToken } from "../config/jwt.js";
import * as accountModel from "../models/AccountModel.js";
import bcrypt from "bcryptjs";

/**
 * Get all accounts
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getAccounts = async (req, res) => {
  const accounts = await accountModel.getAccounts();
  if (!accounts) {
    res.status(404).send("Accounts not found");
    return;
  }
  res.json(accounts);
};

/**
 * Get an account by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const getAccountById = async (req, res) => {
  const accountId = req.params.id;
  if (!accountId) {
    res.status(400).send("Account id not provided");
    return;
  }
  const account = await accountModel.getAccountById(accountId);
  if (!account) {
    res.status(404).send("Account not found");
    return;
  }
  res.json(account);
};

/**
 * Create an account
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const createAccount = async (req, res) => {
  const { first_name, last_name, email, password, phone, address, subscribe } =
    req.body || {};

  if (!first_name || !last_name || !email || !password) {
    res.status(400).send("Missing required fields");
    return;
  }

  // Check if the email already exists
  const existingAccount = await accountModel.getAccountByEmail(email);
  if (existingAccount) {
    res.status(409).send("Email already exists");
    return;
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (!hashedPassword) {
    res.status(500).send("Error hashing password");
    return;
  }

  // Create the account
  const accountPayload = {
    first_name,
    last_name,
    email,
    hashedPassword,
    phone: phone || "N/A",
    address: address || "N/A",
    account_role: "client",
    subscribe: subscribe || false,
  };
  const account = await accountModel.createAccount(accountPayload);
  if (!account) {
    res.status(500).send("Error creating account");
    return;
  }
  res.status(201).json(account);
};

/**
 * Update an account by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const updateAccount = async (req, res) => {
  const accountId = req.params.id;
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    subscribe,
    account_role,
  } = req.body || {};

  if (!accountId) {
    res.status(400).send("Account id not provided");
    return;
  }

  const existingAccount = await accountModel.getAccountById(accountId);
  if (!existingAccount) {
    res.status(404).send("Account not found");
    return;
  }

  // Create the payload
  const payload = {
    first_name: first_name || existingAccount.first_name,
    last_name: last_name || existingAccount.last_name,
    email: email || existingAccount.email,
    phone: phone || existingAccount.phone || "N/A",
    account_role: account_role || existingAccount.account_role || "client",
    address: address || existingAccount.address || "N/A",
    subscribe: subscribe || existingAccount.subscribe || false,
  };

  const account = await accountModel.updateAccount(accountId, payload);
  if (!account) {
    res.status(500).send("Error updating account");
    return;
  }

  // Create a JWT token
  createToken(account);

  res.json({ token, user: account });
};

/**
 * Delete an account by its id
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @returns {void}
 */
export const deleteAccount = async (req, res) => {
  const accountId = req.params.id;

  if (!accountId) {
    res.status(400).send("Account id not provided");
    return;
  }

  const account = await accountModel.deleteAccount(accountId);
  if (!account) {
    res.status(500).send("Error deleting account");
    return;
  }
  res.status(204).send();
};
