const express = require("express");
const {
  createDescription,
  parseSearch,
} = require("../controller/ai.controller");

const router = express.Router();

router.post("/generate-description", createDescription);
router.post("/parse-search", parseSearch);

module.exports = router;
