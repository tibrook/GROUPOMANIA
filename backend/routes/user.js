const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const limiterBruteforce = require("../middlewares/rateLimiter")

router.post("/signup", limiterBruteforce.register, userCtrl.signup);
router.post("/login", limiterBruteforce.login, userCtrl.login);

module.exports = router;
