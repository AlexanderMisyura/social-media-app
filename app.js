const express = require("express");
const app = express();
const connectDB = require("./config/database");

require("dotenv").config({path: "./config/.env"})

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
