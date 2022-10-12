const CommentSchema = require("../models/CommentSchema");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      let posts;
      let comments;
      let user = await User.findOne({ id: req.params.id }).lean();
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
      res.render("profile", { posts, comments, user, title: `${user.userName}'s profile` });
    } catch (err) {
      console.error(err);
    }
  },
};
