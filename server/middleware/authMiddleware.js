
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get JWT from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find authenticated user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found. Please login again.",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to protected API
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please login again.",
    });
  }
};

module.exports = authMiddleware;
