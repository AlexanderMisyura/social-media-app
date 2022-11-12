const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const Post = require("../models/Post");

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
      await User.updateOne(
        { _id: req.params.userId },
        { $pull: { friends: req.user.id } }
      );
      await Post.updateMany(
        { user: req.params.userId, status: "friends" },
        { $pull: { friends: req.user.id } }
      );

      await User.updateOne(
        { _id: req.user.id },
        { $pull: { friends: req.params.userId } }
      );
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
