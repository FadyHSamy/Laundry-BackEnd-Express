const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  phoneNumber: { type: String, require: false },
  Address: { type: String, require: false },
  registrationDate: { type: Date, require: true, default: Date.now },
  lastLoginDate: { type: Date, require: true },
  status: { type: String, require: true, default: "Active" },
  userRole: { type: String, require: true, default: "Customer" },
});
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    // Generate Salt Value
    const salt = await bcrypt.genSalt(10);

    // Use this Salt Value to Hash Password
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plain password with the hashed one
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.isPasswordMatch = async function (plainPassword, hashed) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashed);
    return isMatch;
  } catch (error) {
    console.error("Error during password comparison:", error);
    throw error;
  }
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
