const bookmarkController = require("../controllers/bookmarkController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

router.put("/:postId", ensureAuth, bookmarkController.toggleBookmark);
router.get("/", ensureAuth, bookmarkController.getBookmarkedPosts);

module.exports = router;
