const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

// Registration
router.post("/userRegister", async (req, res) => {
  let newUser = new userModel({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    Address: req.body.Address,
  });

  try {
    const user = await newUser.save();
    res.status(200).json({
      success: true,
      responseData: user,
      message: "User Saved",
      errorDetails: null,
    });
  } catch (err) {
    if (err.code === 11000 || err.code === 11001) {
      res.status(400).json({
        success: false,
        responseData: null,
        message: "It appears this email is already associated with an account",
        errorDetails: err,
      });
    } else {
      res.status(500).json({
        success: false,
        responseData: null,
        message: "Failed to Save the User",
        errorDetails: err,
      });
    }
  }
});
// Login
router.post("/userLogin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const query = { email: email.toLowerCase() };

  try {
    // Check if the user exists
    const user = await userModel.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        responseData: null,
        message: "Account not found",
        errorDetails: null,
      });
    }

    // Check if the provided password matches the user's password
    const isPasswordMatch = await user.isPasswordMatch(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        responseData: null,
        message: "Incorrect Email Or password",
        errorDetails: null,
      });
    }

    // If both checks pass, update the user's last login date
    const updatedUser = await userModel.findOneAndUpdate({ _id: user._id }, { $set: { lastLoginDate: Date.now() } }, { new: true });

    let returnUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phoneNumber: updatedUser.phoneNumber,
      Address: updatedUser.Address,
      status: updatedUser.status,
      userRole: updatedUser.userRole,
    };
    const token = jwt.sign(returnUser, process.env.SECRETKEY, { expiresIn: "1h" });
    res.status(200).json({
      success: true,
      responseData: { token: token },
      message: "User logged in successfully",
      errorDetails: null,
    });
  } catch (err) {
    console.error("Error during user login:", err); // Log the error for debugging purposes

    res.status(500).json({
      success: false,
      responseData: null,
      message: "please try again",
      errorDetails: err,
    });
  }
});

module.exports = router;
