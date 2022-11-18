const CommentSchema = require("../models/CommentSchema");
const Post = require("../models/Post");
const User = require("../models/User");
const LikePost = require("../models/LikePost");
const Bookmark = require("../models/Bookmark");
const FriendRequest = require("../models/FriendRequest");
const cloudinary = require("../middleware/cloudinary");
require("dotenv").config({ path: "../config/.env" });

module.exports = {
  getProfile: async (req, res) => {
    try {
      let posts;
      let comments;
      let hasRequest;
      let hasOppositeRequest;
      let isFriend;
      let isOwnProfile;
      const loggedUser = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
        bookmarks: req.user.bookmarks,
        language: req.user.language,
      };
      const browsedUser = await User.findOne(
        { _id: req.params.userId },
        {
          userName: 1,
          image: 1,
          rating: 1,
          bio: 1,
          friends: 1,
        }
      ).lean();
      if (req.user.id === req.params.userId) {
        isOwnProfile = true;
        posts = await Post.find(
          { user: req.params.userId, deleted: false },
          {
            cloudinaryId: 0,
            status: 0,
            friends: 0,
            deleted: 0,
          }
        )
          .sort({ createdAt: "desc" })
          .lean();
        posts = await Promise.all(
          posts.map(async (post) => {
            post.isOwnPost = true;
            post.isBookmarked = await Bookmark.exists({
              user: req.user.id,
              post: post._id,
            });
            return post;
          })
        );
        comments = await CommentSchema.find(
          { user: req.user.id, deleted: false },
          { replyTo: 0, deleted: 0 }
        )
          .sort({ createdAt: "desc" })
          .populate([
            { path: "user", select: "image userName" },
            { path: "post", select: "title" },
          ])
          .lean();
        comments.forEach((comment) => {
          comment.isOwnComment = true;
        });
      } else {
        // Check if users are friends
        isFriend =
          browsedUser.friends.some(
            (friend) => friend.toString() === req.user.id
          ) &&
          req.user.friends.some(
            (friend) => friend.toString() === browsedUser._id.toString()
          );

        // DB query for posts depending on whether
        // the logged user is a friend

        posts = await Post.find(
          {
            user: req.params.userId,
            $or: [
              { status: "public" },
              { status: "friends", friends: req.user.id },
            ],
            deleted: false,
          },
          {
            cloudinaryId: 0,
            status: 0,
            friends: 0,
            deleted: 0,
          }
        )
          .sort({ createdAt: "desc" })
          .lean();

        // Check for each post if logged user has already liked
        // and bookmarked the post to be able to adjust appropriate styling
        posts = await Promise.all(
          posts.map(async (post) => {
            post.isOwnPost = false;
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

        // Check for friend requests for further rendering appropriate btns
        hasRequest = await FriendRequest.exists({
          sender: req.user.id,
          receiver: browsedUser._id,
        });
        hasOppositeRequest = await FriendRequest.exists({
          sender: browsedUser._id,
          receiver: req.user.id,
        });
      }
      res.render("profile/profile", {
        title: `${browsedUser.userName}'s profile`,
        posts,
        loggedUser,
        browsedUser,
        comments,
        hasRequest,
        hasOppositeRequest,
        isFriend,
        isOwnProfile,
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
      if (req.user.id !== req.params.userId) {
        // add "you can't access this page"
        return res.redirect("/");
      }
      const loggedUser = {
        name: req.user.userName,
        id: req.user.id,
        image: req.user.image,
        bio: req.user.bio,
        bookmarks: req.user.bookmarks,
        language: req.user.language,
      };
      res.render("profile/profileSettings", {
        title: `${req.user.userName}'s profile settings`,
        loggedUser,
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
    // Should be a possibility to user to reset his bio to default
    try {
      if (req.user.id !== req.params.userId) {
        return res.redirect("/");
      }

      // Check if form has no data to change user profile data to
      if (
        !req.file &&
        Object.values(req.body).every((formData) => !formData.trim())
      ) {
        return res.redirect(`/profile/${req.user.id}`);
      }

      // Grab non-empty data from req.file and req.body
      // to single updateParams object
      let updateParams = {};
      for (const key in req.body) {
        if (req.body[key].trim()) {
          updateParams[key] = req.body[key];
        }
      }

      // If user changes avatar, upload that image to cloudinary,
      // delete the old one and add needed data to updateParams
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: `socister/${req.user.id}/avatar`,
        });
        if (req.user.image !== process.env.DEFAULT_AVATAR_LINK) {
          await cloudinary.api.delete_resources([req.user.cloudinaryId]);
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
      const update = await User.updateOne({ _id: req.user.id }, updateParams, {
        runValidators: true,
      });
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
