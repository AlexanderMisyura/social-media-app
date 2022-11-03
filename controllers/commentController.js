const CommentSchema = require("../models/CommentSchema");
// const hbCreate = require("express-handlebars").create();

module.exports = {
  saveComment: async (req, res) => {
    try {
      req.body.user = req.user.id;
      const comment = await CommentSchema.create(req.body);
      if (comment.replyTo) {
        await CommentSchema.findByIdAndUpdate(req.body.replyTo, {
          $inc: { replies: 1 },
        });
      }
      res.redirect(`/post/${req.body.post}`);
    } catch (error) {
      console.error(error);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },

  getChildComments: async (req, res) => {
    try {
      const loggedUser = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
      };
      const comments = await CommentSchema.find({
        post: req.params.postId,
        replyTo: req.params.commentId,
      })
        .populate("user")
        .lean();
      res.render("partials/_comments", {
        layout: false,
        comments,
        loggedUser,
        post: { _id: req.params.postId },
      });
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  },
};
