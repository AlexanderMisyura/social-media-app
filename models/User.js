const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
  image: { type: String },
  bio: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  creationDate: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
