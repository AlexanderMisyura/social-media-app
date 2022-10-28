const LikePost = require("../models/LikePost");
const LikeComment = require("../models/LikeComment");

module.exports = {
  toggleLike: async (req, res) => {
    console.log("like counted: ", req.body.postId);
    res.send("like counted");

    // try {
    //   const likeDoc = {
    //     userId: req.user.id,
    //     storyId: req.params.storyId,
    //   };
    //   const isLike = await Like.exists(likeDoc);
    //   if (isLike) {
    //     const doesUserLike = false;
    //     await Like.deleteOne(likeDoc);

    //     const story = await Story.findByIdAndUpdate(
    //       req.params.storyId,
    //       { $inc: { likes: -1 } },
    //       { new: true }
    //     );

    //     const user = await User.findByIdAndUpdate(
    //       story.user,
    //       { $inc: { rating: -1 } },
    //       { new: true }
    //     );

    //     res.json({
    //       storyLikes: story.likes,
    //       userRating: user.rating,
    //       doesUserLike,
    //     });
    //   } else {
    //     const doesUserLike = true;
    //     await Like.create(likeDoc);

    //     const story = await Story.findByIdAndUpdate(
    //       req.params.storyId,
    //       { $inc: { likes: 1 } },
    //       { new: true }
    //     );

    //     const user = await User.findByIdAndUpdate(
    //       story.user,
    //       { $inc: { rating: 1 } },
    //       { new: true }
    //     );

    //     res.json({
    //       storyLikes: story.likes,
    //       userRating: user.rating,
    //       doesUserLike,
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  },
};
