const postsController = require("../controllers/postsController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();
const upload = require("../middleware/multer");

router.get("/add", ensureAuth, postsController.getAddPost);
router.post("/add", ensureAuth, upload.single("image"), postsController.savePost);
router.get("/:id", ensureAuth, postsController.getPost)

module.exports = router;
