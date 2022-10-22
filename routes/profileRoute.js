const profileController = require("../controllers/profileController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();
const upload = require("../middleware/multer");

// @desc Show a single user's profile (own or another user)
// @route GET /profile/:userId
router.get("/:id", ensureAuth, profileController.getProfile);
router.get("/settings/:id", ensureAuth, profileController.getProfileSettings);
router.put(
  "/:id",
  ensureAuth,
  upload.single("image"),
  profileController.updateProfile
);
// router.get("/passwordChange", ensureAuth, profileController.);

module.exports = router;
