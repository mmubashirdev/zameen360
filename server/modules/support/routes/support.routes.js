const router = require("express").Router();
const supportController = require("../controllers/support.controller");

router.post("/send-message", supportController.sendSupportMessage);

module.exports = router;
