const router = require("express").Router();
const authController = require("../controllers/authController");
const postsController = require("../controllers/postsController");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/login", ensureGuest, authController.getLogin);
router.post("/login", ensureGuest, authController.postLogin);
router.get("/signup", ensureGuest, authController.getSignup);
router.post("/signup", ensureGuest, authController.postSignup);
router.get("/logout", ensureAuth, authController.getLogout);
router.get("/", ensureAuth, postsController.getIndex);

module.exports = router;
