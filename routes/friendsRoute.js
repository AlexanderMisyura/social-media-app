const friendsController = require("../controllers/friendsController");
const { ensureAuth } = require("../middleware/auth");
const router = require("express").Router();

router.post("/:userId", ensureAuth, friendsController.sendRequest);
router.delete("/:userId", ensureAuth, friendsController.cancelRequest);
router.put("/:userId", ensureAuth, friendsController.confirmRequest);
router.put("/remove/:userId", ensureAuth, friendsController.removeFromFriendsList);
router.get("/show", ensureAuth, friendsController.showFriendRequests);
module.exports = router;