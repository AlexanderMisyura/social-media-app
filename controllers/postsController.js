const Post = require("../models/Post");
const cloudinary = require("../middleware/cloudinary");
const mongoose = require("mongoose");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
      };
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("user")
        .lean();
      res.render("index", {
        title: "Socister | Feed",
        user,
        posts,
      });
    } catch (err) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },

  getAddPost: (req, res) => {
    const user = {
      name: req.user.userName,
      id: req.user.id,
      image: req.user.image,
    };
    res.render("posts/postEditor", {
      title: "Socister | Create an awsome new post",
      user,
    });
  },

  savePost: async (req, res) => {
    try {
      let post = await Post.create({
        title: req.body.title,
        caption: req.body.caption,
        user: mongoose.Types.ObjectId(req.user.id),
        status: req.body.status,
      });

      const postId = post._id.toString();
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: `socister/${req.user.id}/posts/${postId}`,
      });

      post.image = cloudinary.url(uploadResult.public_id, {
        transformation: {
          aspect_ratio: 1,
          crop: "pad",
          fetch_format: "auto",
          quality: "auto",
          background: "auto",
        },
        secure: true,
      });
      post.cloudinaryId = uploadResult.public_id;
      await post.save();

      res.redirect(`/post/${postId}`);
    } catch (err) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },

  getPost: async (req, res) => {
    try {
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
      };
      const post = await Post.findById(req.params.id).populate("user").lean();
      if (!post) {
        return res.send("error");
      }
      res.render("posts/post", {
        title: `Socister | ${post.title}`,
        user,
        post,
      });
    } catch (err) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },

  getEditPost: async (req, res) => {
    const post = await Post.findById(req.params.id).populate("user").lean();
    if (!post) {
      return res.render("error/404", {
        layout: "narrow",
        title: "404 NOT FOUND",
      });
    }
    if (req.user.id !== post.user._id.toString()) {
      // Add "you can't access this page"
      return res.redirect("/");
    }
    const user = {
      name: req.user.userName,
      id: req.user.id,
      image: req.user.image,
    };
    res.render("posts/postEditor", {
      title: `Socister | Edit "${post.title}"`,
      user,
      post,
      isEdit: true,
    });
  },

  updatePost: async (req, res) => {
    try {
      // Check if user has sent empty form
      if (Object.values(req.body).every((formData) => !formData)) {
        return res.redirect(`/post/${req.params.id}`);
      }
      const post = await Post.findById(req.params.id).populate("user").lean();
      if (!post) {
        // The user has already deleted the post he edit
        // or the query parameter (post id) was incorrect
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }
      if (req.user.id !== post.user._id.toString()) {
        // User somehow send a query to edit someone else's post
        return res.redirect("/");
      }

      // Grab non-empty data from req.body
      // to updateParams object
      let updateParams = {};
      for (const key in req.body) {
        if (req.body[key]) {
          updateParams[key] = req.body[key];
        }
      }

      // Update post data with updateParams object
      const update = await Post.updateOne({ _id: req.params.id }, updateParams);
      if (!update.acknowledged) {
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },
};
