const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const Post = require("../models/Post");
const Bookmark = require("../models/Bookmark");

module.exports = {
  sendRequest: async (req, res) => {
    try {
      const hasRequest = await FriendRequest.exists({
        sender: req.user.id,
        receiver: req.params.userId,
      });
      const hasRespondingRequest = await FriendRequest.exists({
        sender: req.params.userId,
        receiver: req.user.id,
      });

      if (!hasRequest && !hasRespondingRequest) {
        FriendRequest.create({
          sender: req.user.id,
          receiver: req.params.userId,
        });

        res.redirect(`/profile/${req.params.userId}`);
      }
    } catch (error) {
      console.error(error);
    }
  },

  cancelOwnRequest: async (req, res) => {
    try {
      await FriendRequest.deleteOne({
        sender: req.user.id,
        receiver: req.params.userId,
      });

      res.redirect(`/profile/${req.params.userId}`);
    } catch (error) {
      console.error(error);
    }
  },

  confirmRequest: async (req, res) => {
    try {
      // Add check if users don't already have each other in a friend lists
      await User.updateOne(
        { _id: req.params.userId },
        { $push: { friends: req.user.id } }
      );
      await Post.updateMany(
        { user: req.params.userId, status: "friends" },
        { $push: { friends: req.user.id } }
      );

      await User.updateOne(
        { _id: req.user.id },
        { $push: { friends: req.params.userId } }
      );
      await Post.updateMany(
        { user: req.user.id, status: "friends" },
        { $push: { friends: req.params.userId } }
      );

      await FriendRequest.deleteOne({
        sender: req.params.userId,
        receiver: req.user.id,
      });

      await FriendRequest.deleteOne({
        sender: req.user.id,
        receiver: req.params.userId,
      });

      res.redirect(`/profile/${req.params.userId}`);
    } catch (error) {
      console.error(error);
    }
  },

  rejectRequest: async (req, res) => {
    try {
      await FriendRequest.deleteOne({
        sender: req.params.userId,
        receiver: req.user.id,
      });

      await FriendRequest.deleteOne({
        sender: req.user.id,
        receiver: req.params.userId,
      });

      res.redirect(`/profile/${req.params.userId}`);
    } catch (error) {
      console.error(error);
    }
  },

  removeFromFriendsList: async (req, res) => {
    try {
      // Update data related to logged user:

      // Remove logged user's bookmarks with with browsed user's friend posts
      let loggedUserBookmarks = await Bookmark.find({ user: req.user.id })
        .populate({
          path: "post",
          match: { user: req.params.userId, friends: req.user.id },
          select: "user",
        })
        .lean();
      loggedUserBookmarks = loggedUserBookmarks.filter(
        (bookmark) => bookmark.post
      );

      await Promise.all(
        loggedUserBookmarks.map(
          async (bookmark) =>
            await Bookmark.deleteOne({
              user: req.user.id,
              post: bookmark.post._id,
            })
        )
      );
      // Remove browsed user from logged user friend list,
      // decrement logged user's bookmarks by the number of
      // browsed user's friend posts (which logged user had bookmarked)
      await User.updateOne(
        { _id: req.user.id },
        {
          $pull: { friends: req.params.userId },
          $inc: { bookmarks: -loggedUserBookmarks.length },
        }
      );

      // Remove browsed user's bookmarks with with logged user's friend posts
      let browsedUserBookmarks = await Bookmark.find({
        user: req.params.userId,
      })
        .populate({
          path: "post",
          match: { user: req.user.id, friends: req.params.userId },
          select: "user",
        })
        .lean();
      browsedUserBookmarks = browsedUserBookmarks.filter(
        (bookmark) => bookmark.post
      );
      console.log(
        "browsedUserBookmarks to delete (ururu / zurk friend post) :>> ",
        browsedUserBookmarks
      );

      await Promise.all(
        browsedUserBookmarks.map(
          async (bookmark) =>
            await Bookmark.deleteOne({
              user: req.params.userId,
              post: bookmark.post._id,
            })
        )
      );
      // Remove logged user from browsed user friend list,
      // decrement browsed user's bookmarks by the number of
      // logged user's friend posts (which browsed user had bookmarked)
      await User.updateOne(
        { _id: req.params.userId },
        {
          $pull: { friends: req.user.id },
          $inc: { bookmarks: -browsedUserBookmarks.length },
        }
      );
      // Remove logged user from browsed user's friend posts
      await Post.updateMany(
        { user: req.params.userId, status: "friends" },
        { $pull: { friends: req.user.id } }
      );
      // Remove browsed user from logged user's friend posts
      await Post.updateMany(
        { user: req.user.id, status: "friends" },
        { $pull: { friends: req.params.userId } }
      );

      res.redirect(`/profile/${req.params.userId}`);
    } catch (error) {
      console.error(error);
    }
  },

  showFriendRequests: async (req, res) => {
    try {
      const userReceive = await FriendRequest.find({ receiver: req.user.id });
      const userSend = await FriendRequest.find({ sender: req.user.id });
      res.json({ userReceive, userSend });

      // res.render("partials/_friendRequests", {
      //   layout: false,
      //   userReceive,
      //   userSend,
      // });
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  },
};
