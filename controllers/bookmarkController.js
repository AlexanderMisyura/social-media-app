const Bookmark = require("../models/Bookmark");
const User = require("../models/User");
const Post = require("../models/Post");
const LikePost = require("../models/LikePost");

module.exports = {
  toggleBookmark: async (req, res) => {
    console.log('"triggered" :>> ', "triggered");
    try {
      const bookmark = {
        userId: req.user.id,
        postId: req.params.postId,
      };
      const isBookmarkExists = await Bookmark.exists(bookmark);
      if (isBookmarkExists) {
        await Bookmark.deleteOne(bookmark);

        const user = await User.findByIdAndUpdate(
          req.user.id,
          { $inc: { bookmarks: -1 } },
          { new: true }
        );

        res.json({
          bookmarks: user.bookmarks,
        });
      } else {
        await Bookmark.create(bookmark);

        const user = await User.findByIdAndUpdate(
          req.user.id,
          { $inc: { bookmarks: 1 } },
          { new: true }
        );

        res.json({
          bookmarks: user.bookmarks,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  getBookmarkedPosts: async (req, res) => {
    try {
      const loggedUser = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
        bookmarks: req.user.bookmarks,
      };

      const bookmarks = await Bookmark.find({ userId: req.user.id }).lean();
      const bookmarkPostIds = bookmarks.map((bookmark) => bookmark.postId);

      let posts = await Promise.all(
        bookmarkPostIds.map(async (postId) => {
          const post = await Post.findOne({ _id: postId, deleted: false })
            .populate("user")
            .lean();
          if (post.user._id === req.user.id) {
            return post;
          }
          if (post.user._id !== req.user.id && post.status === "public") {
            return post;
          }
        })
      );
      posts = await Promise.all(
        posts.map(async (post) => {
          post.isBookmarked = true;
          post.hasLike = await LikePost.exists({
            userId: req.user.id,
            postId: post._id,
          });
          return post;
        })
      );
      res.render("index", {
        title: `${req.user.userName}'s saved posts`,
        posts,
        loggedUser,
      })
    } catch (error) {
      console.error(error);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },
};
