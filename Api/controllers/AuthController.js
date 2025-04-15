import bcrypt from "bcryptjs";
import * as accountModel from "../models/AccountModel.js";
import { createToken } from "../config/jwt.js";

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  // Check if the email and password are provided
  if (!email || !password) {
    res.status(400).json({
      error: "Le mail et le mot de passe sont requis",
    });
    return;
  }

  // Get the account by email
  const account = await accountModel._getAccountByEmailPrivate(email);
  if (!account) {
    res.status(401).json({
      error: "Mail ou mot de passe incorrect",
    });
    return;
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(
    password,
    account.hashed_password
  );
  if (!isPasswordValid) {
    res.status(401).json({
      error: "Mail ou mot de passe incorrect",
    });
    return;
  }

  const accountData = {
    ...account,
    account_id: undefined,
  };
  delete accountData.hashed_password; // Remove the hashed password from the response
  // Generate a JWT token
  const token = createToken(accountData);

  // Send the token in the response
  res.status(200).json({ token, user: accountData });
};

export const register = async (req, res) => {
  const { first_name, last_name, email, password, phone, address, subscribe } =
    req.body || {};
  if (!first_name || !last_name || !email || !password) {
    res.status(400).json({
      error: "Les champs nom, prénom, email et mot de passe sont requis",
    });
    return;
  }
  // Check if the email already exists
  const existingAccount = await accountModel._getAccountByEmailPrivate(email);
  if (existingAccount) {
    res.status(409).json({
      error: "Cet email est déjà utilisé",
    });
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
    res.status(500).json({
      error: "Erreur lors de la création du compte",
    });
    return;
  }
  const accountData = {
    ...account,
    account_id: undefined,
  };
  delete accountData.hashed_password; // Remove the hashed password from the response
  // Generate a JWT token
  const token = createToken(accountData);
  // Send the token in the response

  res.status(201).json({ token, user: accountData });
  return;
};
