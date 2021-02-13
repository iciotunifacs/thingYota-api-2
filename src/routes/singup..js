const router = new (require("restify-router").Router)();

// controllers
const createDevice = require("../controller/device").create;
const createUser = require("../controller/user").create;

const { authGuest } = require("../middleware/auth");

router.post("/user", createUser);
router.post("/device", createDevice);

router.use(authGuest);

module.exports = router;
