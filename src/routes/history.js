const router = new (require("restify-router").Router)();

const { authUser } = require("../middleware/auth");

// controllers
const { find, findOne, delOne } = require("../controller/history");

// endpoints
router.get("", find);
router.get("/:id", findOne);
router.del("/:id",delOne );

router.use(authUser);

module.exports = router;
