const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

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
        message: "Duplicate Value",
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
        message: "Error, Account not found",
      });
    }

    // Check if the provided password matches the user's password
    const isPasswordMatch = await user.isPasswordMatch(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        responseData: null,
        message: "Error, Incorrect Email Or password",
      });
    }

    // If both checks pass, you can consider the user logged in
    let returnUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      Address: user.Address,
      status: user.status,
      userRole: user.userRole,
    };
    res.status(200).json({
      success: true,
      responseData: { user: returnUser },
      message: "User logged in successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      responseData: null,
      message: "Error, please try again",
      errorDetails: err,
    });
  }
});
module.exports = router;
