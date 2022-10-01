const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(
      process.env.DB_CONNECTION_STRING
    );
    console.log(`MongoDB connected: ${dbConnection.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
