const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const connectDB = require("./config/database");
const hbs = require("express-handlebars").engine;
const logger = require("morgan");

require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// Handlebars
app.engine(
  ".hbs",
  hbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions store in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_CONNECTION_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Routes
app.use("/", require("./routes/indexRoute"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
