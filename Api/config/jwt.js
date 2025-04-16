import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for the account containing the user data
 * @param {Object} account account object
 * @returns {String} JWT token of the account
 */
export const createToken = (account) => {
  const token = jwt.sign(
    {
      user: {
        ...account,
      },
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION,
    },
  );

  return token;
};
