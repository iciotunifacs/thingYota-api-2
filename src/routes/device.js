const router = new (require("restify-router").Router)();

// controllers
const { find, findOne, create, put } = require("../controller/device");

const { authUser } = require("../middleware/auth");

// endpoints
router.get("", find);
router.get("/:id", findOne);
router.post("", create);
router.put("/:id", put);
router.use(authUser);

module.exports = router;
