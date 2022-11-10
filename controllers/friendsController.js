const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

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

      if (hasRequest || hasRespondingRequest) {
        return res.send("failure");
      }

      const createdFriendRequest = await FriendRequest.create({
        sender: req.user.id,
        receiver: req.params.userId,
      });

      if (createdFriendRequest) {
        res.send("success");
      }
    } catch (error) {
      console.error(error);
    }
  },

  cancelRequest: async (req, res) => {
    try {
      const hasRequest = await FriendRequest.exists({
        sender: req.user.id,
        receiver: req.params.userId,
      });
      if (!hasRequest) {
        return res.send("failure");
      }
      const deletedFriendRequest = await FriendRequest.deleteOne({
        sender: req.user.id,
        receiver: req.params.userId,
      });
      console.log("deletedFriendRequest :>> ", deletedFriendRequest);
      if (deletedFriendRequest) {
        res.send("success");
      }
    } catch (error) {
      console.error(error);
    }
  },

  confirmRequest: async (req, res) => {
    try {
      const sender = User.findByIdAndUpdate(req.params.userId, {
        $push: { friends: req.user.id },
      });
      console.log(
        "🚀 ~ file: friendsController.js ~ line 68 ~ confirmRequest: ~ sender",
        sender
      );
      const receiver = await User.findByIdAndUpdate(req.user.id, {
        $push: { friends: req.params.userId },
      });
      console.log(
        "🚀 ~ file: friendsController.js ~ line 72 ~ confirmRequest: ~ receiver",
        receiver
      );
      const friendRequest = FriendRequest.deleteOne({
        sender: req.params.userId,
        receiver: req.user.id,
      });
      console.log(
        "🚀 ~ file: friendsController.js ~ line 77 ~ confirmRequest: ~ friendRequest",
        friendRequest
      );
      const userFriendRequest = FriendRequest.deleteOne({
        sender: req.user.id,
        receiver: req.params.userId,
      });
      console.log(
        "🚀 ~ file: friendsController.js ~ line 82 ~ confirmRequest: ~ userFriendRequest",
        userFriendRequest
      );
    } catch (error) {
      console.error(error);
    }
  },

  removeFromFriendsList: async (req, res) => {
    try {
      const removeSelfFromUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: { friends: req.user.id },
        }
      );
      console.log(
        "🚀 ~ file: friendsController.js ~ line 62 ~ removeFromFriendsList: ~ removeSelfFromUser",
        removeSelfFromUser
      );
      const removeUserFromSelf = await User.findByIdAndUpdate(req.user.id, {
        $pull: { friends: req.params.userId },
      });
      console.log(
        "🚀 ~ file: friendsController.js ~ line 81 ~ removeFromFriendsList: ~ removeUserFromSelf",
        removeUserFromSelf
      );
    } catch (error) {
      console.error(error);
    }
  },

  showFriendRequests: async (req, res) => {
    try {
      const userReceive = await FriendRequest.find({ receiver: req.user.id });
      const userSend = await FriendRequest.find({ sender: req.user.id });
      res.json({userReceive, userSend});

      // res.render("partials/_friendRequests", {
      //   layout: false,
      //   userReceive,
      //   userSend,
      // });

    } catch (error) {
      console.error(error);
      res.send(error);
    }

    res.json(friendList);
  },
};
