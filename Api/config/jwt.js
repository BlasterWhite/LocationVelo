import jwt from "jsonwebtoken";

export const createToken = (account) => {
  const token = jwt.sign(
    {
      id: account.account_id,
      firstname: account.first_name,
      lastname: account.last_name,
      email: account.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION,
    },
  );

  return token;
};
