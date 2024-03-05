const express = require("express");

const authorize = require("../../middlewares/authorize")
const ctrlContacts = require("../../controller/contactsController");

const router = express.Router();

router.get("/", authorize, ctrlContacts.getAll);
router.get("/:contactId", authorize,   ctrlContacts.getById);
router.post("/", authorize, ctrlContacts.add);
router.delete("/:contactId", authorize,  ctrlContacts.deleted);
router.put("/:contactId", authorize,  ctrlContacts.update);
router.patch("/:contactId/favorite", authorize,  ctrlContacts.updateFavorite);
module.exports = router;
