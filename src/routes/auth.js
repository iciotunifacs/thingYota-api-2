const router = new (require("restify-router").Router)();

// controllers
const { authUser, authDevice, authGuest } = require("../controller/auth");

// endpoints
router.post("/login", authUser);
router.post("/device", authDevice);
router.post("/guest", authGuest);

module.exports = router;
