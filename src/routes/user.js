const router = new (require("restify-router").Router)();

// controllers
const {
  find,
  findOne,
  create,
  put,
  createRelationShip,
  deleteRelationShip,
} = require("../controller/user");

const { authUser } = require("../middleware/auth");

// endpoints
router.get("", find);
router.get("/:id", findOne);
router.post("", create);
router.put("/:id", put);
router.post("/:id/relationship", createRelationShip);
router.del("/:id/relationship", deleteRelationShip);
router.use(authUser);
module.exports = router;
