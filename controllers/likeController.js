const LikePost = require("../models/LikePost");
const LikeComment = require("../models/LikeComment");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  toggleLike: async (req, res) => {
    try {
      const like = {
        userId: req.user.id,
        postId: req.params.postId,
      };
      const isLikeExists = await LikePost.exists(like);
      if (isLikeExists) {
        await LikePost.deleteOne(like);

        const post = await Post.findByIdAndUpdate(
          req.params.postId,
          { $inc: { likes: -1 } },
          { new: true }
        );

        const user = await User.findByIdAndUpdate(
          post.user,
          { $inc: { rating: -1 } },
          { new: true }
        );

        res.json({
          postLikes: post.likes,
          userRating: user.rating,
        });
      } else {
        await LikePost.create(like);

        const post = await Post.findByIdAndUpdate(
          req.params.postId,
          { $inc: { likes: 1 } },
          { new: true }
        );

        const user = await User.findByIdAndUpdate(
          post.user,
          { $inc: { rating: 1 } },
          { new: true }
        );

        res.json({
          storyLikes: post.likes,
          userRating: user.rating,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
