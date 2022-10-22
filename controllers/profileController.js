const CommentSchema = require("../models/CommentSchema");
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");
require("dotenv").config({ path: "../config/.env" });

module.exports = {
  getProfile: async (req, res) => {
    try {
      let posts;
      let comments;
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
      };
      let browsedUser = await User.findOne({ _id: req.params.id }).lean();
      if (req.user.id === req.params.id) {
        posts = await Post.find({ user: req.params.id, deleted: false })
          .populate("user")
          .sort({ createdAt: "desc" })
          .lean();
        comments = {
          bodies: await CommentSchema.find({ user: req.user.id }).lean(),
          count: await CommentSchema.count({ user: req.user.id }),
        };
      } else {
        posts = await Post.find({
          user: req.params.id,
          status: "public",
          deleted: false,
        })
          .populate("user")
          .sort({ creationDate: "desc" })
          .lean();
        comments = {
          count: await CommentSchema.count({ user: req.params.id }),
        };
      }
      res.render("profile/profile", {
        title: `${browsedUser.userName}'s profile`,
        posts,
        user,
        browsedUser,
        comments,
      });
    } catch (err) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },

  getProfileSettings: async (req, res) => {
    try {
      if (req.user.id !== req.params.id) {
        // add "you can't access this page"
        return res.redirect("/");
      }
      const user = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
        bio: req.user.bio,
      };
      res.render("profile/profileSettings", {
        title: `${req.user.userName}'s profile settings`,
        user,
      });
    } catch (err) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      if (req.user.id !== req.params.id) {
        return res.redirect("/");
      }
      // Delete _method property added to req.body by method-override
      if ("_method" in req.body) {
        delete req.body["_method"];
      }
      // Check if form has no data to change user profile data to
      if (!req.file && !Object.values(req.body).every((formData) => formData)) {
        return res.redirect(`/profile/settings/${req.user.id}`);
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }

      // Grab non-empty data from req.file and req.body
      // to single updateParams object
      let updateParams = {};
      for (const key in req.body) {
        if (key !== "_method" && req.body[key]) {
          updateParams[key] = req.body[key];
        }
      }

      // If user changes avatar, upload that image to cloudinary,
      // delete the old one and add needed data to updateParams
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: `socister/${req.user.id}/avatar`,
        });
        if (user.image !== process.env.DEFAULT_AVATAR_LINK) {
          await cloudinary.api.delete_resources([user.cloudinaryId]);
        }
        updateParams.image = cloudinary.url(uploadResult.public_id, {
          transformation: {
            width: 128,
            aspect_ratio: 1,
            crop: "pad",
            fetch_format: "auto",
            quality: "auto",
            background: "auto",
          },
        });
        updateParams.cloudinaryId = uploadResult.public_id;
      }

      // Update user data with updateParams object
      const update = await User.updateOne({ _id: req.user.id }, updateParams);
      if (!update.acknowledged) {
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }

      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      console.error(err);
      res.render("error/500", {
        layout: "narrow",
        title: "500 SOMETHING WENT WRONG",
      });
    }
  },
};
