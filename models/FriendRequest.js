const mongoose = require("mongoose");

const FriendRequestSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);
