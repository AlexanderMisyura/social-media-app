const commentController = require("../controllers/commentController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

router.post("/", ensureAuth, commentController.saveComment);

module.exports = router;
