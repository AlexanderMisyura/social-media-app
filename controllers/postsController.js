const Post = require("../models/Post");

module.exports = {
  getProfile: (req, res) => {
    res.render("profile")
  }
}