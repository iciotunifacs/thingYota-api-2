const router = new (require("restify-router").Router)();

// controllers
const { find, findOne, create, put } = require("../controller/sensor");

const { authUser } = require("../middleware/auth");

const { responseOk } = require("../middleware/response");

const emitScoket = require("../middleware/socket").sendEmmiter;

// endpoints
router.get("", find);
router.get("/:id", findOne);
router.post("", create);
router.put("/:id", put, emitScoket, responseOk);

router.use(authUser);

module.exports = router;
