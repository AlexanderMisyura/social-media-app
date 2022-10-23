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
router.get("/:id", ensureAuth, postsController.getPost);
router.get("/edit/:id", ensureAuth, postsController.getEditPost);
router.put("/:id", ensureAuth, postsController.updatePost);

module.exports = router;
