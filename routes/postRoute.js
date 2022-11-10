const postsController = require("../controllers/postsController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();
const upload = require("../middleware/multer");

router.get("/add", ensureAuth, postsController.getAddPost);
router.post(
  "/add",
  ensureAuth,
  upload.single("image"),
  postsController.savePost
);
router.get("/:postId", ensureAuth, postsController.getPost);
router.get("/edit/:postId", ensureAuth, postsController.getEditPost);
router.put("/:postId", ensureAuth, postsController.updatePost);
router.put("/delete/:postId", ensureAuth, postsController.deletePost);

module.exports = router;
