import { Router } from "restify-router";

// controllers
import { find, findOne, create, put } from "../controller/device";

import { authUser } from "../middleware/auth";

const router = new Router();
// endpoints
router.get("", find);
router.get("/:id", findOne);
router.post("", create);
router.put("/:id", put);
router.use(authUser);

export default router;
