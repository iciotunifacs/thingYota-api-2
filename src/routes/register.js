const
    Router = require('restify-router').Router,
    router = new Router()

const {
  authUser
} = require('../middleware/auth')

// controllers
const {
  find,
  findOne,
  create
} = require('../controller/register');

// endpoints
router.get('',find);
router.get('/:id',findOne);
router.post('',create);

router.use(authUser)

module.exports = router;