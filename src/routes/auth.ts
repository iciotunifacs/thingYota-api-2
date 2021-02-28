// const router = new (require("restify-router").Router)();

// // controllers
// const { authUser, authDevice, authGuest } = require("../controller/auth");

// // endpoints
// router.post("/login", authUser);
// router.post("/device", authDevice);
// router.post("/guest", authGuest);

// module.exports = router;

import { Router } from "restify-router";
import { authUser, authDevice, authGuest } from "../controller/auth";
const router = new Router();

// endpoints
router.post("/login", authUser);
router.post("/device", authDevice);
router.post("/guest", authGuest);

export default router;
