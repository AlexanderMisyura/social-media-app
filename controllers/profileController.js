const CommentSchema = require("../models/CommentSchema");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      console.log(req.user.id === req.params.id); // true
      const user = await User.findOne({ _id: req.user.id });
      const posts = await Post.find({ user: req.user.id });
      const comments = await CommentSchema.find({ user: req.user.id });
      res.render("profile");
    } catch (err) {
      console.error(err);
    }
  },
};
