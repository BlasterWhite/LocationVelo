import jwt from "jsonwebtoken";

/**
 * Authenticates the user using JWT
 * @param {Object} req object containing the request data
 * @param {Object} res object containing the response data
 * @param {Object} next function to call the next middleware
 * @returns {void}
 */
export const authMiddleware = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return next();
  }

  // Check if the token is in the correct format
  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded.user;
    next();
  });
};
