const Post = require("../models/Post");
const cloudinary = require("../middleware/cloudinary");
const mongoose = require("mongoose");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image
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
      res.render("error/500");
    }
  },

  getAddPost: (req, res) => {
    const user = {
      name: req.user.userName,
      id: req.user.id,
      image: req.user.image
    };
    res.render("posts/add", { title: "Socister | Create an awsome new post", user });
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
        folder: `socister/posts/${req.user.id}/${postId}`,
      });

      post.image = cloudinary.url(uploadResult.public_id, {
        transformation: {
          aspect_ratio: 1,
          crop: "pad",
          fetch_format: "auto",
          quality: "auto",
          background: "auto",
        },
      });
      post.cloudinaryId = uploadResult.public_id;
      await post.save();

      res.redirect(`/post/${postId}`);
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  getPost: async (req, res) => {
    try {
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image
      };
      const post = await Post.findById(req.params.id).populate("user").lean();
      if (!post) {
        return res.send("error");
      }
      res.render("posts/post", { title: `Socister | ${post.title}`, user, post });
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },
};
