const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../config/.env" });

const defaultValues = {
  image: (val) => (val === undefined ? process.env.DEFAULT_AVATAR_LINK : val),
  bio: (val) => (val === undefined ? "No bio yet" : val),
};

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "userName cannot be empty"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: process.env.DEFAULT_AVATAR_LINK,
      set: defaultValues.image,
    },
    cloudinaryId: {
      type: String,
    },
    bio: {
      type: String,
      default: "No bio yet",
      set: defaultValues.bio,
    },
    language: {
      type: String,
      default: "en-En",
    },
    friends: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookmarks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Passport hash middleware

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating password

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
