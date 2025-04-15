import jwt from "jsonwebtoken";

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
    }
  );

  return token;
};
