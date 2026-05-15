const express = require("express");
const router = express.Router();
const c = require("../controllers/register.controller");

router.post("/register", c.register);
router.post("/register/buyer", c.registerBuyer);
router.post("/register/seller", c.registerSeller);

module.exports = router;
