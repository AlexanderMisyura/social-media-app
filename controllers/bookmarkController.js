const Bookmark = require("../models/Bookmark");
const User = require("../models/User");
const Post = require("../models/Post");
const LikePost = require("../models/LikePost");

module.exports = {
  toggleBookmark: async (req, res) => {
    try {
      const bookmark = {
        user: req.user.id,
        post: req.params.postId,
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
        const post = await Post.findOne({
          _id: req.params.postId,
          deleted: false,
        });

        // User is able to save the post if
        if (
          // it is his own post or
          post.user.toString() === req.user.id ||
          // it is any public post or
          post.status === "public" ||
          // it is a post for friends and user is a friend
          (post.status === "friends" &&
            post.friends.some((friend) => friend.toString() === req.user.id))
        ) {
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

      let bookmarks = await Bookmark.find({ user: req.user.id })
        .populate("post")
        .lean();
      bookmarks = bookmarks.filter((bookmark) => {
        return (
          bookmark.post &&
          bookmark.post.deleted === false &&
          (bookmark.user.toString() === req.user.id ||
            bookmark.post.status === "public" ||
            (bookmark.post.status === "friends" &&
              bookmark.post.friends.some(
                (friend) => friend.toString() === req.user.id
              )))
        );
      });
      const posts = await Promise.all(
        bookmarks.map(async (bookmark) => {
          const post = bookmark.post;
          post.isBookmarked = true;
          post.user = await User.findById(bookmark.post.user).lean();
          post.hasLike = await LikePost.exists({
            user: req.user.id,
            post: post._id,
          });
          return post;
        })
      );
      posts.sort((a, b) => b.createdAt - a.createdAt);
      res.render("index", {
        title: `${req.user.userName}'s saved posts`,
        posts,
        loggedUser,
      });
    } catch (error) {
      console.error(error);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },
};
