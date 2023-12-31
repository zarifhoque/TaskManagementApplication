const UserModel = require("../models/UserModel");

// Function to retrieve and send user profile
exports.fetchUserProfile = async (request, response) => {
  try {
    // Retrieve user information excluding the password
    const userProfile = await UserModel.findById(request.user.id).select("-userPassword");

    // Respond with the user profile
    response.status(200).json({ userProfile, success: true, message: "User profile retrieved successfully" });
  } catch (error) {
    // Handle errors and respond with a generic server error message
    console.error(error);
    return response.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
