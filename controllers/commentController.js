const CommentSchema = require("../models/CommentSchema");
// const hbCreate = require("express-handlebars").create();

module.exports = {
  saveComment: async (req, res) => {
    try {
      req.body.user = req.user.id;
      const comment = await CommentSchema.create(req.body);
      if (comment.replyTo) {
        await CommentSchema.updateOne(
          { _id: req.body.replyTo },
          { $inc: { replies: 1 } }
        );
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
      const comments = await CommentSchema.find(
        { post: req.params.postId, replyTo: req.params.commentId },
        { post: 0, replyTo: 0 }
      )
        .sort({ createdAt: "desc" })
        .populate("user", "image userName")
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

  deleteComment: async (req, res) => {
    try {
      const comment = await CommentSchema.findById(req.params.commentId, {
        user: 1,
        post: 1,
      });

      if (!comment) {
        // The user has already deleted the comment
        // or the query parameter (comment id) was incorrect
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }
      if (req.user.id !== comment.user.toString()) {
        // User somehow send a query to delete someone else's comment
        return res.redirect("/");
      }

      // Mark comment as deleted
      const update = await CommentSchema.updateOne(
        { _id: req.params.commentId },
        { deleted: true }
      );
      if (!update.acknowledged) {
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }
      res.redirect(`/post/${comment.post.toString()}`);
    } catch (error) {
      console.error(error);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },
};
