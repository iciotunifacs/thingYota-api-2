const router = new (require("restify-router").Router)();

// controllers
const {
  find,
  findOne,
  create,
  put,
  createRelationShip,
} = require("../controller/bucket");

const { authUser } = require("../middleware/auth");
// endpoints
router.get("", find);
router.get("/:id", findOne);
router.post("", create);
router.put("/:id", put);
router.post("/:id/relationship", createRelationShip);

router.use(authUser);

module.exports = router;
