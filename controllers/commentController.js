const CommentSchema = require("../models/CommentSchema");
const Post = require("../models/Post");
// const hbCreate = require("express-handlebars").create();

module.exports = {
  saveComment: async (req, res) => {
    try {
      req.body.user = req.user.id;
      const comment = await CommentSchema.create(req.body);
      await Post.updateOne({ _id: req.body.post }, { $inc: { comments: 1 } });
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
      comments.forEach(
        (comment) =>
          (comment.isOwnComment = req.user.id === comment.user._id.toString())
      );
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
      const comment = await CommentSchema.findOne(
        { _id: req.params.commentId, user: req.user.id, deleted: false },
        {
          user: 1,
          post: 1,
          replyTo: 1,
          replies: 1,
        }
      );

      if (!comment) {
        // The user has already deleted the comment
        // or the query parameter (comment id) was incorrect
        // or user tries to send a query to delete someone else's comment
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }

      // Mark comment as deleted
      const update = await CommentSchema.updateOne(
        { _id: req.params.commentId },
        { deleted: true }
      );
      if (update.acknowledged) {
        // Recursively cheks parent comments and reduce their replies if needed
        async function checkParents(comment) {
          if (comment.replyTo && !comment.replies) {
            const parent = await CommentSchema.findOneAndUpdate(
              { _id: comment.replyTo },
              { $inc: { replies: -1 } },
              { new: true, projection: { replies: 1, replyTo: 1, deleted: 1 } }
            );
            if (parent.deleted) {
              checkParents(parent);
            }
          }
        }
        checkParents(comment);
      } else {
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }

      res.redirect("back");

    } catch (error) {
      console.error(error);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },
};
