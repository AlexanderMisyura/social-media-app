const Post = require("../models/Post");
const LikePost = require("../models/LikePost");
const Bookmark = require("../models/Bookmark");
const cloudinary = require("../middleware/cloudinary");
const mongoose = require("mongoose");
const CommentSchema = require("../models/CommentSchema");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const loggedUser = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
        bookmarks: req.user.bookmarks,
      };
      // should improve the below query with posts with status: "friends"
      // if logged user is in friend list of user which this post is
      let posts = await Post.find({ deleted: false, status: "public" })
        .sort({ createdAt: "desc" })
        .populate("user")
        .lean();

      // For each post found in DB if user has already liked it
      // to be able to adjust appropriate icon color
      posts = await Promise.all(
        posts.map(async (post) => {
          post.hasLike = await LikePost.exists({
            userId: req.user.id,
            postId: post._id,
          });
          post.isBookmarked = await Bookmark.exists({
            userId: req.user.id,
            postId: post._id,
          });
          return post;
        })
      );

      res.render("index", {
        title: "Socister | Feed",
        loggedUser,
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
    const loggedUser = {
      name: req.user.userName,
      id: req.user.id,
      image: req.user.image,
      bookmarks: req.user.bookmarks,
    };
    res.render("posts/postEditor", {
      title: "Socister | Create an awsome new post",
      loggedUser,
    });
  },

  savePost: async (req, res) => {
    try {
      req.body.user = req.user.id;
      let post = await Post.create(req.body);

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
      const loggedUser = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
        bookmarks: req.user.bookmarks,
      };

      //--------------------------------------//
      //---------- Get post from DB ----------//
      //--------------------------------------//
      const post = await Post.findOne({ _id: req.params.id, deleted: false })
        .populate("user")
        .lean();
      // Instead of the cumbersome conditional mess below should specify the above query to DB
      // which take care if logged user is not browsed user and post status: "private"
      // namely (req.user.id !== post.user._id.toString() && post.status === "private")
      // also if logged user is a friend of browsed user and post status: "friends"
      // namely (post.status === "friends" && !post.user.friends.includes(mongoose.Types.ObjectId(req.user.id)))
      if (
        // no post in DB
        !post ||
        // user looks through someone else's post and..
        (req.user.id !== post.user._id.toString() &&
          // this post is private or..
          (post.status === "private" ||
            // this post if for friends and user is not a friend
            (post.status === "friends" &&
              !post.user.friends.includes(
                mongoose.Types.ObjectId(req.user.id)
              ))))
      ) {
        // then user is not allowed to view this post
        // should make additional page for this case
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }

      //-------------------------------------------//
      //---------- Get like info from DB ----------//
      //-------------------------------------------//
      let hasLike;
      // If user looks through someone else's post
      if (req.user.id !== post.user._id.toString()) {
        // Check if user has already liked the post
        // to be able to adjust appropriate icon color
        hasLike = await LikePost.exists({
          userId: req.user.id,
          postId: req.params.id,
        });
      }

      //-------------------------------------------//
      //-------- Get bookmark info from DB --------//
      //-------------------------------------------//
      let isBookmarked = await Bookmark.exists({
        userId: req.user.id,
        postId: req.params.id,
      });

      //------------------------------------------//
      //---------- Get comments from DB ----------//
      //------------------------------------------//
      const comments = await CommentSchema.find({
        post: req.params.id,
        replyTo: null,
      })
        .sort({ createdAt: "desc" })
        .populate("user")
        .lean();

      res.render("posts/post", {
        title: `Socister | ${post.title}`,
        loggedUser,
        post,
        hasLike,
        isBookmarked,
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
    const loggedUser = {
      name: req.user.userName,
      id: req.user.id,
      image: req.user.image,
      bookmarks: req.user.bookmarks,
    };
    res.render("posts/postEditor", {
      title: `Socister | Edit "${post.title}"`,
      loggedUser,
      post,
      isEdit: true,
    });
  },

  updatePost: async (req, res) => {
    try {
      // Check if user has sent empty form
      if (Object.values(req.body).every((formData) => !formData.trim())) {
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
        if (req.body[key].trim()) {
          updateParams[key] = req.body[key];
        }
      }

      // Update post data with updateParams object
      const update = await Post.updateOne(
        { _id: req.params.id },
        updateParams,
        { runValidators: true }
      );
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

  deletePost: async (req, res) => {
    try {
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
        // User somehow send a query to delete someone else's post
        return res.redirect("/");
      }

      // Mark post as deleted
      const update = await Post.updateOne(
        { _id: req.params.id },
        { deleted: true }
      );
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
