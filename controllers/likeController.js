const LikePost = require("../models/LikePost");
const LikeComment = require("../models/LikeComment");
const Post = require("../models/Post");
const CommentSchema = require("../models/CommentSchema");
const User = require("../models/User");

module.exports = {
  togglePostLike: async (req, res) => {
    try {
      const like = {
        user: req.user.id,
        post: req.params.postId,
      };
      const isLikeExists = await LikePost.exists(like);
      if (isLikeExists) {
        await LikePost.deleteOne(like);

        const post = await Post.findByIdAndUpdate(
          req.params.postId,
          { $inc: { likes: -1 } },
          { new: true, projection: { likes: 1, user: 1 } }
        );

        const user = await User.findByIdAndUpdate(
          post.user,
          { $inc: { rating: -1 } },
          { new: true, projection: { rating: 1 } }
        );

        res.json({
          likes: post.likes,
          userRating: user.rating,
        });
      } else {
        await LikePost.create(like);

        const post = await Post.findByIdAndUpdate(
          req.params.postId,
          { $inc: { likes: 1 } },
          { new: true, projection: { likes: 1, user: 1 } }
        );

        const user = await User.findByIdAndUpdate(
          post.user,
          { $inc: { rating: 1 } },
          { new: true, projection: { rating: 1 } }
        );

        res.json({
          likes: post.likes,
          userRating: user.rating,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  toggleCommentLike: async (req, res) => {
    try {
      const like = {
        user: req.user.id,
        comment: req.params.commentId,
      };
      const isLikeExists = await LikeComment.exists(like);
      if (isLikeExists) {
        await LikeComment.deleteOne(like);

        const comment = await CommentSchema.findByIdAndUpdate(
          req.params.commentId,
          { $inc: { likes: -1 } },
          { new: true, projection: { likes: 1, user: 1 } }
        );

        const user = await User.findByIdAndUpdate(
          comment.user,
          { $inc: { rating: -1 } },
          { new: true, projection: { rating: 1 } }
        );

        res.json({
          likes: comment.likes,
          userRating: user.rating,
        });
      } else {
        await LikeComment.create(like);

        const comment = await CommentSchema.findByIdAndUpdate(
          req.params.commentId,
          { $inc: { likes: 1 } },
          { new: true, projection: { likes: 1, user: 1 } }
        );

        const user = await User.findByIdAndUpdate(
          comment.user,
          { $inc: { rating: 1 } },
          { new: true, projection: { rating: 1 } }
        );

        res.json({
          likes: comment.likes,
          userRating: user.rating,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
