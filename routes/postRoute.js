const postsController = require("../controllers/postsController");
const { ensureAuth } = require("../middleware/auth");
router = require("express").Router();

router.get("/add", ensureAuth, postsController.getAddPost);

module.exports = router;
