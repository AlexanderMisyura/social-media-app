const profileController = require("../controllers/profileController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

// @desc Show a single user's profile (own or another user)
// @route GET /profile/:userId
router.get("/:id", ensureAuth, profileController.getProfile);

module.exports = router;
