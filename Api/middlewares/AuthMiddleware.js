import jwt from "jsonwebtoken";

/**
 * Authenticates the user using JWT
 * @param {Object} req object containing the request data
 * @param {Object} res object containing the response data
 * @param {Object} next function to call the next middleware
 * @returns {void}
 */
export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    next();
  });
};
