const express = require("express");

const authorize = require("../../middlewares/authorize");
const ctrlUsers = require("../../controller/userController");
const upload = require("../../middlewares/avatarMiddlewares");

const router = express.Router();

router.post("/signup", ctrlUsers.signup);
router.post("/login", ctrlUsers.login);
router.get("/logout", authorize, ctrlUsers.logout);
router.get("/current", authorize, ctrlUsers.getUserFromToken);
router.patch("/", authorize, ctrlUsers.updateSubscription);
router.patch("/avatars", authorize, upload, ctrlUsers.updateAvatar);
router.get("/verify/:verificationToken", ctrlUsers.verifyUserByToken);



module.exports = router;
