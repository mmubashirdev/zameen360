const router = require("express").Router();
router.use(require("./register.routes"));
router.use(require("./login.routes"));
router.use(require("./otp.routes"));
router.use(require("./password.routes"));
router.use(require("./profile.routes"));

router.use(require("./admin.routes"));
module.exports = router;