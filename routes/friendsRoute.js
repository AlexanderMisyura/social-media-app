const friendsController = require("../controllers/friendsController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

router.post("/:userId", ensureAuth, friendsController.sendRequest);
router.delete("/:userId", ensureAuth, friendsController.cancelOwnRequest);
router.put("/confirm/:userId", ensureAuth, friendsController.confirmRequest);
router.put("/reject/:userId", ensureAuth, friendsController.rejectRequest);
router.put(
  "/remove/:userId",
  ensureAuth,
  friendsController.removeFromFriendsList
);

module.exports = router;
