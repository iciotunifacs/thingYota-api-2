import { Router } from "restify-router";

// controllers
import {
  find,
  findOne,
  create,
  put,
  createRelationShip,
  deleteRelationShip,
} from "../controller/user";

import { authUser } from "../middleware/auth";

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
