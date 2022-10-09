const Post = require("../models/Post");

module.exports = {
  getIndex: (req, res) => {
    try {
      // const posts = Post.find({})
    } catch (err) {
      console.error(err);
    }
    res.render("index");
  },
};
