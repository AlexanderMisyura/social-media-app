const Post = require("../models/Post");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const posts = await Post.find().sort({ creationDate: "desc" }).populate("user").lean();
      res.render("index", { title: "Socister | Feed", posts});
    } catch (err) {
      console.error(err);
    }
  },

  getAddPost: (req, res) => {
    res.render("posts/add", { title: "Socister | Create an awsome new post" });
  },
};
