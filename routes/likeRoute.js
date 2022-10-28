const likeController = require("../controllers/likeController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

router.put("/post/:postId", likeController.toggleLike);

module.exports = router;
