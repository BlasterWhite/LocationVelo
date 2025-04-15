import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as accountModel from "../models/AccountModel.js";
import { createToken } from "../config/jwt.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }

  // Get the account by email
  const account = await accountModel._getAccountByEmailPrivate(email);
  if (!account) {
    res.status(404).send("Account not found");
    return;
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(
    password,
    account.hashed_password,
  );
  if (!isPasswordValid) {
    res.status(401).send("Invalid password");
    return;
  }

  // Generate a JWT token
  const token = createToken(account);

  // Send the token in the response
  res.status(200).json({ token });
};

export const register = async (req, res) => {
  const { first_name, last_name, email, password, phone, address, subscribe } =
    req.body;
  if (!first_name || !last_name || !email || !password) {
    res.status(400).send("Missing required fields");
    return;
  }
  // Check if the email already exists
  const existingAccount = await accountModel._getAccountByEmailPrivate(email);
  if (existingAccount) {
    res.status(409).send("Email already exists");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create the account
  const payloadAccount = {
    first_name,
    last_name,
    email,
    hashedPassword,
    phone: phone || "N/A",
    address: address || "N/A",
    account_role: "user",
    subscribe: subscribe || false,
  };

  const account = await accountModel.createAccount(payloadAccount);
  if (!account) {
    res.status(500).send("Error creating account");
    return;
  }
  // Generate a JWT token
  const token = createToken(account);
  // Send the token in the response
  res.status(201).json({ token });
  return;
};
