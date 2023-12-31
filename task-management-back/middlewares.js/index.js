const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const { ACCESS_TOKEN_SECRET } = process.env;

// Middleware to verify the access token and populate the request object with user information
exports.authenticateUser = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization");

  // Check if the token is missing
  if (!token) {
    return res.status(400).json({ success: false, message: "Token not found" });
  }

  let decodedUser;

  // Verify the token and handle verification errors
  try {
    decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  // Retrieve the user from the database using the decoded user ID
  try {
    const user = await UserModel.findById(decodedUser.id);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Populate the request object with the user information
    req.user = user;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
