const mongoose = require("mongoose");

const LikeCommentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});

module.exports = mongoose.model("LikeComment", LikeCommentSchema);
