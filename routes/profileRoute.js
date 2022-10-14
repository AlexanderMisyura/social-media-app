const profileController = require("../controllers/profileController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

// @desc Show a single user's profile (own or another user)
// @route GET /profile/:userId
router.get("/:id", ensureAuth, profileController.getProfile);
router.get("/settings/:id", ensureAuth, profileController.getProfileSettings);

module.exports = router;
