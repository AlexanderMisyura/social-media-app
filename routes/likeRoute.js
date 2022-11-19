const likeController = require("../controllers/likeController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

router.put("/post/:postId", ensureAuth, likeController.togglePostLike);
router.put("/comment/:commentId", ensureAuth, likeController.toggleCommentLike);

module.exports = router;
