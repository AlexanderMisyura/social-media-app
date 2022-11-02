const CommentSchema = require("../models/CommentSchema");

module.exports = {
  saveComment: async (req, res) => {
    try {
      req.body.user = req.user.id;
      const comment = await CommentSchema.create(req.body);
      if (!comment) {
        return console.error(error);
      }
      if (comment.replyTo) {
        await CommentSchema.findByIdAndUpdate(req.body.replyTo, {
          $inc: { replies: 1 },
        });
      }
      res.json(req.body);
    } catch (error) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },
};
