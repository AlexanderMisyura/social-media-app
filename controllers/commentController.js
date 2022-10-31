const CommentSchema = require("../models/CommentSchema");

module.exports = {
  saveComment: async (req, res) => {
    try {
      console.log(req.body)
      req.body.user = req.user.id;
      req.body.post = req.params.postId;
      console.log(req.body);
      res.json(req.body)
    } catch (error) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  }
}