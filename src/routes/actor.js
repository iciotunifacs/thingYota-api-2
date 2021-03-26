const router = new (require('restify-router').Router)();

// controllers
const { find, findOne, create, put } = require('../controller/actor');

const { authUser } = require('../middleware/auth');

const { responseOk } = require('../middleware/response');

const emitMqtt = require('../middleware/mqtt').sendEmmiter;

const emitScoket = require('../middleware/socket').sendEmmiter;

// endpoints
// teste
router.get('', find);
router.get('/:id', findOne);
router.post('', create);
router.put('/:id', put, emitMqtt, emitScoket, responseOk);

router.use(authUser);

module.exports = router;
