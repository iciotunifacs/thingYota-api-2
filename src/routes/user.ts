import { Router } from "restify-router";

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

const router = new Router();
// endpoints
router.get("", find);
router.get("/:id", findOne);
router.post("", create);
router.put("/:id", put);
router.post("/:id/relationship", createRelationShip);
router.del("/:id/relationship", deleteRelationShip);
router.use(authUser);

export default router;
