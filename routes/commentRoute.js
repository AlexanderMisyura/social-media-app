const commentController = require("../controllers/commentController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

router.post("/", ensureAuth, commentController.saveComment);
router.get(
  "/:postId/:commentId",
  ensureAuth,
  commentController.getChildComments
);
router.put("/:commentId", ensureAuth, commentController.deleteComment);

module.exports = router;
