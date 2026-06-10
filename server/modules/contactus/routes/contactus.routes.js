const router = require("express").Router();
const contactusController = require("../controller/contactus.controller");

router.post("/submit", contactusController.submitContactForm);

module.exports = router;
