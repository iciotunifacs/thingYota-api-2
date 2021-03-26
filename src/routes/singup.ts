// const router = new (require("restify-router").Router)();

// // controllers
// const createDevice = require("../controller/device").create;
// const createUser = require("../controller/user").create;

// const { authGuest } = require("../middleware/auth");

// router.post("/user", createUser);
// router.post("/device", createDevice);

// router.use(authGuest);

// module.exports = router;

import { Router } from 'restify-router';
import { authGuest } from '../middleware/auth';
import { create as createUser } from '../controller/user';

const router = new Router();

router.post('/user', createUser);

router.use(authGuest);

export default router;
