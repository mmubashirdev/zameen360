const router = require("express").Router();
const c = require("../controllers/login.controller");
router.post("/login", c.login);
router.post("/admin/login", c.adminLogin);
router.post("/refresh", c.refresh);
router.post("/logout", c.logout);
module.exports = router;
