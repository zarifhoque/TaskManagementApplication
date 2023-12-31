const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utilities/tokenUtility");
const { isValidEmail } = require("../utilities/validationUtility");

// Function for handling user registration
exports.userRegistration = async (request, response) => {
  try {
    // Retrieve user details from the request body
    const { fullName, emailAddress, userPassword } = request.body;

    // Check if all mandatory fields are provided
    if (!fullName || !emailAddress || !userPassword) {
      return response.status(400).json({ message: "Please complete all required fields" });
    }

    // Ensure that provided values are of the correct data type
    if (typeof fullName !== "string" || typeof emailAddress !== "string" || typeof userPassword !== "string") {
      return response.status(400).json({ message: "Please enter valid string values only" });
    }

    // Verify that the password meets the minimum length requirement
    if (userPassword.length < 4) {
      return response.status(400).json({ message: "Password must be at least 4 characters long" });
    }

    // Validate the email format
    if (!isValidEmail(emailAddress)) {
      return response.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email is already registered
    const existingUser = await UserModel.findOne({ emailAddress });
    if (existingUser) {
      return response.status(400).json({ message: "This email is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    await UserModel.create({ fullName, emailAddress, userPassword: hashedPassword });

    // Respond with a success message
    response.status(200).json({ message: "Congratulations! Your account has been successfully created" });
  } catch (error) {
    // Handle errors and respond with a generic server error message
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

// Function for handling user login
exports.userLogin = async (request, response) => {
  try {
    // Retrieve user credentials from the request body
    const { emailAddress, userPassword } = request.body;

    // Check if both email and password are provided
    if (!emailAddress || !userPassword) {
      return response.status(400).json({ success: false, message: "Please provide both email and password" });
    }

    // Check if the user with the provided email exists
    const user = await UserModel.findOne({ emailAddress });
    if (!user) {
      return response.status(400).json({ success: false, message: "This email is not registered" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
    if (!isPasswordValid) {
      return response.status(400).json({ success: false, message: "Incorrect password" });
    }

    // Generate and provide an access token upon successful login
    const accessToken = generateAccessToken({ id: user._id });

    // Remove password from the user object before sending it in the response
    delete user.userPassword;

    // Respond with the access token and user information
    response.status(200).json({ accessToken, user, success: true, message: "Login successful" });
  } catch (error) {
    // Handle errors and respond with a generic server error message
    console.error(error);
    return response.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
