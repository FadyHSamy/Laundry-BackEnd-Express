//Bring in all dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Initialize app with express
const app = express();
app.use(cors());

// ------------Routes------------//
const userRoutes = require("./routes/users");

// DataBase Connection
mongoose.connect(process.env.DATABASE);
mongoose.connection.on("connected", () => {
  console.log("Connected to database " + process.env.DATABASE);
});
mongoose.connection.on("error", (err) => {
  console.log("Unable to connect to the database " + err);
});

// Port to be used by the server
const _PORT = process.env.PORT;

// ------------Middlewares------------//
app.use(bodyParser.json());
// ------------Middlewares------------//

// ------------Routes------------//
app.use("/users", userRoutes);

//Start the server
app.listen(_PORT, () => {
  console.log("Server Started");
});
