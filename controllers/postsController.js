const Post = require("../models/Post");
const LikePost = require("../models/LikePost");
const LikeComment = require("../models/LikeComment");
const Bookmark = require("../models/Bookmark");
const cloudinary = require("../middleware/cloudinary");
const mongoose = require("mongoose");
const CommentSchema = require("../models/CommentSchema");
const User = require("../models/User");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const loggedUser = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
        bookmarks: req.user.bookmarks,
        language: req.user.language,
      };
      // should improve the below query with posts with status: "friends"
      // if logged user is in friend list of user which this post is
      let posts = await Post.find(
        {
          deleted: false,
          $or: [
            { user: req.user.id },
            { status: "public" },
            { status: "friends", friends: req.user.id },
          ],
        },
        {
          cloudinaryId: 0,
          status: 0,
          friends: 0,
          deleted: 0,
        }
      )
        .sort({ createdAt: "desc" })
        .populate("user", "image userName")
        .lean();

      // For each post found in DB check if user has already
      // liked and bookmarked it to be able to set appropriate styling
      posts = await Promise.all(
        posts.map(async (post) => {
          post.isOwnPost = req.user.id === post.user._id.toString();
          post.hasLike = await LikePost.exists({
            user: req.user.id,
            post: post._id,
          });
          post.isBookmarked = await Bookmark.exists({
            user: req.user.id,
            post: post._id,
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
      language: req.user.language,
    };
    res.render("posts/postEditor", {
      title: "Socister | Create an awsome new post",
      loggedUser,
    });
  },

  savePost: async (req, res) => {
    try {
      req.body.user = req.user.id;
      if (req.body.status === "friends") {
        req.body.friends = req.user.friends;
      }
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
        language: req.user.language,
      };

      //--------------------------------------//
      //---------- Get post from DB ----------//
      //--------------------------------------//
      const post = await Post.findOne(
        {
          _id: req.params.postId,
          deleted: false,
          $or: [
            { user: req.user.id },
            { status: "public" },
            { status: "friends", friends: req.user.id },
          ],
        },
        {
          cloudinaryId: 0,
          status: 0,
          friends: 0,
          deleted: 0,
        }
      )
        .populate("user", "image userName")
        .lean();

      if (!post) {
        // then user is not allowed to view this post
        // should make additional page for this case
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }
      // Check if user view his own post
      post.isOwnPost = req.user.id === post.user._id.toString();

      //-------------------------------------------//
      //---------- Get like info from DB ----------//
      //-------------------------------------------//
      post.hasLike = post.isOwnPost
        ? false
        : await LikePost.exists({
            user: req.user.id,
            post: req.params.postId,
          });

      //-------------------------------------------//
      //-------- Get bookmark info from DB --------//
      //-------------------------------------------//
      let isBookmarked = await Bookmark.exists({
        user: req.user.id,
        post: req.params.postId,
      });

      //------------------------------------------//
      //---------- Get comments from DB ----------//
      //------------------------------------------//
      let comments = await CommentSchema.find(
        {
          post: req.params.postId,
          replyTo: null,
        },
        { post: 0, replyTo: 0 }
      )
        .sort({ createdAt: "desc" })
        .populate("user", "image userName")
        .lean();
      comments = await Promise.all(
        comments.map(async (comment) => {
          comment.isOwnComment = req.user.id === comment.user._id.toString();
          comment.hasLike = await LikeComment.exists({
            user: req.user.id,
            comment: comment._id,
          });
          return comment;
        })
      );

      res.render("posts/post", {
        title: `Socister | ${post.title}`,
        loggedUser,
        post,
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
    const post = await Post.findById(req.params.postId, {
      user: 1,
      title: 1,
      image: 1,
      caption: 1,
    }).lean();
    if (!post) {
      return res.render("error/404", {
        layout: "narrow",
        title: "404 NOT FOUND",
      });
    }
    if (req.user.id !== post.user.toString()) {
      // Add "you can't access this page"
      return res.redirect("/");
    }
    const loggedUser = {
      name: req.user.userName,
      id: req.user.id,
      image: req.user.image,
      bookmarks: req.user.bookmarks,
      language: req.user.language,
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
        return res.redirect(`/post/${req.params.postId}`);
      }
      const post = await Post.findById(req.params.postId, { user: 1 }).lean();
      if (!post) {
        // The user has already deleted the post he edit
        // or the query parameter (post id) was incorrect
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }
      if (req.user.id !== post.user.toString()) {
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
        { _id: req.params.postId },
        updateParams,
        { runValidators: true }
      );
      if (!update.acknowledged) {
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }
      res.redirect(`/post/${req.params.postId}`);
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
      const post = await Post.findById(req.params.postId, { user: 1 }).lean();
      if (!post) {
        // The user has already deleted the post he edit
        // or the query parameter (post id) was incorrect
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }

      if (req.user.id !== post.user.toString()) {
        // User somehow send a query to delete someone else's post
        return res.redirect("/");
      }

      // Mark post as deleted
      const update = await Post.updateOne(
        { _id: req.params.postId },
        { deleted: true }
      );
      if (!update.acknowledged) {
        return res.render("error/404", {
          layout: "narrow",
          title: "404 NOT FOUND",
        });
      }

      // Delete all bookmarks related to the post
      const bookmarksWithDeletedPost = await Bookmark.find(
        { post: req.params.postId },
        { user: 1, _id: 0 }
      );
      await Promise.all(
        bookmarksWithDeletedPost.map(
          async (bookmark) =>
            await User.updateOne(
              { _id: bookmark.user },
              { $inc: { bookmarks: -1 } }
            )
        )
      );
      await Bookmark.deleteMany({
        post: req.params.postId,
      });

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
