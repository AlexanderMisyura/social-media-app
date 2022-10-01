const express = require("express");
const app = express();
const connectDB = require("./config/database");
const hbs = require("express-handlebars").engine;

require("dotenv").config({ path: "./config/.env" });

connectDB();

// Handlebars
app.engine(
  ".hbs",
  hbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Routes
app.use("/", require("./routes/indexRoute"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
