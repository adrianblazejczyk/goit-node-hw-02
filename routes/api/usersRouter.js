const express = require("express");
const ctrlUsers = require("../../controller/userController");
const router = express.Router();
const authorize = require("../../middlewares/authorize")

router.post("/signup", ctrlUsers.signup);
router.post("/login", ctrlUsers.login);
router.get("/logout",authorize, ctrlUsers.logout);
router.get("/current",authorize, ctrlUsers.getUserFromToken);
router.patch("/",authorize, ctrlUsers.updateSubscription);

module.exports = router;
