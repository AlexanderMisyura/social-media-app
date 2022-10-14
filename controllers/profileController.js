const CommentSchema = require("../models/CommentSchema");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      let posts;
      let comments;
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image
      };
      let browsedUser = await User.findOne({ _id: req.params.id }).lean();
      if (req.user.id === req.params.id) {
        posts = await Post.find({ user: req.user.id, deleted: false })
          .populate("user")
          .sort({ createdAt: "desc" })
          .lean();
        comments = {
          bodies: await CommentSchema.find({ user: req.user.id }).lean(),
          count: await CommentSchema.count({ user: req.user.id }),
        };
      } else {
        posts = await Post.find({
          user: req.user.id,
          status: "public",
          deleted: false,
        })
          .populate("user")
          .sort({ creationDate: "desc" })
          .lean();
        comments = {
          count: await CommentSchema.count({ user: req.params.id }),
        };
      }
      res.render("profile/profile", {
        title: `${browsedUser.userName}'s profile`,
        posts,
        user,
        browsedUser,
        comments,
      });
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  getProfileSettings: async(req, res) => {
    try {
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image
      };
      const browsedUser = await User.findById(req.user.id).lean();
      res.render("profile/profileSettings", {title: `${browsedUser.userName}'s profile settings`, user, browsedUser});
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }
};
