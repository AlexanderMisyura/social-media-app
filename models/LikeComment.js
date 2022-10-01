const mongoose = require("mongoose");

const LikeCommentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});

module.exports = mongoose.model("LikeComment", LikeCommentSchema);
