const router = require("express").Router();
const c = require("../controllers/login.controller");
router.post("/login", c.login);
router.post("/admin/login", c.adminLogin);
module.exports = router;
