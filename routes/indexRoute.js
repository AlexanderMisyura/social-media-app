const router = require("express").Router();
const authController = require("../controllers/authController");
const indexController = require("../controllers/indexController");
const postsController = require("../controllers/postsController");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureGuest, indexController.getIndex);
router.get("/login", ensureGuest, authController.getLogin);
router.post("/login", ensureGuest, authController.postLogin);
router.get("/signup", ensureGuest, authController.getSignup);
router.post("/signup", ensureGuest, authController.postSignup);

module.exports = router;
